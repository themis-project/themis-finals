module Themis
    module Controllers
        module Round
            def self.start_new
                end_last

                new_round = Themis::Models::Round.create(
                    started_at: DateTime.now)
                new_round.save
                new_round
            end

            def self.end_last
                current_round = Themis::Models::Round.last
                unless current_round.nil?
                    current_round.finished_at = DateTime.now
                    current_round.save
                end
            end
        end
    end
end
