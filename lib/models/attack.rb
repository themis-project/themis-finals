require 'data_mapper'


module Themis
    module Models
        class Attack
            include DataMapper::Resource

            property :id, Serial
            property :occured_at, DateTime, required: true
            property :considered, Boolean, required: true, default: false

            property :team_id, Integer, unique_index: :ndx_uniq_team_flag_attack, index: true
            property :flag_id, Integer, unique_index: :ndx_uniq_team_flag_attack, index: true
            belongs_to :team
            belongs_to :flag
        end
    end
end
