module Themis
    module Controllers
        module Flag
            def self.get_living
                Themis::Models::Flag.all(
                    :expired_at.not => nil,
                    :expired_at.gt => DateTime.now)
            end

            def self.get_expired
                Themis::Models::Flag.all(
                    :expired_at.not => nil,
                    :expired_at.lt => DateTime.now,
                    :considered_at => nil)
            end
        end
    end
end
