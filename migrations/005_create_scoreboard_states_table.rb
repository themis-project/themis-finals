Sequel.migration do
    up do
        create_table(:scoreboard_states) do
            primary_key :id
            TrueClass :enabled, :null => false, :default => true
            DateTime :created_at, :null => false
            json :total_scores
            json :attacks
        end
    end

    down do
        drop_table(:scoreboard_states)
    end
end
