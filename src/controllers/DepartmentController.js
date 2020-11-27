import Controller from '../core/Controller'
import Department from '../models/Department'

class DepartmentController extends Controller {
  async index(req, res) {
    const { filters } = req

    const departments = await Department.findAllWithCountAndTotal({ filters })

    res.json(departments)
  }

  async store(req, res) {
    const { name } = req.body

    try {
      if (await Department.exists({ name })) {
        return res.status(409).json({ error: 'Nome já está em uso' })
      }

      await Department.insert({ name })

      return res.send()
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' })
    }
  }

  async show(req, res) {
    const { id } = req.params

    const department = await Department.find(id)

    if (!department) {
      return res.status(404).json({ error: 'Not found' })
    }

    return res.json(department)
  }

  async update(req, res) {
    const { id } = req.params

    const { name } = req.body

    if (await Department.exists({ name }, id)) {
      return res.status(409).json({ error: 'Nome já está em uso' })
    }

    try {
      await Department.update(id, { name })

      const department = await Department.find(id)

      return res.json(department)
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    try {
      if (!Department.exists({ id })) {
        return res.status(404).json({ error: 'Não encontrado' })
      }

      await Department.delete(id)

      return res.send()
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' })
    }
  }
}

export default new DepartmentController()
