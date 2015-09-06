require './lib/controllers/attack'
require './lib/utils/event-emitter'


module Themis
    module Controllers
        module ScoreboardState
            def self.is_enabled
                scoreboard_state = Themis::Models::ScoreboardState.last
                return scoreboard_state.nil? ? true : scoreboard_state.enabled
            end

            def self.enable
                Themis::Models::DB.transaction do
                    Themis::Models::ScoreboardState.create(
                        :enabled => true,
                        :created_at => DateTime.now,
                        :total_scores => {},
                        :attacks => {}
                    )

                    Themis::Utils::EventEmitter::emit_all 'contest/scoreboard', { enabled: true }
                end
            end

            def self.disable
                Themis::Models::DB.transaction do
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
                            occured_at: attack.occured_at.iso8601,
                            team_id: attack.team_id
                        }
                    end

                    Themis::Models::ScoreboardState.create(
                        :enabled => false,
                        :created_at => DateTime.now,
                        :total_scores => total_scores,
                        :attacks => attacks
                    )

                    Themis::Utils::EventEmitter::emit_all 'contest/scoreboard', { enabled: false }
                end
            end
        end
    end
end
