import redis from 'redis'
import config from './config'
import logger from './logger'


class Subscriber {
    constructor() {
        let host = config.redisConnection.host
        let port = config.redisConnection.port
        let options = {}

        this.client = redis.createClient(port, host)
        this.client.select(0)

        this.client.on('ready', () => {
            logger.info('Connection to Redis has been established ...')
        })

        this.client.on('error', (err) => {
            logger.error(`Redis connection error: ${err}`)
        })
    }

    subscribe(channel) {
        this.client.subscribe(channel)
    }

    on(eventName, callback) {
        this.client.on(eventName, callback)
    }
}

export default new Subscriber()
