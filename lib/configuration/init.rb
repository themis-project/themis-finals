require './lib/configuration/team'
require './lib/configuration/service'
require './lib/configuration/postgres_connection'
require './lib/configuration/redis_connection'
require './lib/configuration/beanstalk_connection'
require './lib/configuration/contest_flow'
require './lib/configuration/network'


module Themis
    module Configuration
        def self.get_stream_config
            config = {
                network: {
                    internal: [],
                    other: [],
                    teams: []
                },
                postgres_connection: {
                },
                redis_connection: {
                }
            }

            network_opts = get_network
            config[:network][:internal] = network_opts.internal
            config[:network][:other] = network_opts.other

            Themis::Configuration::get_teams.each do |team_opts|
                config[:network][:teams] << team_opts.network
            end

            config[:redis_connection] = get_redis_options
            config[:postgres_connection] = get_postgres_options

            config
        end
    end
end
