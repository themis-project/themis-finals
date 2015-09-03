Sequel.migration do
    up do
        create_table(:flag_polls) do
            primary_key :id
            Integer :state, :null => false, :default => 0
            DateTime :created_at, :null => false
            DateTime :updated_at, :null => true
            foreign_key :flag_id, :flags, :index => true, :null => false
        end
    end

    down do
        drop_table(:flag_polls)
    end
end
