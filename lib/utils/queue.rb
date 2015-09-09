require 'beaneater'


module Themis
    module Utils
        module Queue
            ::Beaneater.configure do |config|
                config.default_put_delay = 0
                config.default_put_ttr = Themis::Configuration::get_beanstalk_ttr
            end

            def self.enqueue(channel, data, opts = {})
                beanstalk = Beaneater.new Themis::Configuration::get_beanstalk_uri
                tube = beanstalk.tubes[channel]
                tube.put data, **opts
                beanstalk.close
            end
        end
    end
end
