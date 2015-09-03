import knex from 'knex'
import config from './config'


let opts = config.postgresConnection

export default knex({
    client: 'pg',
    connection: `postgres://${opts.username}:${opts.passwd}@${opts.hostname}:${opts.port}/${opts.dbname}`
})
