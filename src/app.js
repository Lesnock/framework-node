import cors from 'cors'
import express from 'express'

import User from './models/User'

// Routes
import { Public, Private } from './routes'

class App {
  constructor() {
    this.server = express()

    this.createAdminUser()
    this.middlewares()
    this.routes()
  }

  routes() {
    this.server.use(express.static('public'))

    this.server.use(Public)
    this.server.use(Private)
  }

  middlewares() {
    this.server.use(cors())
    this.server.use(express.urlencoded({ extended: false }))
    this.server.use(express.json())
  }

  async createAdminUser() {
    if (!(await User.exists({ username: 'admin' }))) {
      await User.insert({
        name: 'Administrador',
        email: 'ti@metadil.com.br',
        username: 'admin',
        password: 'Admin$uporte'
      })
    }
  }
}

export default App
