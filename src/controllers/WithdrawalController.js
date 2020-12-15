import Withdrawal from '../models/Withdrawal'
import WithdrawalItem from '../models/WithdrawalItem'
import ResourceController from '../core/ResourceController'

import { uuidv4 } from '../helpers'

class WithdrawalController extends ResourceController {
  constructor() {
    super()

    this.model = Withdrawal
  }

  // Hook - Should return the list to be displayed
  async list(req) {
    return await Withdrawal.findAllWithCountAndTotal({
      filters: req.filters,
      include: [
        {
          model: WithdrawalItem,
          type: 'hasMany',
          fk: 'withdrawal_uuid',
          target: 'uuid'
        }
      ]
    })
  }

  // Hook - Should return a unique register
  // async get(req, res) {}

  // Hook - Should insert a register
  async insert(req) {
    // Add Withdrawal
    const uuid = uuidv4()
    await Withdrawal.insert({ ...req.body, uuid })

    // Add items
    const { items } = req.body

    if (items) {
      for (const item of items) {
        await WithdrawalItem.insert({ ...item, withdrawal_uuid: uuid })
      }
    }
  }

  // Hook - Should update a register
  // async update(req, res) {}

  // Hook - Should delete a register
  // async destroy(req, res) {}
}

export default new WithdrawalController()
