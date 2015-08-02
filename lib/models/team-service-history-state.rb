require 'data_mapper'


module Themis
    module Models
        class TeamServiceHistoryState
            include DataMapper::Resource

            property :id, Serial
            property :state, Enum[:up, :down, :corrupt, :mumble, :internal_error, :unknown], default: :unknown, required: true
            property :created_at, DateTime, required: true

            belongs_to :service
            belongs_to :team
        end
    end
end
