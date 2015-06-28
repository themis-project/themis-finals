require 'data_mapper'


module Themis
    module Models
        class Service
            include DataMapper::Resource

            property :id, Serial
            property :number, Integer

            belongs_to :team

            has n, :flags
            has n, :service_states
            has n, :realtime_service_states
        end
    end
end
