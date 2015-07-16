require 'beaneater'
require 'json'
require './lib/utils/flag_generator'


module Themis
    module Controllers
        module Contest
            def self.push_flags
                logger = Themis::Utils::Logger::get
                round_num = Themis::Models::Round.all.count + 1
                last_round = Themis::Models::Round.last
                unless last_round.nil?
                    last_round.finished_at = DateTime.now
                    last_round.save
                end

                logger.info "Round #{round_num}"
                round = Themis::Models::Round.create(
                    started_at: DateTime.now)
                round.save

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
                        tube = beanstalk.tubes["volgactf.service.#{service.alias}.listen"]
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

                living_flags = Themis::Models::Flag.all(
                    :expired_at.not => nil,
                    :expired_at.gt => DateTime.now)

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
                            tube = beanstalk.tubes["volgactf.service.#{service.alias}.listen"]
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
                living_flags = Themis::Models::Flag.all(
                    :expired_at.not => nil,
                    :expired_at.gt => DateTime.now)

                prolong = Themis::Configuration::get_contest_flow.poll_period

                living_flags.each do |flag|
                    flag.expired_at = flag.expired_at.to_time + prolong
                    flag.save
                end
            end

            def self.update_scores
            end
        end
    end
end
