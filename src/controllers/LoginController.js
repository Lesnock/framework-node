import bcrypt from 'bcrypt'
import Auth from '../modules/auth'
import database from '../modules/database'
import Controller from '../core/Controller'

class LoginController extends Controller {
  key = 'username'

  async login(req, res) {
    const { password } = req.body

    const key = req.body[this.key]

    const user = await database('users').where(this.key, key).first()

    if (!user.id) {
      return res.status(401).json({ error: 'Dados incorretos' })
    }

    const isValid = await bcrypt.compare(String(password), user.password)

    if (!isValid) {
      return res.status(401).json({ error: 'Dados incorretos' })
    }

    const auth = new Auth()
    const token = await auth.login(user.id)

    res.json({
      user: {
        name: user.name,
        email: user.email,
        username: user.username
      },
      token
    })
  }
}

export default new LoginController()
