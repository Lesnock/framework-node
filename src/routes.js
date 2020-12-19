import { Router } from 'express'
import { action } from './helpers'

// Middlewares
import auth from './middlewares/auth'
import filters from './middlewares/filters'

// Controllers
import UserController from './controllers/UserController'
import LoginController from './controllers/LoginController'
import ProductController from './controllers/ProductController'
import DepartmentController from './controllers/DepartmentController'

// Public routes
export const Public = new Router()
Public.post('/login', action(LoginController, 'login'))

// Private routes
export const Private = new Router()
Private.use(auth)
Private.use(filters)

Private.get('/', (req, res) => res.send('ok'))
Private.get('/users', action(UserController, 'index'))
Private.get('/users/me', action(UserController, 'me'))
Private.post('/users', action(UserController, 'store'))
Private.get('/users/:id', action(UserController, 'show'))
Private.put('/users/:id', action(UserController, 'update'))
Private.delete('/users/:id', action(UserController, 'delete'))

Private.get('/departments', action(DepartmentController, 'index'))
Private.post('/departments', action(DepartmentController, 'store'))
Private.get('/departments/:id', action(DepartmentController, 'show'))
Private.put('/departments/:id', action(DepartmentController, 'update'))
Private.delete('/departments/:id', action(DepartmentController, 'delete'))

Private.get('/products', action(ProductController, 'index'))
Private.post('/products', action(ProductController, 'store'))
Private.get('/products/:id', action(ProductController, 'show'))
Private.put('/products/:id', action(ProductController, 'update'))
Private.delete('/products/:id', action(ProductController, 'delete'))
