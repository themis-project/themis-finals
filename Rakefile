task :migrate_db do
    require './config'
    require './lib/models/init'

    Themis::Models::init
    DataMapper.auto_migrate!
end
