require 'ruby-enum'


module Themis
    module Constants
        class FlagPollState
            include Ruby::Enum

            define :UNKNOWN, 0
            define :SUCCESS, 1
            define :ERROR, 2
        end
    end
end
