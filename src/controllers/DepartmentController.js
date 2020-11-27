import Controller from '../core/Controller'
import Department from '../models/Department'

class DepartmentController extends Controller {
  async index(req, res) {
    const { filters } = req

    const response = {}

    response.rows = await Department.findAll({
      filters,
      include: ['users']
    })

    res.json(response)
  }
}

export default new DepartmentController()
