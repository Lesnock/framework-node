import { Router } from 'express'
import { action } from './helpers'

// Middlewares
import auth from './middlewares/auth'

// Controllers
import MainController from './controllers/MainController'
import UserController from './controllers/UserController'
import LoginController from './controllers/LoginController'

// Public routes
export const Public = new Router()
Public.get('/', action(MainController, 'index'))
Public.post('/', action(UserController, 'store'))
Public.post('/login', action(LoginController, 'login'))

// Private routes
export const Private = new Router()
Private.use(auth)

Private.get('/users', action(UserController, 'index'))
