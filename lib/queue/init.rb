require './lib/utils/logger'
require 'beaneater'


module Themis
    module Queue
        def self.enqueue(channel, data, opts = {})
            beanstalk = Beaneater.new Themis::Configuration::get_beanstalk_uri
            tube = beanstalk.tubes[channel]
            tube.put data, **opts
            beanstalk.close
        end

        def self.run
            logger = Themis::Utils::get_logger
            beanstalk = Beaneater.new Themis::Configuration::get_beanstalk_uri
            logger.info 'Connected to beanstalk server'

            tubes_namespace = 'volgactf'

            beanstalk.jobs.register "#{tubes_namespace}.main" do |job|
                logger.info "Performing job #{job}"
            end

            Themis::Models::Service.all.each do |service|
                beanstalk.jobs.register "#{tubes_namespace}.service.#{service.alias}.push" do |job|
                    logger.info "Performing job #{job}"
                end

                beanstalk.jobs.register "#{tubes_namespace}.service.#{service.alias}.pull" do |job|
                    logger.info "Performing job #{job}"
                end
            end

            begin
                beanstalk.jobs.process!
            rescue Interrupt
                logger.info 'Received shutdown signal'
            end
            beanstalk.close
            logger.info 'Disconnected from beanstalk server'
        end
    end
end
