import Controller from '../core/Controller'

class MainController extends Controller {
  async index(req, res) {

    const user = await this.database('users').where('id', 1).first()

    console.log(user)

    res.send(`<h1>Hello, ${user.name}!</h1>`)
  }
}

export default new MainController()
