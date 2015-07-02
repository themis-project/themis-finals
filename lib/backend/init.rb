require 'thin'
require 'eventmachine'
require './lib/backend/event-stream'
require './lib/backend/application'


module Themis
    module Backend
        def self.run
            event_stream = EventStream.new 'test'
            EM.run do
                Thin::Server.start Application, ENV['LISTEN'], ENV['PORT'].to_i

                Signal.trap('INT') { EM.stop }
                Signal.trap('TERM') { EM.stop }
            end
        end
    end
end
