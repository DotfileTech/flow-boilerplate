import dotenv from 'dotenv'
dotenv.config()

import app from './app'

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.info(`Dotfile Demozone Listening to port ${PORT}`)
})

app.disable('x-powered-by')

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  console.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  console.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
