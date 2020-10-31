import Controller from '../core/Controller'

class MainController extends Controller {
  async index(req, res) {

    const user = await this.database('users').where('id', 2).first()

    res.send(this.views.load('home', {
      name: user.name
    }))
  }
}

export default new MainController()
