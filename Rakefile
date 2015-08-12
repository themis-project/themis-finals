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

    Themis::Models::init

    state = nil
    case command
    when :start
        state = :running
    when :resume
        state = :running
    when :pause
        state = :paused
    when :complete_async
        state = :await_complete
    end

    unless state.nil?
        Themis::Models::ContestState.create(
            state: state,
            created_at: DateTime.now)
    end
end

namespace :contest do
    desc 'Init contest'
    task :init do
        require './config'
        require './lib/models/init'

        Themis::Models::init

        Themis::Configuration.get_teams.each do |team_opts|
            Themis::Models::Team.create(
                name: team_opts.name,
                network: team_opts.network,
                host: team_opts.host)
        end

        Themis::Configuration.get_services.each do |service_opts|
            Themis::Models::Service.create(
                name: service_opts.name,
                alias: service_opts.alias)
        end

        Themis::Models::ContestState.create(
            state: :initial,
            created_at: DateTime.now)

        Themis::Models::ScoreboardState.create(
            state: :enabled,
            created_at: DateTime.now,
            total_scores: {},
            attacks: {})
    end

    desc 'Start contest'
    task :start do
        change_contest_state :start
    end

    desc 'Resume contest'
    task :resume do
        change_contest_state :resume
    end

    desc 'Pause contest'
    task :pause do
        change_contest_state :pause
    end

    desc 'Start completion of contest'
    task :complete_async do
        change_contest_state :complete_async
    end
end


task :print_config do
    require './config'
    require 'yaml'

    puts Themis::Configuration::get_database_uri.to_yaml
    puts Themis::Configuration::get_beanstalk_uri.to_yaml
    puts Themis::Configuration::get_redis_options.to_yaml
    puts Themis::Configuration::get_contest_flow.to_yaml
    puts Themis::Configuration::get_services.to_yaml
    puts Themis::Configuration::get_teams.to_yaml

    Themis::Configuration::get_network.teams
    puts Themis::Configuration::get_network.to_yaml
end

# task :test_publisher do
#     require './config'
#     require './lib/utils/publisher'

#     p = Themis::Utils::Publisher.new
#     p.publish 'test', 'HELLO!'
#     p.publish 'test', 'WORLD!'
# end
