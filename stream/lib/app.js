import express from 'express'
import logger from './utils/logger'

let app = express()
app.set('x-powered-by', false)

app.get('/', (request, response) => {
    response.json('OK')
})

app.use((err, request, response, next) => {
    logger.error(err)
    response.status(500)
    response.json('Internal Server Error')
})


export default app
