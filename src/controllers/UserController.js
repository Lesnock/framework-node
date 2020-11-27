import bcrypt from 'bcrypt'
import User from '../models/User'
import Controller from '../core/Controller'
import Department from '../models/Department'

class UserController extends Controller {
  async index(req, res) {
    const { filters } = req

    const users = await User.findAllWithCountAndTotal({
      filters,
      include: [
        {
          model: Department,
          type: 'belongsTo',
          fk: 'department_id',
          as: 'department'
        }
      ]
    })

    res.json(users)
  }

  async store(req, res) {
    const { name, email, username, password, department_id } = req.body

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
        password: hash,
        department_id
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

    // 404
    if (!(await User.exists({ id }))) {
      return res.status(404).json({ error: 'Não encontrado' })
    }

    const { name, email, username, password, department_id } = req.body

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
        password: hash,
        department_id
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
