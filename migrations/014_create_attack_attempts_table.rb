Sequel.migration do
    up do
        create_table(:attack_attempts) do
            primary_key :id
            DateTime :occured_at, :null => false
            String :request, :size => 1024, :null => false
            Integer :response, :null => false
            foreign_key :team_id, :teams, :index => true, :null => false
        end
    end

    down do
        drop_table(:attack_attempts)
    end
end
