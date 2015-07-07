require 'data_mapper'


module Themis
    module Models
        class TeamServiceState
            include DataMapper::Resource

            property :id, Serial
            property :state, Enum[:up, :down, :corrupt, :mumble, :checker_error, :unknown], :default => :unknown
            property :updated_at, DateTime

            belongs_to :service
            belongs_to :team
        end
    end
end
