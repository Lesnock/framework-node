import { next } from 'sucrase/dist/parser/tokenizer'
import Auth from '../modules/auth'

export default function (req, res, next) {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(498).json({ error: 'Token was not provided' })
  }

  const [, token] = authorization.split(' ')

  const auth = new Auth()

  if (!auth.tokenIsValid(token)) {
    return res.status(498).json({ error: 'Invalid token' })
  }

  req.userId = auth.tokenData.id

  next()
}
