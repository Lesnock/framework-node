import Controller from '../core/Controller'

class MainController extends Controller {
  async index(req, res) {
    res.send('Inside main controller')
  }
}

export default new MainController()
