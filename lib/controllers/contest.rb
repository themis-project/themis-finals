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
            end

            def self.update_score
            end
        end
    end
end
