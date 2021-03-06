require './lib/utils/logger'
require 'beaneater'
require './lib/controllers/contest'
require 'json'


module Themis
    module Queue
        @logger = Themis::Utils::Logger::get

        def self.run
            beanstalk = Beaneater.new Themis::Configuration::get_beanstalk_uri
            @logger.info 'Connected to beanstalk server'

            tubes_namespace = 'themis'

            beanstalk.jobs.register "#{tubes_namespace}.main" do |job|
                begin
                    case job.body
                    when 'push'
                        contest_state = Themis::Models::ContestState.last
                        if not contest_state.nil? and (contest_state.is_await_start or contest_state.is_running)
                            if contest_state.is_await_start
                                Themis::Controllers::Contest::start
                            end
                            Themis::Controllers::Contest::push_flags
                        end
                    when 'poll'
                        contest_state = Themis::Models::ContestState.last
                        unless contest_state.nil?
                            if contest_state.is_running or contest_state.is_await_complete
                                Themis::Controllers::Contest::poll_flags
                            elsif contest_state.is_paused
                                Themis::Controllers::Contest::prolong_flag_lifetimes
                            end
                        end
                    when 'update'
                        contest_state = Themis::Models::ContestState.last
                        if not contest_state.nil? and (contest_state.is_running or contest_state.is_await_complete)
                            begin
                                Themis::Controllers::Contest::update_all_scores
                            rescue => e
                                @logger.error "#{e}"
                            end
                        end
                    when 'control_complete'
                        contest_state = Themis::Models::ContestState.last
                        if not contest_state.nil? and contest_state.is_await_complete
                            Themis::Controllers::Contest::control_complete
                        end
                    else
                        @logger.warn "Unknown job #{job.body}"
                    end
                rescue => e
                    @logger.error "#{e}"
                end
            end

            Themis::Models::Service.all.each do |service|
                beanstalk.jobs.register "#{tubes_namespace}.service.#{service.alias}.report" do |job|
                    begin
                        job_data = JSON.parse job.body
                        case job_data['operation']
                        when 'push'
                            flag = Themis::Models::Flag.first(:flag => job_data['flag'])
                            if flag.nil?
                                @logger.error "Failed to find flag #{job_data['flag']}!"
                            else
                                Themis::Controllers::Contest::handle_push flag, job_data['status'], job_data['flag_id']
                            end
                        when 'pull'
                            poll = Themis::Models::FlagPoll.first(:id => job_data['request_id'])
                            if poll.nil?
                                @logger.error "Failed to find poll #{job_data['request_id']}"
                            else
                                Themis::Controllers::Contest::handle_poll poll, job_data['status']
                            end
                        else
                            @logger.error "Unknown job #{job.body}"
                        end
                    rescue => e
                        @logger.error "#{e}"
                    end
                end
            end

            begin
                beanstalk.jobs.process!
            rescue Interrupt
                @logger.info 'Received shutdown signal'
            end
            beanstalk.close
            @logger.info 'Disconnected from beanstalk server'
        end
    end
end
