import Controller from './Controller'
import { ValidationError } from 'yup'

/**
 * Resource Controller
 *
 * Should be extended from Controllers that have the Crud structure
 * Overwrite some of this methods to change the default behaviours
 *
 * --------------------
 *
 * Hooks
 *
 * The hooks are the methods that are used to change just the crud actions, keeping
 * the default [Request - Response] structures.
 * The hooks are used inside the others methods, and they are used to "inject" code to the
 * default resource methods.
 *
 * With hooks, you can modify the database actions, without having to write all the
 * Request and Response logic.
 *
 * Overwrite the methods list, get, insert, change and destroy to change just
 * the crud actions
 */
class ResourceController extends Controller {
  // Should return the list to be displayed
  async list(req) {
    const { filters } = req
    return await this.model.findAllWithCountAndTotal({ filters })
  }

  // Hook - Should return a unique register
  async get(req) {
    const { id } = req.params
    return await this.model.find(id)
  }

  // Hook -  Should insert a register
  async insert(req) {
    const validated = await this.model.validate(req.body, 'insert')
    return await this.model.insert(validated)
  }

  // Hook -  Should update a register
  async change(req) {
    const { id } = req.params

    this.model.ignoreId = id

    const validated = await this.model.validate(req.body, 'update')
    await this.model.update(id, validated)
  }

  // Hook -  Should delete a register
  async destroy(req) {
    const { id } = req.params
    await this.model.delete(id)
  }

  async index(req, res) {
    let results = []

    results = await this.list(req, res)

    res.json(results)
  }

  async store(req, res) {
    try {
      await this.insert(req, res)

      return res.send()
    } catch (error) {
      if (ValidationError.isError(error)) {
        return res.status(400).json({ error: error.errors })
      }

      return res.status(500).json({ error: 'Erro interno' })
    }
  }

  async show(req, res) {
    const { id } = req.params

    // 404
    if (!(await this.model.exists({ id }))) {
      return res.status(404).json({ error: 'Não encontrado' })
    }

    const result = await this.get(req, res)

    return res.json(result)
  }

  async update(req, res) {
    const { id } = req.params

    // 404
    if (!(await this.model.exists({ id }))) {
      return res.status(404).json({ error: 'Não encontrado' })
    }

    try {
      await this.change(req, res)

      const result = await this.model.find(id)

      return res.json(result)
    } catch (error) {
      if (ValidationError.isError(error)) {
        return res.status(400).json({ error: error.errors })
      }

      return res.status(500).json({ error: 'Erro interno' })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    try {
      if (!(await this.model.exists({ id }))) {
        return res.status(404).json({ error: 'Não encontrado' })
      }

      await this.destroy(req, res)

      return res.send()
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' })
    }
  }
}

export default ResourceController
