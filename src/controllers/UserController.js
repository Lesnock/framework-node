import bcrypt from 'bcrypt'
import User from '../models/User'
import Controller from '../core/Controller'
// import Department from '../models/Department'

class UserController extends Controller {
  async index(req, res) {
    const { filters } = req

    const response = {}

    let users = await User.findAll({
      filters
      // include: [
      //   {
      //     model: Department,
      //     type: 'belongsTo',
      //     fk: 'department_id',
      //     as: 'department'
      //   },
      //   {
      //     model: Phone,
      //     type: 'hasMany',
      //     fk: 'user_id',
      //     as: 'phones'
      //   }
      // ]
    })
    // .orderBy('phones.id', 'asc')

    // let users = await User.findAll({ filters, include: [User, Department] })

    response.rows = users
    response.total = await User.getTotal({ filters })
    response.count = response.rows.length

    res.json(response)
  }

  async store(req, res) {
    const { name, email, username, password } = req.body

    const hash = await bcrypt.hash(password, 8)

    try {
      if (await User.exists({ username })) {
        return res.status(409).json({ error: 'Nome de usuário já está em uso' })
      }

      if (await User.exists({ email })) {
        return res.status(409).json({ error: 'Email já está em uso' })
      }

      await User.insert({
        name,
        email,
        username,
        password: hash
      })

      return res.send()
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Erro interno' })
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

    const { name, email, username, password } = req.body

    if (await User.exists({ username }, id)) {
      return res.status(409).json({ error: 'Nome de usuário já está em uso' })
    }

    if (await User.exists({ email }, id)) {
      return res.status(409).json({ error: 'Email já está em uso' })
    }

    const hash = await bcrypt.hash(password, 8)

    try {
      await User.update(id, {
        name,
        email,
        username,
        password: hash
      })

      const user = await User.find(id)

      return res.json(user)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Erro interno' })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    try {
      if (!User.exists({ id })) {
        return res.status(404).json({ error: 'Não encontrado' })
      }

      await User.delete(id)

      return res.send()
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' })
    }
  }
}

export default new UserController()
