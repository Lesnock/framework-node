import bcrypt from 'bcrypt'
import Auth from '../modules/auth'
import Controller from '../core/Controller'

class LoginController extends Controller {
  async login(req, res) {

    const { username, password } = req.body

    const user = await this.database('users')
      .where('username', username)
      .first()

    if (!user) {
      return res.status(401).json({ error: 'Incorrect authentication data' })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect authentication data' })
    }

    const auth = new Auth()
    const token = await auth.login(user.id)

    res.json({
      user: {
        name: user.name,
        username: user.username,
      },
      token,
    })
  }
}

export default new LoginController()
