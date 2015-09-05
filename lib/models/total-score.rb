require 'sequel'


module Themis
    module Models
        class TotalScore < Sequel::Model
            many_to_one :team
        end
    end
end
