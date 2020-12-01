import { ValidationError } from 'yup'
import Product from '../models/Product'
import Controller from '../core/Controller'

class ProductController extends Controller {
  async index(req, res) {
    const { filters } = req

    const results = await Product.findAllWithCountAndTotal({ filters })

    res.json(results)
  }

  async store(req, res) {
    const { name } = req.body

    try {
      // if (await Product.exists({ name })) {
      //   return res.status(409).json({ error: 'Nome já está em uso' })
      // }

      const validated = await Product.validate(req.body, 'insert')

      await Product.insert(validated)

      return res.send()
    } catch (error) {
      if (ValidationError.isError(error)) {
        return res.status(500).json({ error: error.errors })
      }

      return res.status(500).json({ error: 'Erro interno' })
    }
  }

  async show(req, res) {
    const { id } = req.params

    const result = await Product.find(id)

    if (!result) {
      return res.status(404).json({ error: 'Not found' })
    }

    return res.json(result)
  }

  async update(req, res) {
    const { id } = req.params

    // 404
    if (!(await Product.exists({ id }))) {
      return res.status(404).json({ error: 'Não encontrado' })
    }

    const { name } = req.body

    if (await Product.exists({ name }, id)) {
      return res.status(409).json({ error: 'Nome já está em uso' })
    }

    try {
      await Product.update(id, req.body)

      const result = await Product.find(id)

      return res.json(result)
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    try {
      if (!Product.exists({ id })) {
        return res.status(404).json({ error: 'Não encontrado' })
      }

      await Product.delete(id)

      return res.send()
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' })
    }
  }
}

export default new ProductController()
