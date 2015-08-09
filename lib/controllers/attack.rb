require 'themis/attack/result'


module Themis
    module Controllers
        module Attack
            def self.process(team, data)
                attempt = Themis::Models::AttackAttempt.create(
                    occured_at: DateTime.now,
                    request: data.to_s,
                    response: Themis::Attack::Result::ERR_GENERIC,
                    team: team)

                threshold = Time.now - Themis::Configuration::get_contest_flow.attack_limit_period

                attempt_count = Themis::Models::AttackAttempt.count(
                    :occured_at.gte => threshold.to_datetime,
                    :team => team)

                if attempt_count > Themis::Configuration::get_contest_flow.attack_limit_attempts
                    r = Themis::Attack::Result::ERR_ATTEMPTS_LIMIT
                    attempt.response = r
                    attempt.save
                    return r
                end

                unless data.respond_to? 'match'
                    r = Themis::Attack::Result::ERR_INVALID_FORMAT
                    attempt.response = r
                    attempt.save
                    return r
                end

                match = data.match /^[\da-f]{32}=$/
                if match.nil?
                    r = Themis::Attack::Result::ERR_INVALID_FORMAT
                    attempt.response = r
                    attempt.save
                    return r
                end

                flag = Themis::Models::Flag.first(:flag => match[0],
                                                  :pushed_at.not => nil)

                if flag.nil?
                    r = Themis::Attack::Result::ERR_FLAG_NOT_FOUND
                    attempt.response = r
                    attempt.save
                    return r
                end

                if flag.team == team
                    r = Themis::Attack::Result::ERR_FLAG_YOURS
                    attempt.response = r
                    attempt.save
                    return r
                end

                team_service_state = Themis::Models::TeamServiceState.first(
                    team: team,
                    service: flag.service)

                if team_service_state.nil? or team_service_state.state != :up
                    r = Themis::Attack::Result::ERR_SERVICE_NOT_UP
                    attempt.response = r
                    attempt.save
                    return r
                end

                if flag.expired_at < DateTime.now
                    r = Themis::Attack::Result::ERR_FLAG_EXPIRED
                    attempt.response = r
                    attempt.save
                    return r
                end

                r = nil
                begin
                    attack = Themis::Models::Attack.create(
                        occured_at: DateTime.now,
                        team: team,
                        flag: flag)
                    r = Themis::Attack::Result::SUCCESS_FLAG_ACCEPTED
                rescue ::DataObjects::IntegrityError => e
                    r = Themis::Attack::Result::ERR_FLAG_SUBMITTED
                end

                attempt.response = r
                attempt.save
                return r
            end
        end
    end
end
