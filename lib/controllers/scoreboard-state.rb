require './lib/controllers/attack'


module Themis
    module Controllers
        module ScoreboardState
            def self.enable
                Themis::Models::ScoreboardState.create(
                    state: :enabled,
                    created_at: DateTime.now,
                    total_scores: {},
                    attacks: {})
            end

            def self.disable
                total_scores = Themis::Models::TotalScore.map do |total_score|
                    {
                        id: total_score.id,
                        team_id: total_score.team_id,
                        defence_points: total_score.defence_points.to_f,
                        attack_points: total_score.attack_points.to_f
                    }
                end

                attacks = Themis::Controllers::Attack::get_recent.map do |attack|
                    {
                        id: attack.id,
                        occured_at: attack.occured_at,
                        team_id: attack.team_id
                    }
                end

                Themis::Models::ScoreboardState.create(
                    state: :disabled,
                    created_at: DateTime.now,
                    total_scores: total_scores,
                    attacks: attacks)
            end
        end
    end
end
