import { query } from 'express'
import database from '../modules/database'
import { setFilters } from '../modules/filters'

class Model {
  static columns = {}
  static searchable = []
  static orderable = []
  static defaultLimit = 20

  static getAllWithFilters(filters) {
    let query = database(this.table)

    if (this.defaultAttributes) {
      query.select(this.defaultAttributes)
    }

    query = setFilters(query, filters, this)

    return query
  }

  static async getAll({ filters } = {}) {
    let query = database(this.table)

    if (this.defaultAttributes) {
      query.select(this.defaultAttributes)
    }

    if (filters) {
      query = setFilters(query, filters, this)
    }

    return query
  }

  static async getTotal({ filters } = {}) {
    let query = database(this.table)

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
}

export default Model
