module Themis
    module Controllers
        module Contest
            def self.push_flags
                logger = Themis::Utils::Logger::get
                round_num = Themis::Models::Round.all.count + 1
                last_round = Themis::Models::Round.last
                unless last_round.nil?
                    last_round.finished_at = DateTime.now
                    last_round.save
                end

                logger.info "Round #{round_num}"
                round = Themis::Models::Round.create(
                    started_at: DateTime.now)
                round.save
            end

            def self.poll_flags
            end

            def self.update_score
            end
        end
    end
end
