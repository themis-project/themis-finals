Sequel.migration do
    up do
        create_table(:attacks) do
            primary_key :id
            DateTime :occured_at, :null => false
            TrueClass :considered, :null => false, :default => false
            foreign_key :team_id, :teams, :index => true, :null => false
            foreign_key :flag_id, :flags, :index => true, :null => false
            unique [:team_id, :flag_id]
        end
    end

    down do
        drop_table(:attacks)
    end
end
