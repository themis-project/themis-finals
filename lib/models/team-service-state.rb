require 'data_mapper'


module Themis
    module Models
        class TeamServiceState
            include DataMapper::Resource

            property :id, Serial
            property :state, Enum[:up, :down, :corrupt, :mumble, :checker_error, :unknown], default: :unknown, required: true
            property :updated_at, DateTime, required: true

            property :service_id, Integer, unique_index: :ndx_uniq_team_service_states, index: true
            property :team_id, Integer, unique_index: :ndx_uniq_team_service_states, index: true
            belongs_to :service
            belongs_to :team
        end
    end
end
