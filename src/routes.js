import { Router } from 'express'
import { action } from './helpers'

// Middlewares
import auth from './middlewares/auth'
import filters from './middlewares/filters'

// Controllers
import MainController from './controllers/MainController'
import UserController from './controllers/UserController'
import LoginController from './controllers/LoginController'
import PhoneController from './controllers/PhoneController'
import DepartmentController from './controllers/DepartmentController'

// Public routes
export const Public = new Router()
Public.get('/', action(MainController, 'index'))
Public.post('/users', action(UserController, 'store'))
Public.post('/login', action(LoginController, 'login'))

// Private routes
export const Private = new Router()
Private.use(auth)
Private.use(filters)

Private.get('/users', action(UserController, 'index'))
Private.get('/users/:id', action(UserController, 'show'))
Private.put('/users/:id', action(UserController, 'update'))
Private.delete('/users/:id', action(UserController, 'delete'))

Private.get('/departments', action(DepartmentController, 'index'))

Private.get('/phones', action(PhoneController, 'index'))
