import Auth from '../modules/auth'

export default function auth(req, res, next) {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const [, token] = authorization.split(' ')

  const auth = new Auth()

  if (!auth.tokenIsValid(token)) {
    return res.status(401).json({ error: 'Token inválido' })
  }

  req.userId = auth.tokenData.id

  next()
}
