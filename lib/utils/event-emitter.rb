require 'date'
require 'json'
require './lib/utils/publisher'


module Themis
    module Utils
        module EventEmitter
            def self.format(id, name, data, retry_interval)
                "id: #{id}\nevent: #{name}\nretry: #{retry_interval}\ndata: #{data.to_json}\n\n"
            end

            def self.emit(name, data, internal, teams, other)
                event = Themis::Models::ServerSentEvent.create(
                    name: name,
                    data: data,
                    internal: internal,
                    teams: teams,
                    other: other
                )

                publisher = Themis::Utils::Publisher.new
                formatted_event = format event.id, name, data, 5000

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

            def self.emit_log(type, params)
                emit 'log', { type: type, params: params }, true, false, false
            end
        end
    end
end
