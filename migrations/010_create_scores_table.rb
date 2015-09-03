Sequel.migration do
    up do
        create_table(:scores) do
            primary_key :id
            BigDecimal :defence_points, :size => [10, 2], :null => false, :default => 0.0
            BigDecimal :attack_points, :size => [10, 2], :null => false, :default => 0.0
            foreign_key :team_id, :teams, :index => true, :null => false
            foreign_key :round_id, :rounds, :index => true, :null => false
            unique [:team_id, :round_id]
        end
    end

    down do
        drop_table(:scores)
    end
end
