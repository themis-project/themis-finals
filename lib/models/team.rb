require 'data_mapper'


module Themis
    module Models
        class Team
            include DataMapper::Resource

            property :id, Serial
            property :name, String, :length => 100
            property :network, String, :length => 18 # e.g. 10.0.1.0/24
            property :host, String, :length => 15 # e.g. 10.0.1.2
            property :avatar, String, :length => 100

            has n, :services
            has n, :scores
            has n, :attack_attempts
            has n, :attacks
            has 1, :calculated_score
        end
    end
end
