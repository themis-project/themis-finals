require './lib/configuration/team'


module Themis
    module Configuration
        @teams = []

        def self.team(name, &block)
            team_dsl = TeamDSL.new name
            team_dsl.instance_eval &block
            @teams << team_dsl.team
        end

        def self.get_teams
            @teams
        end


        @database_uri = nil

        def self.database_uri(database_uri)
            @database_uri = database_uri
        end

        def self.get_database_uri
            @database_uri
        end
    end
end
