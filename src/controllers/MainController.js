import Controller from '../core/Controller'

class MainController extends Controller {
  async index(req, res) {
    res.send('OK')
  }
}

export default new MainController()
