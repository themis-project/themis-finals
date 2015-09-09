require 'ruby-enum'


module Themis
    module Constants
        class ContestState
            include Ruby::Enum

            define :INITIAL, 0
            define :AWAIT_START, 1
            define :RUNNING, 2
            define :PAUSED, 3
            define :AWAIT_COMPLETE, 4
            define :COMPLETED, 5
        end
    end
end
