import express from 'express'
import logger from './utils/logger'
import getRemoteAddr from './middleware/addr'
import getIdentity from './middleware/identity'
import { BaseError, UnknownIdentityError } from './utils/errors'
import eventStream from './utils/event-stream'


let app = express()
app.set('trust proxy', true)
app.set('x-powered-by', false)

app.get('/', getRemoteAddr, getIdentity, (request, response) => {
    if (request.identity == null) {
        throw new UnknownIdentityError()
    }

    // request.socket.setTimeout(Infinity)

    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    response.write('\n')

    let pushEvent = function(data) {
        response.write(data)
    }

    let channel = `themis:${request.identity}`

    eventStream.on(channel, pushEvent)

    request.once('close', () => {
        eventStream.removeListener(channel, pushEvent)
    })
})

app.use((err, request, response, next) => {
    if (err instanceof BaseError) {
        response.status(err.getHttpStatus())
        response.json(err.message)
    } else {
        logger.error(err)
        response.status(500)
        response.json('Internal Server Error')
    }
})


export default app
