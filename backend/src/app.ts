import express, { Application } from 'express'
import cors from 'cors'
import DotfileRoute from './routes/dotfile.route'
import WebhooksRoute from './routes/webhooks.route'
import rateLimit from 'express-rate-limit'

const app: Application = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

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
