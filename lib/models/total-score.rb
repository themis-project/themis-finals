require 'data_mapper'


module Themis
    module Models
        class TotalScore
            include DataMapper::Resource

            property :id, Serial

            property :defence_points, Decimal, precision: 10, scale: 2
            property :attack_points, Decimal, precision: 10, scale: 2

            belongs_to :team
        end
    end
end