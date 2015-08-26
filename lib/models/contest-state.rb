require 'data_mapper'


module Themis
    module Models
        class ContestState
            include DataMapper::Resource

            property :id, Serial
            property :state, Enum[:initial, :await_start, :running, :paused, :await_complete, :completed], default: :initial, required: true
            property :created_at, DateTime, required: true
        end
    end
end
