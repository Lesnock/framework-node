import bcrypt from 'bcrypt'
import User from '../models/User'
import Controller from '../core/Controller'

class UserController extends Controller {
  async index(req, res) {
    const { filters } = req

    const response = {}

    response.rows = await User.getAll({ filters })
    response.total = await User.getTotal()
    response.count = response.rows.length

    res.json(response)
  }

  async store(req, res) {
    const { name, username, password } = req.body

    const hash = await bcrypt.hash(password, 8)

    try {
      const userId = await User.insert({
        name,
        username,
        password: hash,
        outra: 123
      })

      const user = await User.find(userId)

      return res.send(user)
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async show(req, res) {
    const { id } = req.params

    const user = await User.find(id)

    if (!user) {
      return res.status(404).json({ error: 'Not found' })
    }

    return res.json(user)
  }

  async update(req, res) {
    const { id } = req.params

    const userExists = await User.find(id)

    if (!userExists) {
      return res.status(404).json({ error: 'Not found' })
    }

    const { name, username, password } = req.body

    const hash = await bcrypt.hash(password, 8)

    try {
      await User.update(id, {
        name,
        username,
        password: hash
      })

      const user = await User.find(id)

      return res.json(user)

    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    const user = await User.find(id)

    if (!user) {
      return res.status(404).json({ error: 'Not found' })
    }

    try {
      await User.delete(id)

      return res.send()
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export default new UserController()
