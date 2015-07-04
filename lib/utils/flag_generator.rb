require 'securerandom'
require 'digest/md5'


module Themis
    module Utils
        def self.generate_flag
            seed = SecureRandom.hex 10
            source = Digest::MD5.new
            source << SecureRandom.hex(32)
            source << Themis::Configuration::get_contest_flow.generator_secret
            flag = "#{source.hexdigest}="
            return seed, flag
        end
    end
end
