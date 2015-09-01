import { EventEmitter } from 'events'
import subscriber from './subscriber'
import logger from './logger'


class EventStream extends EventEmitter {
    constructor(maxListeners) {
        super()
        this.setMaxListeners(maxListeners)
    }

    format(id, name, retry, data) {
        let encodedData = JSON.stringify(data)
        return `id: ${id}\nevent: ${name}\nretry: ${retry}\ndata: ${encodedData}\n\n`
    }

    run() {
        subscriber.subscribe('themis:internal')
        subscriber.subscribe('themis:teams')
        subscriber.subscribe('themis:other')

        subscriber.on('message', (channel, rawData) => {
            let message = JSON.parse(rawData)
            this.emit(channel, this.format(message.id, message.name, 5000, message.data))
        })
    }
}

export default new EventStream(1024)
