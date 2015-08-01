require 'data_mapper'


module Themis
    module Models
        class Round
            include DataMapper::Resource

            property :id, Serial
            property :started_at, DateTime, required: true
            property :finished_at, DateTime
        end
    end
end
