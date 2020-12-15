import Product from '../models/Product'
import ResourceController from '../core/ResourceController'

class ProductController extends ResourceController {
  constructor() {
    super()

    this.model = Product
  }

  // Hook - Should return the list to be displayed
  // async list(req, res) {}

  // Hook - Should return a unique register
  // async get(req, res) {}

  // Hook - Should insert a register
  // Hook - async insert(req, res) {}

  // Hook - Should update a register
  // async update(req, res) {}

  // Hook - Should delete a register
  // async destroy(req, res) {}
}

export default new ProductController()
