require 'data_mapper'


module Themis
    module Models
        class ScoreboardState
            include DataMapper::Resource

            property :id, Serial
            property :state, Enum[:enabled, :disabled], default: :enabled, required: true
            property :created_at, DateTime, required: true
            property :total_scores, Json, lazy: false
            property :attacks, Json, lazy: false
        end
    end
end
