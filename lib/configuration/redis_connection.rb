module Themis
    module Configuration
        class RedisConnection
            attr_accessor :host, :port

            def initialize
                @host = nil
                @port = nil
            end
        end

        class RedisConnectionDSL
            attr_reader :redis_connection

            def initialize
                @redis_connection = RedisConnection.new
            end

            def host(host)
                @redis_connection.host = host
            end

            def port(port)
                @redis_connection.port = port
            end
        end
    end
end
