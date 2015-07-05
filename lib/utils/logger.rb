require 'logger'


module Themis
    module Utils
        def self.get_logger()
            logger = Logger.new STDOUT

            # Setup log formatter
            logger.datetime_format = '%Y-%m-%d %H:%M:%S'
            logger.formatter = proc do |severity, datetime, progname, msg|
                "[#{datetime}] #{severity} -- #{msg}\n"
            end

            # Setup log level
            case ENV['LOGLEVEL']
            when 'DEBUG'
                logger.level = Logger::DEBUG
            when 'INFO'
                logger.level = Logger::INFO
            when 'WARN'
                logger.level = Logger::WARN
            when 'ERROR'
                logger.level = Logger::ERROR
            when 'FATAL'
                logger.level = Logger::FATAL
            when 'UNKNOWN'
                logger.level = Logger::UNKNOWN
            else
                logger.level = Logger::INFO
            end
            logger
        end
    end
end
