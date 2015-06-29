require './lib/models/init'
require './lib/backend/init'
require './config'

Themis::Models::init
Themis::Backend::run
