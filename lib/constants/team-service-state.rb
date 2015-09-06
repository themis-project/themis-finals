require 'ruby-enum'


module Themis
    module Constants
        class TeamServiceState
            include Ruby::Enum

            define :NOT_AVAILABLE, 0
            define :UP, 1
            define :DOWN, 2
            define :CORRUPT, 3
            define :MUMBLE, 4
            define :INTERNAL_ERROR, 5
        end
    end
end
