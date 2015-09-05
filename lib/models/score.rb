require 'sequel'


module Themis
    module Models
        class Score < Sequel::Model
            many_to_one :team
            many_to_one :round
        end
    end
end
