import Controller from '../core/Controller'
import Phone from '../models/Phone'

class PhoneController extends Controller {
  async index(req, res) {
    const { filters } = req

    const response = {}

    response.rows = await Phone.findAll({ filters, include: ['users'] })

    res.json(response)
  }
}

export default new PhoneController()
