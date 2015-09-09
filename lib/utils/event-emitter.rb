require 'date'
require 'json'
require './lib/utils/publisher'
require './lib/utils/logger'


module Themis
    module Utils
        module EventEmitter
            @logger = Themis::Utils::Logger::get

            def self.emit(name, data, internal, teams, other)
                event = nil
                Themis::Models::DB.transaction do
                    event = Themis::Models::ServerSentEvent.create(
                        :name => name,
                        :data => data,
                        :internal => internal,
                        :teams => teams,
                        :other => other
                    )

                    Themis::Models::DB.after_commit do
                        begin
                            publisher = Themis::Utils::Publisher.new
                            event_data = {
                                id: event.id,
                                name: name,
                                data: data
                            }.to_json

                            if internal
                                publisher.publish 'themis:internal', event_data
                            end

                            if teams
                                publisher.publish 'themis:teams', event_data
                            end

                            if other
                                publisher.publish 'themis:other', event_data
                            end
                        rescue => e
                            @logger.error "Failed to publish the event. #{e}"
                        end
                    end
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
