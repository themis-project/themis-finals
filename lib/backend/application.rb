require 'sinatra/base'
require 'sinatra/json'
require './lib/backend/event-stream'
require 'json'
require 'ip'
require 'date'
require './lib/controllers/identity'
require 'themis/attack/result'
require './lib/controllers/attack'
require './lib/utils/event-emitter'
require 'em-synchrony'


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

            get '/stream' do
                remote_ip = IP.new request.ip
                identity = nil

                identity_team = Themis::Controllers::IdentityController.is_team remote_ip
                unless identity_team.nil?
                    identity = 'teams'
                end

                if identity.nil? and Themis::Controllers::IdentityController.is_other remote_ip
                    identity = 'other'
                end

                if identity.nil? and Themis::Controllers::IdentityController.is_internal remote_ip
                    identity = 'internal'
                end

                halt 400 if identity.nil?
                event_stream = EventStream.new "themis:#{identity}"

                content_type 'text/event-stream'
                stream :keep_open do |out|
                    logger.info 'Client connected!'
                    last_event_id_str = env['HTTP_LAST_EVENT_ID']
                    unless last_event_id_str.nil?
                        last_event_id = last_event_id_str.to_i
                        logger.info "Client want to fetch all events greater than #{last_event_id}"
                        last_events = nil
                        if identity == 'internal'
                            last_events = Themis::Models::ServerSentEvent.all(
                                :id.gt => last_event_id,
                                :internal => true
                            )
                        elsif identity == 'teams'
                            last_events = Themis::Models::ServerSentEvent.all(
                                :id.gt => last_event_id,
                                :teams => true
                            )
                        elsif identity == 'other'
                            last_events = Themis::Models::ServerSentEvent.all(
                                :id.gt => last_event_id,
                                :other => true
                            )
                        end

                        if last_events != nil
                            last_events.each do |last_event|
                                message = Themis::Utils::EventEmitter.format last_event.id, last_event.name, last_event.data, 5000
                                logger.info "Sending message #{message}"
                                out << message
                            end
                        end
                    end

                    event_stream.subscribe do |message|
                        if out.closed?
                            logger.info 'Client disconnected!'
                            event_stream.unsubscribe
                            next
                        end

                        out << message
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
                scoreboard_state = Themis::Models::ScoreboardState.last

                r = {
                    enabled: scoreboard_state.nil? ? true : (scoreboard_state.state == :enabled)
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
                        created_at: post.created_at,
                        updated_at: post.updated_at
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
                    post = Themis::Models::Post.create(
                        title: payload['title'],
                        description: payload['description'],
                        created_at: DateTime.now,
                        updated_at: DateTime.now)

                    Themis::Utils::EventEmitter.emit_all 'posts/add', {
                        id: post.id,
                        title: post.title,
                        description: post.description,
                        created_at: post.created_at,
                        updated_at: post.updated_at
                    }
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
                post = Themis::Models::Post.get post_id
                halt 404 if post.nil?

                unless post.destroy
                    halt 400
                end

                Themis::Utils::EventEmitter.emit_all 'posts/remove', {
                    id: post_id
                }

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
                post = Themis::Models::Post.get post_id
                halt 404 if post.nil?

                post.title = payload['title']
                post.description = payload['description']
                post.updated_at = DateTime.now

                begin
                    post.save
                    Themis::Utils::EventEmitter.emit_all 'posts/edit', {
                        id: post.id,
                        title: post.title,
                        description: post.description,
                        created_at: post.created_at,
                        updated_at: post.updated_at
                    }
                rescue => e
                    halt 400
                end

                status 204
                body ''
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
                team = Themis::Models::Team.get team_id
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
                if state.nil? or [:initial, :await_start].include? state.state
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
