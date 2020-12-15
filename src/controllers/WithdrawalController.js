import Withdrawal from '../models/Withdrawal'
import WithdrawalItem from '../models/WithdrawalItem'
import ResourceController from '../core/ResourceController'

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
          fk: 'withdrawal_id'
        }
      ]
    })
  }

  // Hook - Should return a unique register
  // async get(req, res) {}

  // Hook - Should insert a register
  // Hook - async insert(req, res) {}

  // Hook - Should update a register
  // async update(req, res) {}

  // Hook - Should delete a register
  // async destroy(req, res) {}
}

export default new WithdrawalController()
