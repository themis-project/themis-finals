require 'data_mapper'


module Themis
    module Models
        class Service
            include DataMapper::Resource

            property :id, Serial
            property :name, String, length: 50, required: true, unique_index: true
            property :alias, String, length: 50, required: true, unique_index: true

            has n, :flags
            has n, :team_service_states
        end
    end
end
