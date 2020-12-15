import bcrypt from 'bcrypt'
import User from '../models/User'
import ResourceController from '../core/ResourceController'

class UserController extends ResourceController {
  constructor() {
    super()

    this.model = User
  }

  async me(req, res) {
    const user = await User.find(req.userId)

    if (!user.id) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    return res.json(user)
  }

  // Hook for insert
  async insert(req) {
    const { password } = req.body

    const hash = await bcrypt.hash(password, 8)

    await User.insert({ ...req.body, password: hash })
  }

  // Hook for update
  async change(req) {
    const { id } = req.params

    const { password } = req.body

    const hash = await bcrypt.hash(password, 8)

    await User.update(id, { ...req.body, password: hash })
  }
}

export default new UserController()
