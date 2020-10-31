import bcrypt from 'bcrypt'
import Controller from '../core/Controller'

class UserController extends Controller {
  async index(req, res) {
    const users = await this.database('users')
      .select(['id', 'name', 'username'])

    // const users = database.getAllWithFilters('users', req.filters)

    res.json(users)
  }

  async store(req, res) {
    const { name, username, password } = req.body

    const hash = await bcrypt.hash(password, 8)

    try {
      await this.database('users').insert({
        name,
        username,
        password: hash,
      })

      return res.send()
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async show(req, res) {
    const { id } = req.params

    const user = await this.database('users')
      .select(['id', 'name', 'username'])
      .where('id', id)
      .first()

    if (!user) {
      return res.status(404).json({ error: 'Not found' })
    }

    return res.json(user)
  }
}

export default new UserController()
