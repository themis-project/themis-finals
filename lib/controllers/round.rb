require './lib/utils/event-emitter'


module Themis
    module Controllers
        module Round
            @logger = Themis::Utils::Logger::get

            def self.start_new
                round = nil
                round_number = nil
                Themis::Models::DB.transaction do
                    end_last
                    round = Themis::Models::Round.create(:started_at => DateTime.now)
                    round_number = Themis::Models::Round.count
                    Themis::Utils::EventEmitter::emit_all 'contest/round', { value: round_number }
                    Themis::Utils::EventEmitter::emit_log 2, { value: round_number }

                    Themis::Models::DB.after_commit do
                        @logger.info "Round #{round_number} started!"
                    end
                end

                round
            end

            def self.end_last
                round_number = nil
                Themis::Models::DB.transaction do
                    current_round = Themis::Models::Round.last
                    unless current_round.nil?
                        current_round.finished_at = DateTime.now
                        current_round.save
                        round_number = Themis::Models::Round.count
                    end

                    Themis::Models::DB.after_commit do
                        unless round_number.nil?
                            @logger.info "Round #{round_number} finished!"
                        end
                    end
                end
            end
        end
    end
end
