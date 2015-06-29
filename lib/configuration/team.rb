module Themis
    module Configuration
        class Team
            attr_accessor :name, :network, :host

            def initialize(name)
                @name = name
                @network = nil
                @host = nil
            end
        end

        class TeamDSL
            attr_reader :team

            def initialize(name)
                @team = Team.new name
            end

            def network(network)
                @team.network = network
            end

            def host(host)
                @team.host = host
            end
        end
    end
end
