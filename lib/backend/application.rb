require 'sinatra/base'
require 'sinatra/json'
require './lib/backend/event-stream'
require 'json'
require 'ip'
require './lib/controllers/identity'
require 'themis/attack/result'
require './lib/controllers/attack'


module Rack
    class Request
        def trusted_proxy?(ip)
            ip =~ /^127\.0\.0\.1$/
        end
    end
end


module Themis
    module Backend
        class Application < Sinatra::Base
            disable :run

            get '/stream' do
                event_stream = EventStream.new 'test'

                content_type 'text/event-stream'
                stream :keep_open do |out|
                    event_stream.subscribe do |message|
                        if out.closed?
                            event_stream.unsubscribe
                            next
                        end

                        out << "event: test\ndata: #{message}\n\n"
                    end
                end
            end

            get '/identity' do
                remote_ip = IP.new request.ip
                identity = nil

                identity_team = Themis::Controllers::IdentityController.is_team remote_ip
                unless identity_team.nil?
                    identity = { name: 'team', id: identity_team.id }
                end

                if identity.nil? and Themis::Controllers::IdentityController.is_other remote_ip
                    identity = { name: 'other' }
                end

                if identity.nil? and Themis::Controllers::IdentityController.is_internal remote_ip
                    identity = { name: 'internal' }
                end

                json identity
            end

            get '/contest' do
                round = Themis::Models::Round.count
                state = Themis::Models::ContestState.last
                scoreboard_state = Themis::Models::ScoreboardState.last
                scoreboard_enabled = false
                if scoreboard_state.nil?
                    scoreboard_enabled = true
                else
                    scoreboard_enabled = scoreboard_state.state == :enabled
                end

                r = {}
                if round == 0
                    r['round'] = nil
                else
                    r['round'] = round
                end

                if state.nil?
                    r['state'] = nil
                else
                    r['state'] = state.state
                end

                r['scoreboard_enabled'] = scoreboard_enabled

                json r
            end

            get '/teams' do
                r = Themis::Models::Team.map do |team|
                    {
                        id: team.id,
                        name: team.name,
                        guest: team.guest
                    }
                end

                json r
            end

            get '/services' do
                r = Themis::Models::Service.map do |service|
                    {
                        id: service.id,
                        name: service.name
                    }
                end

                json r
            end

            get '/posts' do
                r = Themis::Models::Post.map do |post|
                    {
                        id: post.id,
                        title: post.title,
                        description: post.description,
                        created_at: post.created_at,
                        updated_at: post.updated_at
                    }
                end

                json r
            end

            get '/team/scores' do
                scoreboard_state = Themis::Models::ScoreboardState.last
                scoreboard_enabled = false
                if scoreboard_state.nil?
                    scoreboard_enabled = true
                else
                    scoreboard_enabled = scoreboard_state.state == :enabled
                end

                remote_ip = IP.new request.ip

                if scoreboard_enabled or Themis::Controllers::IdentityController.is_internal remote_ip
                    r = Themis::Models::TotalScore.map do |total_score|
                        {
                            id: total_score.id,
                            team_id: total_score.team_id,
                            defence_points: total_score.defence_points.to_f,
                            attack_points: total_score.attack_points.to_f
                        }
                    end
                else
                    r = scoreboard_state.total_scores
                end

                json r
            end

            get '/team/services' do
                r = Themis::Models::TeamServiceState.map do |team_service_state|
                    {
                        id: team_service_state.id,
                        team_id: team_service_state.team_id,
                        service_id: team_service_state.service_id,
                        state: team_service_state.state,
                        updated_at: team_service_state.updated_at
                    }
                end

                json r
            end

            get '/team/attacks' do
                scoreboard_state = Themis::Models::ScoreboardState.last
                scoreboard_enabled = false
                if scoreboard_state.nil?
                    scoreboard_enabled = true
                else
                    scoreboard_enabled = scoreboard_state.state == :enabled
                end

                remote_ip = IP.new request.ip

                if scoreboard_enabled or Themis::Controllers::IdentityController.is_internal remote_ip
                    r = Themis::Controllers::Attack::get_recent.map do |attack|
                        {
                            id: attack.id,
                            occured_at: attack.occured_at,
                            team_id: attack.team_id
                        }
                    end
                else
                    r = scoreboard_state.attacks
                end

                json r
            end

            get %r{^/team/pictures/(\d{1,2})$} do |team_id_str|
                team_id = team_id_str.to_i
                filename = File.join Dir.pwd, 'pictures', "team-#{team_id}.png"
                unless File.exists? filename
                    filename = File.join Dir.pwd, 'pictures', '__default.png'
                end

                send_file filename
            end

            post '/submit' do
                if request.content_type != 'application/json'
                    halt 400, json(Themis::Attack::Result::ERR_INVALID_FORMAT)
                end

                remote_ip = IP.new request.ip
                identity = nil

                team = Themis::Controllers::IdentityController.is_team remote_ip
                if team.nil?
                    halt 400, json(Themis::Attack::Result::ERR_INVALID_IDENTITY)
                end

                payload = nil

                begin
                    request.body.rewind
                    payload = JSON.parse request.body.read
                rescue => e
                    halt 400, json(Themis::Attack::Result::ERR_INVALID_FORMAT)
                end

                unless payload.respond_to? 'map'
                    halt 400, json(Themis::Attack::Result::ERR_INVALID_FORMAT)
                end

                state = Themis::Models::ContestState.last
                if state.nil? or state.state == :initial
                    halt 400, json(Themis::Attack::Result::ERR_CONTEST_NOT_STARTED)
                end

                if state.state == :paused
                    halt 400, json(Themis::Attack::Result::ERR_CONTEST_PAUSED)
                end

                if state.state == :completed
                    halt 400, json(Themis::Attack::Result::ERR_CONTEST_COMPLETED)
                end

                r = payload.map do |flag|
                    Themis::Controllers::Attack::process team, flag
                end

                if r.count == 0
                    halt 400, json(Themis::Attack::Result::ERR_INVALID_FORMAT)
                end

                json r
            end
        end
    end
end
