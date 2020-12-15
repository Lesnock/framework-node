import ResourceController from '../core/ResourceController'
import Department from '../models/Department'

class DepartmentController extends ResourceController {
  constructor() {
    super()

    this.model = Department
  }
}

export default new DepartmentController()
