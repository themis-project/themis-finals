module Themis
    module Controllers
        module Round
            def self.start_new
                current_round = Themis::Models::Round.last
                unless current_round.nil?
                    current_round.finished_at = DateTime.now
                    current_round.save
                end

                new_round = Themis::Models::Round.create(
                    started_at: DateTime.now)
                new_round.save
                new_round
            end
        end
    end
end
