module Themis
    module Configuration
        def self.redis_connection(&block)
            redis_connection_dsl = RedisConnectionDSL.new
            redis_connection_dsl.instance_eval &block
            @_redis_connection = redis_connection_dsl.redis_connection
        end

        def self.get_redis_options
            return {
                host: @_redis_connection.host,
                port: @_redis_connection.port
            }
        end

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

        protected
        @_redis_connection = nil
    end
end
