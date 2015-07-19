module Themis
    module Controllers
        module Score
            def self.get_score(round, team)
                score = Themis::Models::Score.first(
                    round: round,
                    team: team)

                if score.nil?
                    score = Themis::Models::Score.create(
                        defence_points: 0,
                        attack_points: 0,
                        team: team,
                        round: round)
                end

                score
            end

            def self.get_total_score(team)
                score = Themis::Models::TotalScore.first(team: team)
                if score.nil?
                    score = Themis::Models::TotalScore.create(
                        defence_points: 0,
                        attack_points: 0,
                        team: team)
                end

                score
            end

            def self.charge_defence(flag)
                team = flag.team

                score = get_score flag.round, team
                score.defence_points += 1
                score.save

                total_score = get_total_score team
                total_score.defence_points += 1
                total_score.save
            end

            def self.charge_availability(flag, polls)
                success_count = polls.count state: :success
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
            end

            def self.charge_attack(flag, attack)
                team = attack.team
                score = get_score flag.round, attack.team
                score.attack_points += 1
                score.save

                total_score = get_total_score attack.team
                total_score.attack_points += 1
                total_score.save
            end
        end
    end
end
