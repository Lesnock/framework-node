import Withdrawal from '../models/Withdrawal'
import WithdrawalItem from '../models/WithdrawalItem'
import ResourceController from '../core/ResourceController'

import Product from '../models/Product'
import { uuidv4 } from '../helpers'

class WithdrawalController extends ResourceController {
  constructor() {
    super()

    this.model = Withdrawal
  }

  /**
   * Hook - Should return the list to be displayed (used in index method)
   */
  async list(req) {
    const results = await Withdrawal.findAllWithCountAndTotal({
      filters: req.filters,
      include: [
        {
          model: WithdrawalItem,
          include: [
            {
              model: Product,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    })

    return results
  }

  /**
   * Hook - Should return a unique register (used in show method)
   */
  async get(req) {
    const { id } = req.params

    return await Withdrawal.find(id, {
      attributes: ['id', 'obs', 'uuid'],
      include: [
        {
          model: WithdrawalItem,
          include: [
            {
              model: Product,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    })
  }

  /**
   * Hook - Should insert a register (used in store method)
   */
  async insert(req) {
    // Add Withdrawal
    const uuid = uuidv4()
    const validated = await Withdrawal.validate({ ...req.body, uuid }, 'insert')
    await Withdrawal.insert(validated)

    // Add items
    const { items } = req.body

    if (items) {
      for (const item of items) {
        const validated = await WithdrawalItem.validate({
          ...item,
          withdrawal_uuid: uuid
        })

        await WithdrawalItem.insert(validated)
      }
    }
  }

  /**
   * Hook - Should update a register (used in update method)
   */
  async change(req) {
    const { id } = req.params

    const withdrawal = await Withdrawal.find(id, {
      include: [WithdrawalItem]
    })

    // Delete all items
    if (withdrawal.items.length) {
      const ids = withdrawal.items.map(({ id }) => id)
      await WithdrawalItem.query().whereIn('id', ids).delete()
    }

    const { items } = req.body

    // Add items again
    for (const item in items) {
      const validated = await WithdrawalItem.validate(
        {
          ...item,
          withdrawal_uuid: withdrawal.uuid
        },
        'insert'
      )

      await WithdrawalItem.insert(validated)
    }

    // Update withdrawal
    this.model.ignoreId = id

    const validated = await this.model.validate(req.body, 'update')
    await this.model.update(id, validated)
  }

  /**
   * Hook - Should delete a register (used in delete method)
   */
  async destroy(req) {
    const { id } = req.params

    const withdrawal = await Withdrawal.find(id, {
      include: [WithdrawalItem]
    })

    // Delete all items
    if (withdrawal.items.length) {
      const ids = withdrawal.items.map(({ id }) => id)
      await WithdrawalItem.query().whereIn('id', ids).delete()
    }

    await Withdrawal.delete(id)
  }
}

export default new WithdrawalController()
