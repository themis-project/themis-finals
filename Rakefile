namespace :db do
    desc 'Clear database'
    task :reset do
        require 'rubygems'
        require './config'
        require 'sequel'

        postgres_uri = Themis::Configuration::get_postgres_uri

        Sequel.connect(postgres_uri) do |db|
            tables = [
                'server_sent_events',
                'contest_states',
                'posts',
                'scoreboard_states',
                'attack_attempts',
                'attacks',
                'total_scores',
                'scores',
                'team_service_history_states',
                'team_service_states',
                'flag_polls',
                'flags',
                'rounds',
                'services',
                'teams',
                'schema_info'
            ]
            tables.each do |table|
                db.run "DROP TABLE IF EXISTS #{table}"
            end
        end

        Sequel.extension :migration
        Sequel.extension :pg_json

        Sequel.connect(postgres_uri) do |db|
            Sequel::Migrator.run(db, 'migrations')
        end
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

    desc 'Post scoreboard on ctftime.org (requires additional settings for AWS S3)'
    task :post do
        require './config'
        require './lib/models/init'
        require './lib/controllers/ctftime'

        Themis::Controllers::CTFTime::post_scoreboard
    end
end


namespace :export do
    task :teams do
        require './config'
        require './lib/models/init'
        require 'json'

        r = Themis::Models::Team.map do |team|
            {
                id: team.id,
                name: team.name,
                guest: team.guest
            }
        end

        IO.write 'teams.json', JSON.pretty_generate(r)
    end

    task :services do
        require './config'
        require './lib/models/init'
        require 'json'

        r = Themis::Models::Service.map do |service|
            {
                id: service.id,
                name: service.name
            }
        end

        IO.write 'services.json', JSON.pretty_generate(r)
    end

    task :team_service_states do
        require './config'
        require './lib/models/init'
        require 'json'

        r = Themis::Models::TeamServiceHistoryState.map do |team_service_state|
            {
                id: team_service_state.id,
                state: team_service_state.state,
                team_id: team_service_state.team_id,
                service_id: team_service_state.service_id,
                created_at: team_service_state.created_at.iso8601
            }
        end

        IO.write 'team_service_states.json', JSON.pretty_generate(r)
    end

    task :attacks do
        require './config'
        require './lib/models/init'
        require 'json'

        r = Themis::Models::Attack.map do |attack|
            flag = Themis::Models::Flag[attack.flag_id]

            {
                id: attack.id,
                occured_at: attack.occured_at.iso8601,
                attacker_team_id: attack.team_id,
                service_id: flag.service_id,
                victim_team_id: flag.team_id
            }
        end

        IO.write 'attacks.json', JSON.pretty_generate(r)
    end
end
