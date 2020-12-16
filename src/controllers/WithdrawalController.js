import Withdrawal from '../models/Withdrawal'
import WithdrawalItem from '../models/WithdrawalItem'
import ResourceController from '../core/ResourceController'

import { uuidv4 } from '../helpers'

class WithdrawalController extends ResourceController {
  constructor() {
    super()

    this.model = Withdrawal
  }

  // Hook - Should return the list to be displayed (used in index method)
  async list(req) {
    return await Withdrawal.findAllWithCountAndTotal({
      filters: req.filters,
      include: [WithdrawalItem]
    })
  }

  // Hook - Should return a unique register (used in show method)
  async get(req) {
    const { id } = req.params

    return await Withdrawal.find(id, {
      include: [WithdrawalItem]
    })
  }

  // Hook - Should insert a register (used in store method)
  async insert(req) {
    // Add Withdrawal
    const uuid = uuidv4()
    await Withdrawal.insert({ ...req.body, uuid })

    // Add items
    const { items } = req.body

    if (items) {
      for (const item of items) {
        const validated = WithdrawalItem.validate(item)
        await WithdrawalItem.insert({ ...validated, withdrawal_uuid: uuid })
      }
    }
  }

  // Hook - Should update a register (used in update method)
  async change(req) {
    const { id } = req.params

    this.model.ignoreId = id

    const validated = await this.model.validate(req.body, 'update')
    await this.model.update(id, validated)
  }

  // Hook - Should delete a register (used in delete method)
  // async destroy(req, res) {}
}

export default new WithdrawalController()
