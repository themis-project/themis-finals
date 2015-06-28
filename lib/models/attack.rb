require 'data_mapper'


module Themis
    module Models
        class Attack
            include DataMapper::Resource

            property :id, Serial
            property :occured_at, DateTime

            belongs_to :team
            belongs_to :flag
        end
    end
end
