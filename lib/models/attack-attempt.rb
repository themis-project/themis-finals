require 'sequel'


module Themis
    module Models
        class AttackAttempt < Sequel::Model
            many_to_one :team
        end
    end
end
