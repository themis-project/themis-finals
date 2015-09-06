require 'json'
require './lib/controllers/round'
require './lib/controllers/flag'
require './lib/controllers/score'
require './lib/utils/queue'
require 'themis/checker/result'
require './lib/controllers/contest-state'
require './lib/utils/event-emitter'
require './lib/controllers/attack'
require './lib/controllers/scoreboard-state'
require './lib/constants/flag-poll-state'
require './lib/constants/team-service-state'
require './lib/controllers/ctftime'


module Themis
    module Controllers
        module Contest
            @logger = Themis::Utils::Logger::get

            def self.start
                Themis::Controllers::ContestState::start
            end

            def self.push_flag(team, service, round)
                flag = nil
                Themis::Models::DB.transaction(:retry_on => [::Sequel::UniqueConstraintViolation], :num_retries => nil) do
                    flag = Themis::Controllers::Flag::issue team, service, round

                    Themis::Models::DB.after_commit do
                        @logger.info "Pushing flag `#{flag.flag}` to service `#{service.name}` of `#{team.name}` ..."
                        job_data = {
                            operation: 'push',
                            endpoint: team.host,
                            flag_id: flag.seed,
                            flag: flag.flag
                        }.to_json
                        Themis::Utils::Queue::enqueue "themis.service.#{service.alias}.listen", job_data
                    end
                end
            end

            def self.push_flags
                round = Themis::Controllers::Round::start_new

                all_services = Themis::Models::Service.all

                Themis::Models::Team.all.each do |team|
                    all_services.each do |service|
                        begin
                            push_flag team, service, round
                        rescue => e
                            @logger.error "#{e}"
                        end
                    end
                end
            end

            def self.handle_push(flag, status, seed)
                Themis::Models::DB.transaction(:retry_on => [::Sequel::UniqueConstraintViolation], :num_retries => nil) do
                    if status == Themis::Checker::Result::UP
                        flag.pushed_at = DateTime.now
                        expires = Time.now + Themis::Configuration.get_contest_flow.flag_lifetime
                        flag.expired_at = expires.to_datetime
                        flag.seed = seed
                        flag.save
                        @logger.info "Successfully pushed flag `#{flag.flag}`!"

                        poll_flag flag
                    else
                        @logger.info "Failed to push flag `#{flag.flag}` (status code #{status})!"
                    end

                    update_team_service_state flag.team, flag.service, status
                end
            end

            def self.poll_flag(flag)
                team = flag.team
                service = flag.service
                poll = nil

                Themis::Models::DB.transaction do
                    poll = Themis::Models::FlagPoll.create(
                        :state => Themis::Constants::FlagPollState::NOT_AVAILABLE,
                        :created_at => DateTime.now,
                        :updated_at => nil,
                        :flag_id => flag.id
                    )

                    Themis::Models::DB.after_commit do
                        @logger.info "Polling flag `#{flag.flag}` from service `#{service.name}` of `#{team.name}` ..."
                        job_data = {
                            operation: 'pull',
                            request_id: poll.id,
                            endpoint: team.host,
                            flag: flag.flag,
                            flag_id: flag.seed
                        }.to_json
                        Themis::Utils::Queue::enqueue "themis.service.#{service.alias}.listen", job_data
                    end
                end
            end

            def self.poll_flags
                living_flags = Themis::Models::Flag.all_living.all

                all_services = Themis::Models::Service.all

                Themis::Models::Team.all.each do |team|
                    all_services.each do |service|
                        service_flags = living_flags.select do |flag|
                            flag.team_id == team.id and flag.service_id == service.id
                        end

                        flags = service_flags.sample Themis::Configuration::get_contest_flow.poll_count

                        flags.each do |flag|
                            begin
                                poll_flag flag
                            rescue => e
                                @logger.error "#{e}"
                            end
                        end
                    end
                end
            end

            def self.prolong_flag_lifetime(flag, prolong_period)
                Themis::Models::DB.transaction do
                    flag.expired_at = flag.expired_at.to_time + prolong_period
                    flag.save

                    Themis::Models::DB.after_commit do
                        @logger.info "Prolonged flag `#{flag.flag}` lifetime!"
                    end
                end
            end

            def self.prolong_flag_lifetimes
                prolong_period = Themis::Configuration::get_contest_flow.poll_period

                Themis::Models::Flag.all_living.each do |flag|
                    begin
                        prolong_flag_lifetime flag, prolong_period
                    rescue => e
                        @logger.error "#{e}"
                    end
                end
            end

            def self.handle_poll(poll, status)
                Themis::Models::DB.transaction(:retry_on => [::Sequel::UniqueConstraintViolation], :num_retries => nil) do
                    if status == Themis::Checker::Result::UP
                        poll.state = Themis::Constants::FlagPollState::SUCCESS
                    else
                        poll.state = Themis::Constants::FlagPollState::ERROR
                    end

                    poll.updated_at = DateTime.now
                    poll.save

                    flag = poll.flag
                    update_team_service_state flag.team, flag.service, status

                    if status == Themis::Checker::Result::UP
                        @logger.info "Successfully pulled flag `#{flag.flag}`!"
                    else
                        @logger.info "Failed to pull flag `#{flag.flag}` (status code #{status})!"
                    end
                end
            end

            def self.control_complete
                living_flags_count = Themis::Models::Flag.count_living
                expired_flags_count = Themis::Models::Flag.count_expired

                if living_flags_count == 0 and expired_flags_count == 0
                    Themis::Models::DB.transaction do
                        Themis::Controllers::ContestState::complete
                        Themis::Controllers::Round::end_last
                    end
                end
            end

            def self.update_total_score(team, scoreboard_enabled)
                Themis::Models::DB.transaction do
                    total_score = Themis::Models::TotalScore.first(:team_id => team.id)
                    if total_score.nil?
                        total_score = Themis::Models::TotalScore.create(
                            :defence_points => 0,
                            :attack_points => 0,
                            :team_id => team.id
                        )
                    end

                    defence_points = 0.0
                    attack_points = 0.0

                    Themis::Models::Score.where(:team_id => team.id).each do |score|
                        defence_points += score.defence_points
                        attack_points += score.attack_points
                    end

                    total_score.defence_points = defence_points
                    total_score.attack_points = attack_points
                    total_score.save

                    data = {
                        id: total_score.id,
                        team_id: total_score.team_id,
                        defence_points: total_score.defence_points.to_f,
                        attack_points: total_score.attack_points.to_f
                    }

                    Themis::Utils::EventEmitter.emit 'team/score', data, true, scoreboard_enabled, scoreboard_enabled

                    Themis::Models::DB.after_commit do
                        @logger.info "Total score of team `#{team.name}` has been recalculated: defence - #{defence_points.to_f} pts, attack - #{attack_points.to_f} pts!"
                    end
                end
            end

            def self.update_total_scores(scoreboard_enabled)
                Themis::Models::Team.all.each do |team|
                    begin
                        update_total_score team, scoreboard_enabled
                    rescue => e
                        @logger.error "#{e}"
                    end
                end
            end

            def self.update_score(flag, scoreboard_enabled)
                Themis::Models::DB.transaction(:retry_on => [::Sequel::UniqueConstraintViolation], :num_retries => nil) do
                    polls = Themis::Models::FlagPoll.where(:flag_id => flag.id).all

                    Themis::Controllers::Score::charge_availability flag, polls, scoreboard_enabled

                    attacks = flag.attacks
                    if attacks.count == 0
                        error_count = polls.count { |poll| poll.state == Themis::Constants::FlagPollState::ERROR }
                        if error_count == 0
                            Themis::Controllers::Score::charge_defence flag, scoreboard_enabled
                        end
                    else
                        attacks.each do |attack|
                            begin
                                Themis::Controllers::Score::charge_attack flag, attack, scoreboard_enabled
                                Themis::Controllers::Attack::consider_attack attack, scoreboard_enabled
                            rescue => e
                                @logger.error "#{e}"
                            end
                        end
                    end

                    flag.considered_at = DateTime.now
                    flag.save
                end
            end

            def self.update_scores(scoreboard_enabled)
                Themis::Models::Flag.all_expired.each do |flag|
                    begin
                        update_score flag, scoreboard_enabled
                    rescue => e
                        @logger.error "#{e}"
                    end
                end
            end

            def self.update_all_scores
                scoreboard_enabled = Themis::Controllers::ScoreboardState::is_enabled

                update_scores scoreboard_enabled
                update_total_scores scoreboard_enabled

                Themis::Controllers::CTFTime::post_scoreboard
            end

            def self.update_team_service_state(team, service, status)
                Themis::Models::DB.transaction do
                    case status
                    when Themis::Checker::Result::UP
                        service_state = Themis::Constants::TeamServiceState::UP
                    when Themis::Checker::Result::CORRUPT
                        service_state = Themis::Constants::TeamServiceState::CORRUPT
                    when Themis::Checker::Result::MUMBLE
                        service_state = Themis::Constants::TeamServiceState::MUMBLE
                    when Themis::Checker::Result::DOWN
                        service_state = Themis::Constants::TeamServiceState::DOWN
                    when Themis::Checker::Result::INTERNAL_ERROR
                        service_state = Themis::Constants::TeamServiceState::INTERNAL_ERROR
                    else
                        service_state = Themis::Constants::TeamServiceState::NOT_AVAILABLE
                    end

                    team_service_history_state = Themis::Models::TeamServiceHistoryState.create(
                        :state => service_state,
                        :created_at => DateTime.now,
                        :team_id => team.id,
                        :service_id => service.id
                    )

                    team_service_state = Themis::Models::TeamServiceState.first(
                        :service_id => service.id,
                        :team_id => team.id
                    )
                    if team_service_state.nil?
                        team_service_state = Themis::Models::TeamServiceState.create(
                            :state => service_state,
                            :created_at => DateTime.now,
                            :updated_at => DateTime.now,
                            :team_id => team.id,
                            :service_id => service.id
                        )
                    else
                        team_service_state.state = service_state
                        team_service_state.updated_at = DateTime.now
                        team_service_state.save
                    end

                    Themis::Utils::EventEmitter.emit_all 'team/service', {
                        id: team_service_state.id,
                        team_id: team_service_state.team_id,
                        service_id: team_service_state.service_id,
                        state: team_service_state.state,
                        updated_at: team_service_state.updated_at.iso8601
                    }

                    Themis::Utils::EventEmitter::emit_log 3, {
                        team_id: team_service_state.team_id,
                        service_id: team_service_state.service_id,
                        state: team_service_state.state
                    }
                end
            end
        end
    end
end
