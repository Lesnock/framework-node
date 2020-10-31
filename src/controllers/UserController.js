import bcrypt from 'bcrypt'
import Controller from '../core/Controller'

class UserController extends Controller {
  async index(req, res) {

    const user = await this.database('users')
      .select(['id', 'name', 'username'])

    res.json(user)
  }

  async store(req, res) {
    const { name, username, password } = req.body

    const hash = await bcrypt.hash(password, 8)

    try {
      const user = await this.database('users').insert({
        name,
        username,
        password: hash,
      })

      return res.send()
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export default new UserController()
