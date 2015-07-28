require 'ip'
require './lib/configuration/team'


module Themis
    module Configuration
        def self.network(&block)
            network_dsl = NetworkDSL.new
            network_dsl.instance_eval &block
            @_network = network_dsl.network
        end

        def self.get_network
            @_network
        end

        class Network
            attr_accessor :internal, :guest

            def initialize
                @internal = []
                @guest = []
                @_teams = []
            end

            def teams
                if @_teams.size == 0
                    Themis::Configuration::get_teams.each do |team|
                        ip_addr = IP.new team.network
                        @_teams << ip_addr
                    end
                end

                @_teams
            end
        end

        class NetworkDSL
            attr_reader :network

            def initialize
                @network = Network.new
            end

            def internal(*ip_addresses)
                ip_addresses.each do |ip_addr_str|
                    ip_addr = IP.new ip_addr_str
                    @network.internal << ip_addr
                end
            end

            def guest(*ip_addresses)
                ip_addresses.each do |ip_addr_str|
                    ip_addr = IP.new ip_addr_str
                    @network.guest << ip_addr
                end
            end
        end

        protected
        @_network = nil
    end
end
