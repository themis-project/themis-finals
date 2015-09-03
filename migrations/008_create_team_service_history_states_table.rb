Sequel.migration do
    up do
        create_table(:team_service_history_states) do
            primary_key :id
            Integer :state, :null => false, :default => 0
            DateTime :created_at, :null => false
            foreign_key :team_id, :teams, :index => true, :null => false
            foreign_key :service_id, :services, :index => true, :null => false
        end
    end

    down do
        drop_table(:team_service_history_states)
    end
end
