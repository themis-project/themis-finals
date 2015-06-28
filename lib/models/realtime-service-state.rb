require 'data_mapper'


module Themis
    module Models
        class RealtimeServiceState
            include DataMapper::Resource

            property :id, Serial
            property :state, Enum[:up, :down, :corrupt, :mumble, :checker_error, :unknown], :default => :unknown
            property :updated_at, DateTime

            belongs_to :service
        end
    end
end
