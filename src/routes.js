import { Router } from 'express'

// Public routes
export const Public = new Router()

Public.get('/', (req, res) => {
  res.send('Get worked!')
})

// Private routes
export const Private = new Router()


