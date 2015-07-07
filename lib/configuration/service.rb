module Themis
    module Configuration
        class Service
            attr_accessor :alias, :name

            def initialize(service_alias)
                @alias = service_alias
                @name = nil
            end
        end

        class ServiceDSL
            attr_reader :service

            def initialize(service_alias)
                @service = Service.new service_alias
            end

            def name(name)
                @service.name = name
            end
        end
    end
end
