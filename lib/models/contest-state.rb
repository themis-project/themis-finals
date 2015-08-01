require 'data_mapper'


module Themis
    module Models
        class ContestState
            include DataMapper::Resource

            property :id, Serial
            property :state, Enum[:preparation, :contest, :break, :completion, :end], default: :preparation, required: true
            property :created_at, DateTime, required: true
        end
    end
end
