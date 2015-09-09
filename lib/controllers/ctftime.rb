require 'aws-sdk'
require './lib/controllers/scoreboard-state'
require './lib/utils/logger'
require 'json'


module Themis
    module Controllers
        module CTFTime
            @logger = Themis::Utils::Logger::get

            def self.sort_rows(a, b)
                a_total_score = a[:total_score]
                b_total_score = b[:total_score]

                if (a_total_score - b_total_score).abs < 0.001
                    a_last_attack = a[:last_attack]
                    b_last_attack = b[:last_attack]
                    if a_last_attack.nil? and b_last_attack.nil?
                        return 0
                    elsif a_last_attack.nil? and not b_last_attack.nil?
                        return -1
                    elsif not a_last_attack.nil? and b_last_attack.nil?
                        return 1
                    else
                        if a_last_attack < b_last_attack
                            return 1
                        elsif a_last_attack > b_last_attack
                            return -1
                        else
                            return 0
                        end
                    end
                end

                if a_total_score < b_total_score
                    return 1
                else a_total_score > b_total_score
                    return -1
                end
            end

            def self.get_json
                scores = []
                Themis::Models::Team.all.each do |team|
                    last_attack = Themis::Models::Attack.last(
                        :team_id => team.id,
                        :considered => true
                    )

                    last_score = Themis::Models::TotalScore.first(:team_id => team.id)

                    scores << {
                        name: team.name,
                        defence_score: last_score.nil? ? 0.0 : last_score.defence_points,
                        attack_score: last_score.nil? ? 0.0 : last_score.attack_points,
                        last_attack: last_attack.nil? ? nil : last_attack.occured_at
                    }
                end

                leader_defence = scores.max_by { |x| x[:defence_score] }
                max_defence = leader_defence[:defence_score]

                leader_attack = scores.max_by { |x| x[:attack_score] }
                max_attack = leader_attack[:attack_score]

                total_scores = []
                scores.each do |score|
                    attackRelative = (max_attack < 0.001) ? 0 : score[:attack_score] / max_attack
                    defenceRelative = (max_defence < 0.001) ? 0 : score[:defence_score] / max_defence
                    total_scores << {
                        name: score[:name],
                        total_score: 0.5 * (attackRelative + defenceRelative),
                        last_attack: score[:last_attack]
                    }
                end

                total_scores.sort! { |a, b| sort_rows a, b }

                standings = []
                total_scores.each_with_index do |total_score, ndx|
                    standings << {
                        pos: ndx + 1,
                        team: total_score[:name],
                        score: total_score[:total_score].to_f
                    }
                end

                data = { standings: standings }
                JSON.pretty_generate data
            end

            def self.post_scoreboard
                begin
                    @logger.info "Uploading CTFTime.org scoreboard ..."

                    s3 = Aws::S3::Resource.new ENV['AWS_REGION']
                    obj = s3.bucket(ENV['AWS_BUCKET']).object('ctftime.json')

                    obj.put(
                        acl: 'public-read',
                        body: get_json
                    )

                    @logger.info "Successfully uploaded CTFTime.org scoreboard!"
                rescue => e
                    @logger.error "#{e}"
                    e.backtrace.each { |line| @logger.error line }
                end
            end
        end
    end
end
