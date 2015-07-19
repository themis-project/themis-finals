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
        state = :contest
    when :resume
        state = :contest
    when :pause
        state = :break
    when :complete
        state = :completion
    when :finish
        state = :end
    end

    unless state.nil?
        contest_state = Themis::Models::ContestState.create(
            state: state,
            created_at: DateTime.now)
        contest_state.save
    end
end

namespace :contest do
    desc 'Init contest'
    task :init do
        require './config'
        require './lib/models/init'

        Themis::Models::init

        Themis::Configuration.get_teams.each do |team_opts|
            team = Themis::Models::Team.create(
                name: team_opts.name,
                network: team_opts.network,
                host: team_opts.host)
            team.save
        end

        Themis::Configuration.get_services.each do |service_opts|
            service = Themis::Models::Service.create(
                name: service_opts.name,
                alias: service_opts.alias)
            service.save
        end

        contest_state = Themis::Models::ContestState.create(
            state: :preparation,
            created_at: DateTime.now)
        contest_state.save

        scoreboard_state = Themis::Models::ScoreboardState.create(
            state: :enabled,
            created_at: DateTime.now,
            calculated_scores: nil,
            last_attacks: nil)
        scoreboard_state.save
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
    task :complete do
        change_contest_state :complete
    end

    desc 'Finish contest'
    task :finish do
        change_contest_state :finish
    end
end


# task :test_publisher do
#     require './config'
#     require './lib/utils/publisher'

#     p = Themis::Utils::Publisher.new
#     p.publish 'test', 'HELLO!'
#     p.publish 'test', 'WORLD!'
# end
