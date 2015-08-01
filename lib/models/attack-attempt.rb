require 'data_mapper'


module Themis
    module Models
        class AttackAttempt
            include DataMapper::Resource

            property :id, Serial
            property :occured_at, DateTime, required: true

            property :request, String, length: 200, required: true
            property :response, Integer, required: true

            belongs_to :team
        end
    end
end
