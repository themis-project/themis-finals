require './lib/utils/flag_generator'
require './lib/utils/logger'


module Themis
    module Controllers
        module Flag
            @logger = Themis::Utils::Logger::get

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

            def self.issue(team, service, round)
                flag = nil
                begin
                    seed, str = Themis::Utils::FlagGenerator::get_flag
                    flag = Themis::Models::Flag.create(
                        flag: str,
                        created_at: DateTime.now,
                        pushed_at: nil,
                        expired_at: nil,
                        considered_at: nil,
                        seed: seed,
                        service: service,
                        team: team,
                        round: round)
                rescue ::DataObjects::IntegrityError => e
                    @logger.warn "Duplicate flag!"
                    retry
                end

                return flag
            end
        end
    end
end
