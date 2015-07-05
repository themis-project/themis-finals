require 'redis'
require 'hiredis'
require './lib/utils/logger'


# TODO: Add support for em-synchrony
# TODO: Deal with Redis::ConnectionError exception

module Themis
    module Utils
        class Publisher
            def initialize
                @_client = nil
                @_logger = Themis::Utils::get_logger
            end

            def publish(channel, message, max_retries = 3)
                attempt = 0
                begin
                    if attempt == max_retries
                        @_logger.error "Failed to publish message to channel <#{channel}>"
                        return
                    end

                    ensure_connection
                    @_client.publish channel, message
                rescue Redis::CannotConnectError => e
                    wait_period = 2 ** attempt
                    attempt += 1
                    @_logger.warn "#{e}, retrying in #{wait_period}s (attempt #{attempt})"
                    sleep wait_period
                    retry
                end
            end

            protected
            def ensure_connection
                return unless @_client.nil?
                @_client = Redis.new Themis::Configuration::get_redis_options
            end
        end
    end
end