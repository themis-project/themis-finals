require './lib/utils/logger'
require 'beaneater'
require './lib/controllers/contest'
require 'json'
require 'themis/checker/result'


module Themis
    module Queue
        def self.enqueue(channel, data, opts = {})
            beanstalk = Beaneater.new Themis::Configuration::get_beanstalk_uri
            tube = beanstalk.tubes[channel]
            tube.put data, **opts
            beanstalk.close
        end

        def self.run
            logger = Themis::Utils::Logger::get
            beanstalk = Beaneater.new Themis::Configuration::get_beanstalk_uri
            logger.info 'Connected to beanstalk server'

            tubes_namespace = 'volgactf'

            beanstalk.jobs.register "#{tubes_namespace}.main" do |job|
                begin
                    case job.body
                    when 'push'
                        contest_state = Themis::Models::ContestState.last
                        if not contest_state.nil? and contest_state.state == :contest
                            Themis::Controllers::Contest::push_flags
                        end
                    when 'poll'
                        contest_state = Themis::Models::ContestState.last
                        unless contest_state.nil?
                            if [:contest, :completion].include? contest_state.state
                                Themis::Controllers::Contest::poll_flags
                            elsif contest_state.state == :break
                                Themis::Controllers::Contest::prolong_flag_lifetimes
                            end
                        end
                    when 'update'
                        contest_state = Themis::Models::ContestState.last
                        if not contest_state.nil? and [:contest, :completion].include? contest_state.state
                            Themis::Controllers::Contest::update_scores
                        end
                    else
                        logger.warn "Unknown job #{job.body}"
                    end
                rescue Exception => e
                    logger.error "#{e}"
                end
            end

            Themis::Models::Service.all.each do |service|
                beanstalk.jobs.register "#{tubes_namespace}.service.#{service.alias}.report" do |job|
                    begin
                        job_data = JSON.parse job.body
                        case job_data['operation']
                        when 'push'
                            flag = Themis::Models::Flag.first(:flag => job_data['flag'])
                            unless flag.nil?
                                if job_data['status'] == Themis::Checker::Result::UP
                                    flag.pushed_at = DateTime.now
                                    expires = Time.now + Themis::Configuration.get_contest_flow.flag_lifetime
                                    flag.expired_at = expires.to_datetime
                                    flag.seed = job_data['flag_id']
                                    flag.save
                                    logger.info "Performed job #{job.body}"
                                end
                            end
                        when 'pull'
                            logger.info "Performing job #{job.body}"
                        else
                            logger.warn "Unknown job #{job.body}"
                        end
                    rescue Exception => e
                        logger.error "#{e}"
                    end
                end
            end

            begin
                beanstalk.jobs.process!
            rescue Interrupt
                logger.info 'Received shutdown signal'
            end
            beanstalk.close
            logger.info 'Disconnected from beanstalk server'
        end
    end
end
