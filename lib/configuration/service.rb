module Themis
    module Configuration
        class Service
            attr_accessor :name, :num

            def initialize(name)
                @name = name
                @num = nil
            end
        end

        class ServiceDSL
            attr_reader :service

            def initialize(name)
                @service = Service.new name
            end

            def num(num)
                @service.num = num
            end
        end
    end
end
