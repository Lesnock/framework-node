import { Router } from 'express'

// Controllers
import MainController from './controllers/MainController'

// Public routes
export const Public = new Router()

Public.get('/', MainController.index)

// Private routes
export const Private = new Router()
