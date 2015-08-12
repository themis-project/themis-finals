require 'data_mapper'


module Themis
    module Models
        class ScoreboardState
            include DataMapper::Resource

            property :id, Serial
            property :state, Enum[:enabled, :disabled], default: :enabled, required: true
            property :created_at, DateTime, required: true
            property :total_scores, Json
            property :attacks, Json
        end
    end
end
