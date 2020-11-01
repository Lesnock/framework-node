import database from '../modules/database'
import { setFilters } from '../modules/filters'

class Model {
  static columns = {}
  static searchable = []
  static orderable = []
  static defaultLimit = 20

  static query() {
    return database(this.table)
  }

  /**
   * Get all results from a table
   * @param {Object} options
   */
  static async getAll({ filters } = {}) {
    let query = this.query()

    if (this.defaultAttributes) {
      query.select(this.defaultAttributes)
    }

    if (filters) {
      query = setFilters(query, filters, this)
    }

    return query
  }

  static async getTotal({ filters } = {}) {
    let query = this.query()

    if (filters) {
      // Not add a limit and offset
      filters.limit = undefined
      filters.page = undefined

      query = setFilters(query, filters, this)
    }

    query.count('id', { as: 'total' })

    query.first()

    const result = await query

    return result.total
  }

  static async find(id) {
    const query = this
      .query()
      .where('id', id)

    if (this.defaultAttributes) {
      query.select(this.defaultAttributes)
    }

    return query.first()
  }

  static async insert(data) {
    return this.query().insert(data)
  }
}

export default Model
