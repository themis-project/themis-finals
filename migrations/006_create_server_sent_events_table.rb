Sequel.migration do
    up do
        create_table(:server_sent_events) do
            primary_key :id
            String :name, :size => 50, :null => false
            json :data
            TrueClass :internal, :null => false, :default => false
            TrueClass :teams, :null => false, :default => false
            TrueClass :other, :null => false, :default => false
        end
    end

    down do
        drop_table(:server_sent_events)
    end
end
