require './lib/configuration/team'
require './lib/configuration/service'
require './lib/configuration/redis_connection'
require './lib/configuration/contest_flow'
require './lib/configuration/network'


module Themis
    module Configuration
        def self.database_uri(database_uri)
            @_database_uri = database_uri
        end

        def self.get_database_uri
            @_database_uri
        end


        def self.beanstalk_uri(beanstalkd_uri)
            @_beanstalkd_uri = beanstalkd_uri
        end

        def self.get_beanstalk_uri
            @_beanstalkd_uri
        end

        protected
        @_database_uri = nil
        @_beanstalkd_uri = nil
    end
end
