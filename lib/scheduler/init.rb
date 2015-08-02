require 'eventmachine'
require './lib/utils/logger'
require './lib/queue/init'


module Themis
    module Scheduler
        def self.run
            logger = Themis::Utils::Logger::get
            contest_flow = Themis::Configuration::get_contest_flow
            EM.run do
                EM.add_periodic_timer contest_flow.push_period do
                    logger.info 'Push'
                    Themis::Queue::enqueue 'themis.main', 'push'
                end

                EM.add_periodic_timer contest_flow.poll_period do
                    logger.info 'Poll'
                    Themis::Queue::enqueue 'themis.main', 'poll'
                end

                EM.add_periodic_timer contest_flow.update_period do
                    logger.info 'Update'
                    Themis::Queue::enqueue 'themis.main', 'update'
                end

                Signal.trap 'INT' do
                    EM.stop
                end

                Signal.trap 'TERM' do
                    EM.stop
                end
            end
        end
    end
end
