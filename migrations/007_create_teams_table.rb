Sequel.migration do
    up do
        create_table(:teams) do
            primary_key :id
            String :name, :size => 100, :null => false, :unique => true
            String :alias, :size => 50, :null => false, :unique => true
            String :network, :size => 18, :null => false, :unique => true
            String :host, :size => 15, :null => false, :unique => true
            TrueClass :guest, :null => false, :default => false
        end
    end

    down do
        drop_table(:teams)
    end
end
