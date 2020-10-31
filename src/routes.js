import { Router } from 'express'
import { route } from './helpers'

// Controllers
import MainController from './controllers/MainController'

// Public routes
export const Public = new Router()

Public.get('/', route(MainController, 'index'))

// Private routes
export const Private = new Router()
