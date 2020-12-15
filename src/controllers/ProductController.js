import Product from '../models/Product'
import ResourceController from '../core/ResourceController'

class ProductController extends ResourceController {
  constructor() {
    super()

    this.model = Product
  }

  /**
   * Hooks
   *
   * Are used to interact with the resource controller methods
   */

  // Should return the list to be displayed
  // async list(req, res) {}

  // Should return a unique register
  // async get(req, res) {}

  // Should insert a register
  // async insert(req, res) {}

  // Should update a register
  // async update(req, res) {}

  // Should delete a register
  // async destroy(req, res) {}
}

export default new ProductController()
