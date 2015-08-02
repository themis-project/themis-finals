require 'beaneater'
require 'json'
require './lib/utils/flag_generator'
require './lib/controllers/round'
require './lib/controllers/flag'
require './lib/controllers/score'


module Themis
    module Controllers
        module Contest
            def self.push_flags
                logger = Themis::Utils::Logger::get

                round = Themis::Controllers::Round::start_new
                round_num = Themis::Models::Round.all.count
                logger.info "Round #{round_num}"

                beanstalk = Beaneater.new Themis::Configuration::get_beanstalk_uri

                all_teams = Themis::Models::Team.all
                all_services = Themis::Models::Service.all

                all_teams.each do |team|
                    all_services.each do |service|
                        seed, flag_str = Themis::Utils::FlagGenerator::get_flag
                        flag = Themis::Models::Flag.create(
                            flag: flag_str,
                            created_at: DateTime.now,
                            pushed_at: nil,
                            expired_at: nil,
                            considered_at: nil,
                            seed: seed,
                            service: service,
                            team: team,
                            round: round)
                        flag.save

                        logger.debug "Pushing flag '#{flag_str}' to service #{service.name} of '#{team.name}'"
                        tube = beanstalk.tubes["themis.service.#{service.alias}.listen"]
                        tube.put({
                            operation: 'push',
                            endpoint: team.host,
                            flag_id: seed,
                            flag: flag_str
                        }.to_json)
                    end
                end

                beanstalk.close
            end

            def self.poll_flags
                logger = Themis::Utils::Logger::get
                beanstalk = Beaneater.new Themis::Configuration::get_beanstalk_uri

                living_flags = Themis::Controllers::Flag::get_living

                all_teams = Themis::Models::Team.all
                all_services = Themis::Models::Service.all

                all_teams.each do |team|
                    all_services.each do |service|
                        service_flags = living_flags.select do |flag|
                            flag.team == team and flag.service == service
                        end

                        poll_flags = service_flags.sample Themis::Configuration::get_contest_flow.poll_count

                        poll_flags.each do |flag|
                            poll = Themis::Models::FlagPoll.create(
                                state: :unknown,
                                created_at: DateTime.now,
                                updated_at: nil,
                                flag: flag)
                            poll.save

                            logger.debug "Polling flag '#{flag.flag}' from service #{service.name} of '#{team.name}'"
                            tube = beanstalk.tubes["themis.service.#{service.alias}.listen"]
                            tube.put({
                                operation: 'pull',
                                request_id: poll.id,
                                endpoint: team.host,
                                flag: flag.flag,
                                flag_id: flag.seed
                            }.to_json)
                        end
                    end
                end

                beanstalk.close
            end

            def self.prolong_flag_lifetimes
                prolong = Themis::Configuration::get_contest_flow.poll_period

                Themis::Controllers::Flag::get_living.each do |flag|
                    flag.expired_at = flag.expired_at.to_time + prolong
                    flag.save
                end
            end

            def self.update_scores
                Themis::Controllers::Flag::get_expired.each do |flag|
                    polls = Themis::Models::FlagPoll.all(flag: flag)

                    Themis::Controllers::Score::charge_availability flag, polls

                    attacks = flag.attacks
                    if attacks.count == 0
                        if polls.count(state: :error) == 0
                            Themis::Controllers::Score::charge_defence flag
                        end
                    else
                        attacks.each do |attack|
                            Themis::Controllers::Score::charge_attack flag, attack
                        end
                    end

                    flag.considered_at = DateTime.now
                    flag.save
                end
            end
        end
    end
end
