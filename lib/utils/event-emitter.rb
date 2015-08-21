require 'date'
require 'json'
require './lib/utils/publisher'


module Themis
    module Utils
        module EventEmitter
            def self.format(name, data, retry_interval)
                "id: #{DateTime.now.to_time.to_i}\nevent: #{name}\nretry: #{retry_interval}\ndata: #{data.to_json}\n\n"
            end

            def self.emit(name, data, internal, teams, other)
                publisher = Themis::Utils::Publisher.new
                formatted_event = format name, data, 5000
                if internal
                    publisher.publish 'themis:internal', formatted_event
                end

                if teams
                    publisher.publish 'themis:teams', formatted_event
                end

                if other
                    publisher.publish 'themis:other', formatted_event
                end
            end

            def self.emit_all(name, data)
                emit name, data, true, true, true
            end
        end
    end
end
