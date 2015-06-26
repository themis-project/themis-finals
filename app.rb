require 'thin'
require 'eventmachine'
require './event-stream'
require './routes'


module Themis
    def self.run
        event_stream = EventStream.new 'test'
        EM.run do
            EM.add_periodic_timer(2) do
                message = "tick #{rand(10)}"
                event_stream.publish message
                puts message
            end

            Thin::Server.start Backend, '0.0.0.0', 3000

            Signal.trap('INT') { EM.stop }
            Signal.trap('TERM') { EM.stop }
        end
    end
end


Themis::run