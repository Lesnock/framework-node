import Withdrawal from '../models/Withdrawal'
import WithdrawalItem from '../models/WithdrawalItem'
import ResourceController from '../core/ResourceController'

import Product from '../models/Product'
import { uuidv4, sortArrayBy } from '../helpers'

class WithdrawalController extends ResourceController {
  constructor() {
    super()

    this.model = Withdrawal
  }

  async find(req, res) {
    const rows = [
      {
        id: 1,
        name: 'Caio',
        department: {
          id: 1,
          name: 'TI'
        },
        phones: [
          {
            id: 1,
            number: 203
          },
          {
            id: 2,
            number: 201
          }
        ],
        happy: [
          {
            year: 2020,
            plus: [
              {
                phrase: 'God is good'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Danilo',
        department: {
          id: 1,
          name: 'TI'
        },
        phones: [
          {
            id: 2,
            number: 201
          },
          {
            id: 3,
            number: 200
          }
        ]
      },
      {
        id: 2,
        name: 'Andressa',
        department: {
          id: 2,
          name: 'Compras'
        },
        phones: [
          {
            id: 4,
            number: 108
          }
        ],
        happy: [
          {
            year: 2020,
            plus: [
              {
                phrase: 'I love God'
              }
            ]
          }
        ]
      }
    ]

    const path = 'happy[].plus[].phrase'
    const search = 'God'

    const findedRows = filterObjectArray(rows, path, search)

    function filterObjectArray(rows, path, search) {
      return rows.filter((row) => findInNested(row, path, search))
    }

    function findInNested(row, path, search) {
      if (row === undefined || row === null) {
        return false
      }

      const pathArray = path.split('.') // ['items[]', 'product', 'name']

      let hasFind = false

      // console.log(row, pathArray, pathArray[0])

      // Array
      if (Array.isArray(row)) {
        let arrayHas = false

        row.forEach((item) => {
          if (findInNested(item, path, search)) {
            arrayHas = true
          }
        })

        hasFind = arrayHas
      }

      // Object
      else if (typeof row === 'object') {
        const nextPaths =
          pathArray.length > 1 ? pathArray.slice(1).join('.') : ''

        // Final object
        hasFind = findInNested(
          row[pathArray[0].replace('[]', '')],
          nextPaths,
          search
        )
      }

      // Value
      else {
        console.log(row, pathArray)
        // Path should not finish yet
        if (pathArray[0]) {
          hasFind = false
        } else {
          const lowerCaseSearch = String(search).toLowerCase()

          const find = String(row).toLowerCase().search(lowerCaseSearch)

          if (find >= 0) {
            hasFind = true
          }
        }
      }

      return hasFind
    }

    res.send(findedRows)
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

    // Sort by ID
    results.rows = sortArrayBy(results.rows, 'id', 'desc')

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
