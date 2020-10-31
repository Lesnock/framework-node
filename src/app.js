import cors from 'cors'
import express from 'express'

// Routes
import { Public, Private } from './routes'

class App {
  constructor() {
    this.server = express()
    this.server.use(cors())

    this.routes()
  }

  routes() {
    this.server.use(Public)
    this.server.use(Private)
  }

  middlewares() {

  }
}

export default App
