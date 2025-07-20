import { Server } from 'http'
import app from './app'
import config from './config'
import mongoose from 'mongoose'

// const port = 3000;

let server: Server

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    server = app.listen(config.port, () => {
      console.log(`Application is listening on port ${config.port}`)
    })
  } catch (error) {
    console.log('Server is not running', error)
  }
}

main()

process.on('unhandledRejection', () => {
  console.log(`Unhandled Rejection. Shutting down...`)
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  console.log(`Uncaught Exception. Shutting down...`)
  process.exit(1)
})
