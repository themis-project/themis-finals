require 'data_mapper'


module Themis
    module Models
        class TotalScore
            include DataMapper::Resource

            property :id, Serial

            property :defence_points, Decimal, precision: 10, scale: 2, required: true, default: 0.0
            property :attack_points, Decimal, precision: 10, scale: 2, required: true, default: 0.0

            property :team_id, Integer, unique_index: true, index: true
            belongs_to :team
        end
    end
end
