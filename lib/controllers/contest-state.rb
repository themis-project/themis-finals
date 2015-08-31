require './lib/controllers/scoreboard-state'
require './lib/utils/event-emitter'
require 'json'


module Themis
    module Controllers
        module ContestState
            def self.init
                Themis::Configuration::get_teams.each do |team_opts|
                    Themis::Models::Team::create(
                        name: team_opts.name,
                        alias: team_opts.alias,
                        network: team_opts.network,
                        host: team_opts.host,
                        guest: team_opts.guest)
                end

                Themis::Configuration::get_services.each do |service_opts|
                    Themis::Models::Service::create(
                        name: service_opts.name,
                        alias: service_opts.alias)
                end

                change_state :initial
                Themis::Controllers::ScoreboardState::enable

                stream_config_filename = File.join Dir.pwd, 'stream', 'config.js'
                data = Themis::Configuration::get_stream_config
                IO.write stream_config_filename, JSON.pretty_generate(data)
            end

            def self.start_async
                change_state :await_start
            end

            def self.start
                change_state :running
            end

            def self.resume
                change_state :running
            end

            def self.pause
                change_state :paused
            end

            def self.complete_async
                change_state :await_complete
            end

            def self.complete
                change_state :completed
            end

            private
            def self.change_state(state)
                unless state.nil?
                    Themis::Models::ContestState::create(
                        state: state,
                        created_at: DateTime.now)
                end

                Themis::Utils::EventEmitter::emit_all 'contest/state', { value: state }
                Themis::Utils::EventEmitter::emit_log 1, { value: state }
            end
        end
    end
end
