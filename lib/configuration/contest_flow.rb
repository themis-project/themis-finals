module Themis
    module Configuration
        class ContestFlow
            attr_accessor :flag_lifetime, :push_period,
                          :poll_period, :poll_count, :update_period,
                          :attack_limit_attempts, :attack_limit_period,
                          :generator_secret

            def initialize
                @flag_lifetime = nil
                @push_period = nil
                @poll_period = nil
                @poll_count = nil
                @update_period = nil
                @attack_limit_attempts = nil
                @attack_limit_period = nil
                @generator_secret = nil
            end
        end

        class ContestFlowDSL
            attr_reader :contest_flow

            def initialize
                @contest_flow = ContestFlow.new
            end

            def flag_lifetime(flag_lifetime)
                @contest_flow.flag_lifetime = flag_lifetime
            end

            def push_period(push_period)
                @contest_flow.push_period = push_period
            end

            def poll_period(poll_period)
                @contest_flow.poll_period = poll_period
            end

            def poll_count(poll_count)
                @contest_flow.poll_count = poll_count
            end

            def update_period(update_period)
                @contest_flow.update_period = update_period
            end

            def attack_limits(attempts, period)
                @contest_flow.attack_limit_attempts = attempts
                @contest_flow.attack_limit_period = period
            end

            def generator_secret(generator_secret)
                @contest_flow.generator_secret = generator_secret
            end
        end
    end
end
