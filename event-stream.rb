require 'redis'
require 'em-synchrony'


module Themis
    class EventStream
        def initialize(channel)
            @client = Redis.new
            @channel = channel
        end

        def publish(message)
            EM.synchrony do
                @client.publish @channel, message
            end
        end

        def subscribe(&b)
            return unless block_given?
            EM.synchrony do
                @client.subscribe(@channel) do |on|
                    on.message do |channel, message|
                        yield message
                    end
                end
            end
        end

        def unsubscribe
            EM.synchrony do
                @client.unsubscribe @channel
            end
        end
    end
end