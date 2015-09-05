require './lib/utils/flag_generator'
require './lib/utils/logger'


module Themis
    module Controllers
        module Flag
            @logger = Themis::Utils::Logger::get

            def self.issue(team, service, round)
                flag = nil
                begin
                    seed, str = Themis::Utils::FlagGenerator::get_flag
                    flag = Themis::Models::Flag.create(
                        :flag => str,
                        :created_at => DateTime.now,
                        :pushed_at => nil,
                        :expired_at => nil,
                        :considered_at => nil,
                        :seed => seed,
                        :service_id => service.id,
                        :team_id => team.id,
                        :round_id => round.id
                    )
                rescue ::Sequel::UniqueConstraintViolation => e
                    @logger.warn "Duplicate flag!"
                    retry
                end

                return flag
            end
        end
    end
end
