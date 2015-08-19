require 'data_mapper'


module Themis
    module Models
        class Team
            include DataMapper::Resource

            property :id, Serial
            property :name, String, length: 100, required: true, unique_index: true
            property :network, String, length: 18, required: true, unique_index: true
            property :host, String, length: 15, required: true, unique_index: true
            property :guest, Boolean, required: true, default: false

            has n, :team_service_states
            has n, :scores
            has n, :attack_attempts
            has n, :attacks
            has 1, :total_score
        end
    end
end
