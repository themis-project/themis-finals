require 'data_mapper'


module Themis
    module Models
        class Flag
            include DataMapper::Resource

            property :id, Serial
            property :flag, String
            property :created_at, DateTime
            property :pushed_at, DateTime
            property :expired_at, DateTime
            property :considered_at, DateTime
            property :seed, String, :length => 500

            belongs_to :service
            belongs_to :team
            belongs_to :round

            has n, :attacks
            has n, :flag_polls
        end
    end
end
