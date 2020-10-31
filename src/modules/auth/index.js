import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

class Auth {
  tokenData = {}

  async login(userId) {
    const token = jwt.sign(
      { id: userId },
      authConfig.secretKey, { expiresIn: authConfig.expiresIn }
    )

    return token
  }

  tokenIsValid(token) {
    try {
      this.tokenData = jwt.verify(token, authConfig.secretKey)
      return true
    } catch (error) {
      return false
    }
  }
}

export default Auth
