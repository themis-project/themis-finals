require './lib/utils/event-emitter'


module Themis
    module Controllers
        module Round
            def self.start_new
                end_last
                round = Themis::Models::Round.create started_at: DateTime.now
                Themis::Utils::EventEmitter::emit_all 'contest/round', { value: Themis::Models::Round.count }
                Themis::Utils::EventEmitter::emit_log 2, { value: Themis::Models::Round.count }
                return round
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
