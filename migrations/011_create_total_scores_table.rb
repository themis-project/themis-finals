Sequel.migration do
    up do
        create_table(:total_scores) do
            primary_key :id
            BigDecimal :defence_points, :size => [10, 2], :null => false, :default => 0.0
            BigDecimal :attack_points, :size => [10, 2], :null => false, :default => 0.0
            foreign_key :team_id, :teams, :index => true, :unique => true, :null => false
        end
    end

    down do
        drop_table(:total_scores)
    end
end
