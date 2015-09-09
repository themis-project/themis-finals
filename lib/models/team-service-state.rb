require 'sequel'


module Themis
    module Models
        class TeamServiceState < Sequel::Model
            many_to_one :service
            many_to_one :team
        end
    end
end
