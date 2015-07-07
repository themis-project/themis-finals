require 'data_mapper'


module Themis
    module Models
        class Team
            include DataMapper::Resource

            property :id, Serial
            property :name, String, :length => 100
            property :network, String, :length => 18 # e.g. 10.0.1.0/24
            property :host, String, :length => 15 # e.g. 10.0.1.2

            has n, :team_service_states
            has n, :scores
            has n, :attack_attempts
            has n, :attacks
            has 1, :total_score
        end
    end
end
