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
import WithdrawalController from './controllers/WithdrawalController'

// Public routes
export const Public = new Router()
Public.post('/login', action(LoginController, 'login'))

// Private routes
export const Private = new Router()
Private.use(auth)
Private.use(filters)

Private.get('/users/me', action(UserController, 'me'))

const resources = {
  '/users': UserController,
  '/departments': DepartmentController,
  '/products': ProductController,
  '/withdrawals': WithdrawalController
}

for (const route in resources) {
  const Controller = resources[route]

  Private.get(route, action(Controller, 'index'))
  Private.post(route, action(Controller, 'store'))
  Private.get(`${route}/:id`, action(Controller, 'show'))
  Private.put(`${route}/:id`, action(Controller, 'update'))
  Private.delete(`${route}/:id`, action(Controller, 'delete'))
}
