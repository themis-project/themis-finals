Sequel.migration do
    up do
        create_table(:rounds) do
            primary_key :id
            DateTime :started_at, :null => false
            DateTime :finished_at, :null => true
        end
    end

    down do
        drop_table(:rounds)
    end
end
