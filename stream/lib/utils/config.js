import fs from 'fs'
import path from 'path'
import logger from './logger'
import { Addr } from 'netaddr'


class Config {
    constructor() {
        this.network = {
            internal: [],
            other: [],
            teams: []
        }

        this.redisConnection = {
        }

        this.postgresConnection = {
        }
    }

    loadSync() {
        let configFilename = path.join(process.cwd(), 'config.json')
        try {
            let stats = fs.lstatSync(configFilename)
            let rawData = fs.readFileSync(configFilename)
            let data = JSON.parse(rawData)

            this.redisConnection = data.redis_connection
            this.postgresConnection = data.postgres_connection

            for (let addr of data.network.internal) {
                this.network.internal.push(Addr(addr))
            }

            for (let addr of data.network.other) {
                this.network.other.push(Addr(addr))
            }

            for (let addr of data.network.teams) {
                this.network.teams.push(Addr(addr))
            }
        } catch(e) {
            logger.error(e)
            process.exit(1)
        }
    }
}

export default new Config()
