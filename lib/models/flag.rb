require 'sequel'


module Themis
    module Models
        class Flag < Sequel::Model
            many_to_one :service
            many_to_one :team
            many_to_one :round

            one_to_many :attacks
            one_to_many :flag_polls

            dataset_module do
                def all_living
                    exclude(:expired_at => nil).where('expired_at > ?', DateTime.now)
                end

                def all_expired
                    exclude(:expired_at => nil).where(:considered_at => nil).where('expired_at < ?', DateTime.now)
                end
            end
        end
    end
end
