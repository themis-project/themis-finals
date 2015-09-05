require 'sequel'


module Themis
    module Models
        class Team < Sequel::Model
            one_to_many :team_service_states
            one_to_many :scores
            one_to_many :attack_attempts
            one_to_many :attacks
            one_to_one :total_score
        end
    end
end
