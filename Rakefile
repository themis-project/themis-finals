namespace :db do
    desc 'Clear database'
    task :reset do
        require 'rubygems'
        require './config'
        require 'sequel'

        postgres_uri = Themis::Configuration::get_postgres_uri

        # Sequel.connect(postgres_uri) do |db|
        #     tables = [
        #         'themis_models_server_sent_events',
        #         'themis_models_contest_states',
        #         'themis_models_posts',
        #         'themis_models_scoreboard_states',
        #         'themis_models_attack_attempts',
        #         'themis_models_attacks',
        #         'themis_models_total_scores',
        #         'themis_models_scores',
        #         'themis_models_team_service_history_states',
        #         'themis_models_team_service_states',
        #         'themis_models_flag_polls',
        #         'themis_models_flags',
        #         'themis_models_rounds',
        #         'themis_models_services',
        #         'themis_models_teams'
        #     ]
        #     tables.each do |table|
        #         db.run "DROP TABLE IF EXISTS #{table}"
        #     end
        # end

        Sequel.extension :migration
        Sequel.extension :pg_json

        db = Sequel.connect(postgres_uri)
        Sequel::Migrator.run(db, 'migrations')


        # require './lib/models/init'

        # Themis::Models::init
        # DataMapper.auto_migrate!
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
