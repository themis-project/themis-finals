module Themis
    module Configuration
        def self.beanstalk_connection(&block)
            beanstalk_connection_dsl = BeanstalkConnectionDSL.new
            beanstalk_connection_dsl.instance_eval &block
            @_beanstalk_connection = beanstalk_connection_dsl.beanstalk_connection
        end

        def self.get_beanstalk_uri
            "#{@_beanstalk_connection.host}:#{@_beanstalk_connection.port}"
        end

        def self.get_beanstalk_ttr
            @_beanstalk_connection.ttr
        end

        class BeanstalkConnection
            attr_accessor :host, :port, :ttr

            def initialize
                @host = nil
                @port = nil
                @ttr = 10
            end
        end

        class BeanstalkConnectionDSL
            attr_reader :beanstalk_connection

            def initialize
                @beanstalk_connection = BeanstalkConnection.new
            end

            def host(host)
                @beanstalk_connection.host = host
            end

            def port(port)
                @beanstalk_connection.port = port
            end

            def ttr(ttr)
                @beanstalk_connection.ttr = ttr
            end
        end

        protected
        @_beanstalk_connection = nil
    end
end
