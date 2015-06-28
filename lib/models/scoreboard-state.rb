require 'data_mapper'


module Themis
    module Models
        class ScoreboardState
            include DataMapper::Resource

            property :id, Serial
            property :state, Enum[:enabled, :disabled], :default => :enabled
            property :created_at, DateTime
            property :calculated_scores, Text
            property :last_attacks, Text
        end
    end
end
