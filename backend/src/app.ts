import express, { Application } from 'express'
import cors from 'cors'
import DotfileRoute from './routes/dotfile.route'
import WebhooksRoute from './routes/webhooks.route'

const app: Application = express()

//  CORS disabled in development
// app.options('*', cors())

app.use(
  cors({
    credentials: true,
    preflightContinue: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    origin: process.env.APP_URL,
  }),
)

app.get('/health', (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Everything works fine',
    date: new Date(),
  }

  res.status(200).send(data)
})

app.use('/webhooks', new WebhooksRoute().router)
app.use('/dotfile', new DotfileRoute().router)

interface ResponseError extends Error {
  status?: number
}

app.use((req, res, next) => {
  const err: ResponseError = new Error('Not Found')
  err.status = 404
  next(err)
})

export default app
