require 'data_mapper'


module Themis
    module Models
        class AttackAttempt
            include DataMapper::Resource

            property :id, Serial
            property :occured_at, DateTime

            property :request, String, :length => 200
            property :response, Integer

            belongs_to :team
        end
    end
end
