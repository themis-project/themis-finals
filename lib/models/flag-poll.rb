require 'sequel'


module Themis
    module Models
        class FlagPoll < Sequel::Model
            many_to_one :flag
        end
    end
end
