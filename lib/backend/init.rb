require 'thin'
require 'eventmachine'
require './lib/backend/application'
require './lib/utils/logger'


module Themis
    module Backend
        @logger = Themis::Utils::Logger::get

        def self.run
            EM.run do
                Thin::Server.start Application, ENV['LISTEN'], ENV['PORT'].to_i

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
