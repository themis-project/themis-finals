import express from 'express'
import logger from './utils/logger'
import config from './utils/config'
import getRemoteAddr from './middleware/addr'
import getIdentity from './middleware/identity'

config.loadSync()

let app = express()
app.set('trust proxy', true)
app.set('x-powered-by', false)

app.get('/', getRemoteAddr, getIdentity, (request, response) => {
    logger.info(request.remoteAddr)
    response.json('OK')
})

app.use((err, request, response, next) => {
    logger.error(err)
    response.status(500)
    response.json('Internal Server Error')
})


export default app
