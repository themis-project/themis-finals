require 'data_mapper'


module Themis
    module Models
        class Flag
            include DataMapper::Resource

            property :id, Serial
            property :flag, String, length: 40, required: true, index: true, unique: true
            property :created_at, DateTime, required: true
            property :pushed_at, DateTime
            property :expired_at, DateTime
            property :considered_at, DateTime
            property :seed, String, length: 500, required: true

            property :service_id, Integer, unique_index: :ndx_uniq_service_team_round_flag, index: true
            property :team_id, Integer, unique_index: :ndx_uniq_service_team_round_flag, index: true
            property :round_id, Integer, unique_index: :ndx_uniq_service_team_round_flag, index: true
            belongs_to :service
            belongs_to :team
            belongs_to :round

            has n, :attacks
            has n, :flag_polls
        end
    end
end
