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
            attr_accessor :internal, :other

            def initialize
                @internal = []
                @other = []
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

            def other(*ip_addresses)
                ip_addresses.each do |ip_addr_str|
                    ip_addr = IP.new ip_addr_str
                    @network.other << ip_addr
                end
            end
        end

        protected
        @_network = nil
    end
end
