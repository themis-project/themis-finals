module Themis
    module Configuration
        def self.postgres_connection(&block)
            postgres_connection_dsl = PostgresConnectionDSL.new
            postgres_connection_dsl.instance_eval &block
            @_postgres_connection = postgres_connection_dsl.postgres_connection
        end

        def self.get_postgres_uri
            "postgres://#{@_postgres_connection.username}:#{@_postgres_connection.passwd}@#{@_postgres_connection.hostname}:#{@_postgres_connection.port}/#{@_postgres_connection.dbname}"
        end

        class PostgresConnection
            attr_accessor :hostname, :port, :username, :passwd, :dbname

            def initialize
                @hostname = nil
                @port = nil
                @username = nil
                @passwd = nil
                @dbname = nil
            end
        end

        class PostgresConnectionDSL
            attr_reader :postgres_connection

            def initialize
                @postgres_connection = PostgresConnection.new
            end

            def hostname(hostname)
                @postgres_connection.hostname = hostname
            end

            def port(port)
                @postgres_connection.port = port
            end

            def username(username)
                @postgres_connection.username = username
            end

            def passwd(passwd)
                @postgres_connection.passwd = passwd
            end

            def dbname(dbname)
                @postgres_connection.dbname = dbname
            end
        end

        protected
        @_postgres_connection = nil
    end
end
