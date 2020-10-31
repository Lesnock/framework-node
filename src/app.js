import cors from 'cors'
import express from 'express'

// Routes
import { Public, Private } from './routes'

class App {
  constructor() {
    this.server = express()

    this.routes()
    this.middlewares()
  }

  routes() {
    this.server.use(express.static('public'))

    this.server.use(Public)
    this.server.use(Private)
  }

  middlewares() {
    this.server.use(cors())
    this.server.use(express.json())
    // this.server.use(express.urlencoded())
  }
}

export default App
