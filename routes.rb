require 'sinatra/base'
require './event-stream'


module Themis
    class Backend < Sinatra::Base
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
    end
end
