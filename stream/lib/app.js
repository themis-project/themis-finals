import express from 'express'
import logger from './utils/logger'
import getRemoteAddr from './middleware/addr'
import getIdentity from './middleware/identity'
import getLastEventId from './middleware/last-event-id'
import { BaseError, UnknownIdentityError } from './utils/errors'
import eventStream from './utils/event-stream'
import ServerSentEvent from './models/server-sent-event'


let app = express()
app.set('trust proxy', true)
app.set('x-powered-by', false)


function fetchRecentEvents(request, response, callback) {
    let lastEventId = request.lastEventId

    if (lastEventId != null) {
        let query = ServerSentEvent.where('id', '>', lastEventId)

        if (request.identity === 'internal') {
            query = query.where('internal', true)
        } else if (request.identity === 'teams') {
            query = query.where('teams', true)
        } else if (request.identity === 'other') {
            query = model.where('other', true)
        }

        query
        .fetchAll()
        .then((serverSentEvents) => {
            serverSentEvents.forEach((serverSentEvent) => {
                response.write(eventStream.format(
                    serverSentEvent.attributes.id,
                    serverSentEvent.attributes.name,
                    5000,
                    JSON.parse(serverSentEvent.attributes.data)
                ))
            })

            callback(null)
        })
        .catch((err) => {
            callback(err)
        })
    } else {
        callback(null)
    }
}


app.get('/', getRemoteAddr, getIdentity, getLastEventId, (request, response) => {
    if (request.identity == null) {
        throw new UnknownIdentityError()
    }

    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    response.write('\n')

    fetchRecentEvents(request, response, (err) => {
        let pushEvent = function(data) {
            response.write(data)
        }

        let channel = `themis:${request.identity}`

        eventStream.on(channel, pushEvent)

        request.once('close', () => {
            eventStream.removeListener(channel, pushEvent)
        })
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
