import { Router } from 'express'
import { action } from './helpers'

// Controllers
import MainController from './controllers/MainController'

// Public routes
export const Public = new Router()

Public.get('/', action(MainController, 'index'))

// Private routes
export const Private = new Router()
