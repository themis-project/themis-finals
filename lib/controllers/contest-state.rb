require './lib/controllers/scoreboard-state'
require './lib/utils/event-emitter'
require './lib/constants/contest-state'
require 'json'


module Themis
    module Controllers
        module ContestState
            def self.init
                Themis::Configuration::get_teams.each do |team_opts|
                    Themis::Models::Team.create(
                        :name => team_opts.name,
                        :alias => team_opts.alias,
                        :network => team_opts.network,
                        :host => team_opts.host,
                        :guest => team_opts.guest)
                end

                Themis::Configuration::get_services.each do |service_opts|
                    Themis::Models::Service.create(
                        :name => service_opts.name,
                        :alias => service_opts.alias
                    )
                end
                change_state Themis::Constants::ContestState::INITIAL
                Themis::Controllers::ScoreboardState::enable

                stream_config_filename = File.join Dir.pwd, 'stream', 'config.json'
                data = Themis::Configuration::get_stream_config
                IO.write stream_config_filename, JSON.pretty_generate(data)
            end

            def self.start_async
                change_state Themis::Constants::ContestState::AWAIT_START
            end

            def self.start
                change_state Themis::Constants::ContestState::RUNNING
            end

            def self.resume
                change_state Themis::Constants::ContestState::RUNNING
            end

            def self.pause
                change_state Themis::Constants::ContestState::PAUSED
            end

            def self.complete_async
                change_state Themis::Constants::ContestState::AWAIT_COMPLETE
            end

            def self.complete
                change_state Themis::Constants::ContestState::COMPLETED
            end

            private
            def self.change_state(state)
                Themis::Models::ContestState.create(
                    :state => state,
                    :created_at => DateTime.now
                )

                Themis::Utils::EventEmitter::emit_all 'contest/state', { value: state }
                Themis::Utils::EventEmitter::emit_log 1, { value: state }
            end
        end
    end
end
