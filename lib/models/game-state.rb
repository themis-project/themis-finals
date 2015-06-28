require 'data_mapper'


module Themis
    module Models
        class GameState
            include DataMapper::Resource

            property :id, Serial
            property :state, Enum[:preparation, :contest, :break, :completion, :end], :default => :preparation
            property :created_at, DateTime
        end
    end
end
