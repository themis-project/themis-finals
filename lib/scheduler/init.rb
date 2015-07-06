require 'eventmachine'
require './lib/utils/logger'


module Themis
    module Scheduler
        def self.run
            logger = Themis::Utils::get_logger
            contest_flow = Themis::Configuration::get_contest_flow
            EM.run do
                EM.add_periodic_timer contest_flow.push_period do
                    logger.info 'Push'
                end

                EM.add_periodic_timer contest_flow.poll_period do
                    logger.info 'Poll'
                end

                EM.add_periodic_timer contest_flow.update_period do
                    logger.info 'Update'
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
