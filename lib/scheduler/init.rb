require 'eventmachine'
require './lib/utils/queue'
require './lib/utils/logger'


module Themis
    module Scheduler
        @logger = Themis::Utils::Logger::get

        def self.run
            contest_flow = Themis::Configuration::get_contest_flow
            EM.run do
                @logger.info "Scheduler started, CTRL+C to stop"

                EM.add_periodic_timer contest_flow.push_period do
                    Themis::Utils::Queue::enqueue 'themis.main', 'push'
                end

                EM.add_periodic_timer contest_flow.poll_period do
                    Themis::Utils::Queue::enqueue 'themis.main', 'poll'
                end

                EM.add_periodic_timer contest_flow.update_period do
                    Themis::Utils::Queue::enqueue 'themis.main', 'update'
                end

                EM.add_periodic_timer contest_flow.update_period do
                    Themis::Utils::Queue::enqueue 'themis.main', 'control_complete'
                end

                Signal.trap 'INT' do
                    EM.stop
                end

                Signal.trap 'TERM' do
                    EM.stop
                end
            end

            @logger.info 'Received shutdown signal'
        end
    end
end
