require 'data_mapper'


module Themis
    module Models
        class ServerSentEvent
            include DataMapper::Resource

            property :id, Serial
            property :name, String, required: true, length: 50
            property :data, Json, lazy: false
            property :internal, Boolean, required: true, default: false
            property :teams, Boolean, required: true, default: false
            property :other, Boolean, required: true, default: false
        end
    end
end
