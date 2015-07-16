require './lib/utils/logger'
require 'beaneater'
require './lib/controllers/contest'


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
                        Themis::Controllers::Contest::poll_flags
                    when 'update'
                        Themis::Controllers::Contest::update_score
                    else
                        logger.warn "Unknown job #{job.body}"
                    end
                rescue Exception => e
                    logger.error "#{e}"
                end
            end

            Themis::Models::Service.all.each do |service|
                beanstalk.jobs.register "#{tubes_namespace}.service.#{service.alias}.report" do |job|
                    logger.info "Performing job #{job.body}"
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
