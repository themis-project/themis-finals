require 'sequel'


module Themis
    module Models
        class Service < Sequel::Model
            one_to_many :flags
            one_to_many :team_service_states
            one_to_many :team_service_history_states
        end
    end
end
