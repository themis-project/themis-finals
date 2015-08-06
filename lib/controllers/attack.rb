require 'themis/attack/result'


module Themis
    module Controllers
        module Attack
            def self.process(team, data)
                unless data.respond_to? 'match'
                    return Themis::Attack::Result::ERR_INVALID_FORMAT
                end

                match = data.match /^[\da-f]{32}=$/
                if match.nil?
                    return Themis::Attack::Result::ERR_INVALID_FORMAT
                end

                flag = Themis::Models::Flag.first(:flag => match[0],
                                                  :pushed_at.not => nil)

                if flag.nil?
                    return Themis::Attack::Result::ERR_INVALID_FORMAT
                end

                if flag.team == team
                    return Themis::Attack::Result::ERR_FLAG_YOURS
                end

                team_service_state = Themis::Models::TeamServiceState.first(
                    team: team,
                    service: flag.service)

                if team_service_state.nil? or team_service_state.state != :up
                    return Themis::Attack::Result::ERR_SERVICE_NOT_UP
                end

                if flag.expired_at < DateTime.now
                    return Themis::Attack::Result::ERR_FLAG_EXPIRED
                end

                attack = Themis::Models::Attack.first(team: team, flag: flag)
                unless attack.nil?
                    return Themis::Attack::Result::ERR_FLAG_SUBMITTED
                end

                attack = Themis::Models::Attack.create(
                    occured_at: DateTime.now,
                    team: team,
                    flag: flag)
                attack.save

                Themis::Attack::Result::SUCCESS_FLAG_ACCEPTED
            end
        end
    end
end
