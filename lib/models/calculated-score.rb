require 'data_mapper'


module Themis
    module Models
        class CalculatedScore
            include DataMapper::Resource

            property :id, Serial

            property :defence_score, Decimal, precision: 10, scale: 2
            property :attack_score, Decimal, precision: 10, scale: 2

            belongs_to :team
        end
    end
end