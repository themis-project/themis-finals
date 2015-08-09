require 'beaneater'


module Themis
    module Utils
        module Queue
            def self.enqueue(channel, data, opts = {})
                beanstalk = Beaneater.new Themis::Configuration::get_beanstalk_uri
                tube = beanstalk.tubes[channel]
                tube.put data, **opts
                beanstalk.close
            end
        end
    end
end
