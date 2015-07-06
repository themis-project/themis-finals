require './config'
require './lib/models/init'
require './lib/scheduler/init'


Themis::Models::init
Themis::Scheduler::run
