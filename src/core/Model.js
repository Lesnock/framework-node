import database from '../modules/database'
import { setFilters } from '../modules/filters'

/**
 * This model is based on Knex
 *
 * Almost all methods return a Knex instance
 * That can yet be customized to add more params to the query
 *
 */

class Model {
  /**
   * Table columns
   * Column name => props
   */
  static columns = {}

  /**
   * All columns that can be searched
   */
  static searchable = []

  /**
   * All columns that can be sorted
   */
  static orderable = []

  /**
   * Default limit to fetch
   */
  static defaultLimit = 20

  /**
   * Get knex instance with table
   */
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

  /**
   * Get total count with out without params
   * @param {Object} options
   */
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

  /**
   * Get a single record by id
   * @param {*} id
   */
  static async find(id) {
    const query = this
      .query()
      .where('id', id)

    if (this.defaultAttributes) {
      query.select(this.defaultAttributes)
    }

    return query.first()
  }

  /**
   * Find the first row that matches column = value
   * @param {String} column
   * @param {Any} value
   */
  static async findBy(column, value) {
    const query = this
      .query()
      .where(column, value)

    if (this.defaultAttributes) {
      query.select(this.defaultAttributes)
    }

    return query.first()
  }

  /**
   * Insert data
   * @param {*} data
   */
  static async insert(data) {
    const columns = Object.keys(data)

    // Remove all columns that does not exists in database
    columns.forEach(column => {
      if (!this.columns[column]) {
        delete data[column]
      }
    })

    return this.query().insert(data)
  }

  /**
   * Update data
   * @param {*} data
   */
  static async update(id, data) {
    const columns = Object.keys(data)

    // Remove all columns that does not exists in database
    columns.forEach(column => {
      if (!this.columns[column]) {
        delete data[column]
      }
    })

    return this
      .query()
      .where('id', id)
      .update(data)
  }
}

export default Model
