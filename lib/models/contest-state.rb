require 'sequel'
require './lib/constants/contest-state'


module Themis
    module Models
        class ContestState < Sequel::Model
            def is_initial
                state == Themis::Constants::ContestState::INITIAL
            end

            def is_await_start
                state == Themis::Constants::ContestState::AWAIT_START
            end

            def is_running
                state == Themis::Constants::ContestState::RUNNING
            end

            def is_paused
                state == Themis::Constants::ContestState::PAUSED
            end

            def is_await_complete
                state == Themis::Constants::ContestState::AWAIT_COMPLETE
            end

            def is_completed
                state == Themis::Constants::ContestState::COMPLETED
            end
        end
    end
end
