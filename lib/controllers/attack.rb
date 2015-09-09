require 'themis/attack/result'
require './lib/utils/event-emitter'
require './lib/constants/team-service-state'


module Themis
    module Controllers
        module Attack
            def self.get_recent
                attacks = []
                Themis::Models::Team.all.each do |team|
                    attack = Themis::Models::Attack.last(
                        :team_id => team.id,
                        :considered => true
                    )

                    if attack != nil
                        attacks << attack
                    end
                end

                attacks
            end

            def self.consider_attack(attack, scoreboard_enabled)
                attack.considered = true
                attack.save
                data = {
                    id: attack.id,
                    occured_at: attack.occured_at.iso8601,
                    team_id: attack.team_id
                }

                Themis::Utils::EventEmitter.emit 'team/attack', data, true, scoreboard_enabled, scoreboard_enabled
            end

            def self.process(team, data)
                attempt = Themis::Models::AttackAttempt.create(
                    :occured_at => DateTime.now,
                    :request => data.to_s,
                    :response => Themis::Attack::Result::ERR_GENERIC,
                    :team_id => team.id
                )

                threshold = Time.now - Themis::Configuration::get_contest_flow.attack_limit_period

                attempt_count = Themis::Models::AttackAttempt.where(:team => team).where('occured_at >= ?', threshold.to_datetime).count

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

                flag = Themis::Models::Flag.exclude(:pushed_at => nil).where(:flag => match[0]).first

                if flag.nil?
                    r = Themis::Attack::Result::ERR_FLAG_NOT_FOUND
                    attempt.response = r
                    attempt.save
                    return r
                end

                if flag.team_id == team.id
                    r = Themis::Attack::Result::ERR_FLAG_YOURS
                    attempt.response = r
                    attempt.save
                    return r
                end

                team_service_state = Themis::Models::TeamServiceState.first(
                    :team_id => team.id,
                    :service_id => flag.service_id
                )

                if team_service_state.nil? or team_service_state.state != Themis::Constants::TeamServiceState::UP
                    r = Themis::Attack::Result::ERR_SERVICE_NOT_UP
                    attempt.response = r
                    attempt.save
                    return r
                end

                if flag.expired_at.to_datetime < DateTime.now
                    r = Themis::Attack::Result::ERR_FLAG_EXPIRED
                    attempt.response = r
                    attempt.save
                    return r
                end

                r = nil
                begin
                    Themis::Models::DB.transaction do
                        attack = Themis::Models::Attack.create(
                            :occured_at => DateTime.now,
                            :considered => false,
                            :team_id => team.id,
                            :flag_id => flag.id
                        )
                        r = Themis::Attack::Result::SUCCESS_FLAG_ACCEPTED

                        Themis::Utils::EventEmitter::emit_log 4, {
                            attack_team_id: team.id,
                            victim_team_id: flag.team_id,
                            service_id: flag.service_id
                        }
                    end
                rescue ::Sequel::UniqueConstraintViolation => e
                    r = Themis::Attack::Result::ERR_FLAG_SUBMITTED
                end

                attempt.response = r
                attempt.save
                return r
            end
        end
    end
end
