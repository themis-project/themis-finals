import redis from 'redis'
import config from './config'


class Subscriber {
    constructor() {
        let host = config.redisConnection.host
        let port = config.redisConnection.port
        let options = {}

        this.client = redis.createClient(port, host)
        this.client.select(0)
    }

    subscribe(channel) {
        this.client.subscribe(channel)
    }

    on(eventName, callback) {
        this.client.on(eventName, callback)
    }
}

export default new Subscriber()
