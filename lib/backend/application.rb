require 'sinatra/base'
require 'sinatra/json'
require './lib/backend/event-stream'
require 'json'
require 'ip'
require './lib/controllers/identity'


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

            get '/' do
                erb :index
            end

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

                if identity.nil? and Themis::Controllers::IdentityController.is_guest remote_ip
                    identity = { name: 'guest' }
                end

                if identity.nil? and Themis::Controllers::IdentityController.is_internal remote_ip
                    identity = { name: 'internal' }
                end

                json identity
            end

            get '/teams' do
                r = Themis::Models::Team.map do |team|
                    {
                        id: team.id,
                        name: team.name
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
                r = Themis::Models::TotalScore.map do |total_score|
                    {
                        id: total_score.id,
                        team_id: total_score.team_id,
                        defence_points: total_score.defence_points.to_f,
                        attack_points: total_score.attack_points.to_f
                    }
                end

                json r
            end
        end
    end
end
