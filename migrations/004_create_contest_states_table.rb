Sequel.migration do
    up do
        create_table(:contest_states) do
            primary_key :id
            Integer :state, :null => false, :default => 0
            DateTime :created_at, :null => false
        end
    end

    down do
        drop_table(:contest_states)
    end
end
