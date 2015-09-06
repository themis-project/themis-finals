require './lib/utils/event-emitter'
require './lib/constants/flag-poll-state'


module Themis
    module Controllers
        module Score
            def self.get_score(round, team)
                score = Themis::Models::Score.first(
                    :round_id => round.id,
                    :team_id => team.id
                )

                if score.nil?
                    score = Themis::Models::Score.create(
                        :defence_points => 0,
                        :attack_points => 0,
                        :team_id => team.id,
                        :round_id => round.id
                    )
                end

                score
            end

            def self.get_total_score(team)
                score = Themis::Models::TotalScore.first(:team_id => team.id)
                if score.nil?
                    score = Themis::Models::TotalScore.create(
                        :defence_points => 0,
                        :attack_points => 0,
                        :team_id => team.id
                    )
                end

                score
            end

            def self.stream_total_score(total_score, scoreboard_enabled)
                data = {
                    id: total_score.id,
                    team_id: total_score.team_id,
                    defence_points: total_score.defence_points.to_f,
                    attack_points: total_score.attack_points.to_f
                }

                Themis::Utils::EventEmitter.emit 'team/score', data, true, scoreboard_enabled, scoreboard_enabled
            end

            def self.charge_defence(flag, scoreboard_enabled)
                team = flag.team

                score = get_score flag.round, team
                score.defence_points += 1
                score.save

                total_score = get_total_score team
                total_score.defence_points += 1
                total_score.save
                stream_total_score total_score, scoreboard_enabled
            end

            def self.charge_availability(flag, polls, scoreboard_enabled)
                success_count = polls.count { |poll| poll.state == Themis::Constants::FlagPollState::SUCCESS }
                if success_count == 0
                    return
                end

                points = Float(success_count) / Float(polls.count)

                team = flag.team
                score = get_score flag.round, team
                score.defence_points += points.round 2
                score.save

                total_score = get_total_score team
                total_score.defence_points += points.round 2
                total_score.save
                stream_total_score total_score, scoreboard_enabled
            end

            def self.charge_attack(flag, attack, scoreboard_enabled)
                team = attack.team
                score = get_score flag.round, attack.team
                score.attack_points += 1
                score.save

                total_score = get_total_score attack.team
                total_score.attack_points += 1
                total_score.save
                stream_total_score total_score, scoreboard_enabled
            end
        end
    end
end
