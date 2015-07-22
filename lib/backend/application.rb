require 'sinatra/base'
require './lib/backend/event-stream'
require 'json'


module Themis
    module Backend
        class Application < Sinatra::Base
            disable :run

            get '/' do
                erb :index
            end

            get '/stream' do
                event_stream = EventStream.new 'test'

                content_type 'text/event-stream'
                stream :keep_open do |out|
                    event_stream.subscribe do |message|
                        if out.closed?
                            event_stream.unsubscribe
                            next
                        end

                        out << "event: test\ndata: #{message}\n\n"
                    end
                end
            end

            get '/teams' do
                r = Themis::Models::Team.map do |team|
                    {
                        id: team.id,
                        name: team.name,
                        network: team.network
                    }
                end

                r.to_json
            end

            get '/services' do
                r = Themis::Models::Service.map do |service|
                    {
                        id: service.id,
                        name: service.name
                    }
                end

                r.to_json
            end
        end
    end
end
