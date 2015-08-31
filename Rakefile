namespace :db do
    desc 'Clear database'
    task :reset do
        require './config'
        require './lib/models/init'

        Themis::Models::init
        DataMapper.auto_migrate!
    end
end


def change_contest_state(command)
    require './config'
    require './lib/models/init'
    require './lib/controllers/contest-state'

    Themis::Models::init

    case command
    when :init
        Themis::Controllers::ContestState::init
    when :start_async
        Themis::Controllers::ContestState::start_async
    when :resume
        Themis::Controllers::ContestState::resume
    when :pause
        Themis::Controllers::ContestState::pause
    when :complete_async
        Themis::Controllers::ContestState::complete_async
    end
end

namespace :contest do
    desc 'Init contest'
    task :init do
        change_contest_state :init
    end

    desc 'Enqueue start contest'
    task :start_async do
        change_contest_state :start_async
    end

    desc 'Resume contest'
    task :resume do
        change_contest_state :resume
    end

    desc 'Pause contest'
    task :pause do
        change_contest_state :pause
    end

    desc 'Enqueue complete contest'
    task :complete_async do
        change_contest_state :complete_async
    end
end


def change_scoreboard_state(state)
    require './config'
    require './lib/models/init'
    require './lib/controllers/scoreboard-state'

    Themis::Models::init

    case state
    when :enabled
        Themis::Controllers::ScoreboardState::enable
    when :disabled
        Themis::Controllers::ScoreboardState::disable
    end
end

namespace :scoreboard do
    desc 'Enable scoreboard (for team and other networks)'
    task :enable do
        change_scoreboard_state :enabled
    end

    desc 'Disable scoreboard (for team and other networks)'
    task :disable do
        change_scoreboard_state :disabled
    end
end
