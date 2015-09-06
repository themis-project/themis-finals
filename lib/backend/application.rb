require 'sinatra/base'
require 'sinatra/json'
require 'json'
require 'ip'
require 'date'
require './lib/controllers/identity'
require 'themis/attack/result'
require './lib/controllers/attack'
require './lib/utils/event-emitter'
require './lib/controllers/scoreboard-state'


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
            configure :production, :development do
                enable :logging
            end

            disable :run

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

            get '/contest/round' do
                round = Themis::Models::Round.count

                r = {
                    value: (round == 0) ? nil : round
                }

                json r
            end

            get '/contest/state' do
                state = Themis::Models::ContestState.last

                r = {
                    value: state.nil? ? nil : state.state
                }

                json r
            end

            get '/contest/scoreboard' do
                r = {
                    enabled: Themis::Controllers::ScoreboardState::is_enabled
                }

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
                        created_at: post.created_at.iso8601,
                        updated_at: post.updated_at.iso8601
                    }
                end

                json r
            end

            post '/post' do
                if request.content_type != 'application/json'
                    halt 400
                end

                remote_ip = IP.new request.ip

                unless Themis::Controllers::IdentityController.is_internal remote_ip
                    halt 400
                end

                payload = nil

                begin
                    request.body.rewind
                    payload = JSON.parse request.body.read
                rescue => e
                    halt 400
                end

                unless payload.has_key?('title') and payload.has_key?('description')
                    halt 400
                end

                begin
                    Themis::Models::DB.transaction do
                        post = Themis::Models::Post.create(
                            :title => payload['title'],
                            :description => payload['description'],
                            :created_at => DateTime.now,
                            :updated_at => DateTime.now
                        )

                        Themis::Utils::EventEmitter.emit_all 'posts/add', {
                            id: post.id,
                            title: post.title,
                            description: post.description,
                            created_at: post.created_at.iso8601,
                            updated_at: post.updated_at.iso8601
                        }
                    end
                rescue => e
                    halt 400
                end

                status 201
                body ''
            end

            delete %r{^/post/(\d+)$} do |post_id_str|
                remote_ip = IP.new request.ip

                unless Themis::Controllers::IdentityController.is_internal remote_ip
                    halt 400
                end

                post_id = post_id_str.to_i
                post = Themis::Models::Post[post_id]
                halt 404 if post.nil?

                Themis::Models::DB.transaction do
                    post.destroy

                    Themis::Utils::EventEmitter.emit_all 'posts/remove', {
                        id: post_id
                    }
                end

                status 204
                body ''
            end

            put %r{^/post/(\d+)$} do |post_id_str|
                if request.content_type != 'application/json'
                    halt 400
                end

                remote_ip = IP.new request.ip

                unless Themis::Controllers::IdentityController.is_internal remote_ip
                    halt 400
                end

                payload = nil

                begin
                    request.body.rewind
                    payload = JSON.parse request.body.read
                rescue => e
                    halt 400
                end

                unless payload.has_key?('title') and payload.has_key?('description')
                    halt 400
                end

                post_id = post_id_str.to_i
                post = Themis::Models::Post[post_id]
                halt 404 if post.nil?

                begin
                    Themis::Models::DB.transaction do
                        post.title = payload['title']
                        post.description = payload['description']
                        post.updated_at = DateTime.now
                        post.save

                        Themis::Utils::EventEmitter.emit_all 'posts/edit', {
                            id: post.id,
                            title: post.title,
                            description: post.description,
                            created_at: post.created_at.iso8601,
                            updated_at: post.updated_at.iso8601
                        }
                    end
                rescue => e
                    halt 400
                end

                status 204
                body ''
            end

            get '/team/scores' do
                scoreboard_state = Themis::Models::ScoreboardState.last
                scoreboard_enabled = scoreboard_state.nil? ? true : scoreboard_state.enabled

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
                        updated_at: team_service_state.updated_at.iso8601
                    }
                end

                json r
            end

            get '/team/attacks' do
                scoreboard_state = Themis::Models::ScoreboardState.last
                scoreboard_enabled = scoreboard_state.nil? ? true : scoreboard_state.enabled

                remote_ip = IP.new request.ip

                if scoreboard_enabled or Themis::Controllers::IdentityController.is_internal remote_ip
                    r = Themis::Controllers::Attack::get_recent.map do |attack|
                        {
                            id: attack.id,
                            occured_at: attack.occured_at.iso8601,
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
                team = Themis::Models::Team[team_id]
                halt 404 if team.nil?

                filename = File.join Dir.pwd, 'pictures', "#{team.alias}.png"
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
                if state.nil? or state.is_initial or state.is_await_start
                    halt 400, json(Themis::Attack::Result::ERR_CONTEST_NOT_STARTED)
                end

                if state.is_paused
                    halt 400, json(Themis::Attack::Result::ERR_CONTEST_PAUSED)
                end

                if state.is_completed
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
