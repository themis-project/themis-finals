require 'ip'


module Themis
    module Controllers
        module IdentityController
            def self.is_team(remote_ip)
                Themis::Models::Team.all.detect do |team|
                    network = IP.new team.network
                    remote_ip.is_in? network
                end
            end

            def self.is_internal(remote_ip)
                r = Themis::Configuration.get_network.internal.detect do |network|
                    remote_ip.is_in? network
                end
                not r.nil?
            end

            def self.is_guest(remote_ip)
                r = Themis::Configuration::get_network.guest.detect do |network|
                    remote_ip.is_in? network
                end
                not r.nil?
            end
        end
    end
end
