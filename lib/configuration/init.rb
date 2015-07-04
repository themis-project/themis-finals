require './lib/configuration/team'
require './lib/configuration/service'
require './lib/configuration/redis_connection'
require './lib/configuration/contest_flow'


module Themis
    module Configuration
        def self.team(name, &block)
            team_dsl = TeamDSL.new name
            team_dsl.instance_eval &block
            @_teams << team_dsl.team
        end

        def self.get_teams
            @_teams
        end


        def self.service(name, &block)
            service_dsl = ServiceDSL.new name
            service_dsl.instance_eval &block
            @_services << service_dsl.service
        end

        def self.get_services
            @_services
        end


        def self.database_uri(database_uri)
            @_database_uri = database_uri
        end

        def self.get_database_uri
            @_database_uri
        end


        def self.beanstalkd_uri(beanstalkd_uri)
            @_beanstalkd_uri = beanstalkd_uri
        end

        def self.get_beanstalkd_uri
            @_beanstalkd_uri
        end


        def self.redis_connection(&block)
            redis_connection_dsl = RedisConnectionDSL.new
            redis_connection_dsl.instance_eval &block
            @_redis_connection = redis_connection_dsl.redis_connection
        end

        def self.get_redis_connection
            @_redis_connection
        end


        def self.contest_flow(&block)
            contest_flow_dsl = ContestFlowDSL.new
            contest_flow_dsl.instance_eval &block
            @_contest_flow = contest_flow_dsl.contest_flow
        end

        def get_contest_flow
            @_contest_flow
        end


        protected
        @_teams = []
        @_services = []
        @_database_uri = nil
        @_beanstalkd_uri = nil
        @_redis_connection = nil
        @_contest_flow = nil
    end
end
