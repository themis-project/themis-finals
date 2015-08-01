require 'data_mapper'


module Themis
    module Models
        class Score
            include DataMapper::Resource

            property :id, Serial

            property :defence_points, Decimal, precision: 10, scale: 2, required: true, default: 0.0
            property :attack_points, Decimal, precision: 10, scale: 2, required: true, default: 0.0

            property :team_id, Integer, unique_index: :ndx_uniq_team_round_score, index: true
            property :round_id, Integer, unique_index: :ndx_uniq_team_round_score, index: true
            belongs_to :team
            belongs_to :round
        end
    end
end
