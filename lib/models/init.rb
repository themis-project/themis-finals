module Themis
    module Models
        def self.init
            require 'rubygems'
            require 'data_mapper'

            DataMapper::Logger.new $stdout, :info
            DataMapper::Model.raise_on_save_failure = true
            DataMapper.setup :default, Themis::Configuration::get_database_uri

            require './lib/models/team'
            require './lib/models/service'
            require './lib/models/score'
            require './lib/models/round'
            require './lib/models/attack-attempt'
            require './lib/models/attack'
            require './lib/models/flag'
            require './lib/models/total-score'
            require './lib/models/team-service-state'
            require './lib/models/team-service-history-state'
            require './lib/models/flag-poll'
            require './lib/models/contest-state'
            require './lib/models/post'
            require './lib/models/scoreboard-state'
            require './lib/models/server-sent-event'

            DataMapper.finalize
        end
    end
end
