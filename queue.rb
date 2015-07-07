require './config'
require './lib/models/init'
require './lib/queue/init'


Themis::Models::init
Themis::Queue::run
