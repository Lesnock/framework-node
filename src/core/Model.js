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

  static associations = {}

  /**
   * Get knex instance with table
   */
  static query() {
    return database(this.table)
  }

  static mountAttributes() {
    let attributes = []

    for (const columnName in this.columns) {
      const column = this.columns[columnName]

      if (column.hidden === true) {
        continue
      }

      const as = column.as || columnName

      attributes.push(`${this.table}.${columnName} as ${as}`)
    }

    return attributes
  }

  /**
   * Get all results from a table
   * @param {Object} options
   */
  static findAll(options = {}) {
    let query = this.query()

    query.model = this

    query.select(this.mountAttributes(options))

    if (options.filters) {
      query = setFilters(query, options.filters, this)
    }

    if (options.include) {
      this.addIncludeToQuery(query, options.include)
    }

    return query
  }

  static addIncludeToQuery(query, include) {
    query.include = {
      belongsTo: [],
      hasOne: [],
      hasMany: [],
    }

    include.forEach(associationName => {
      const association = this.associations[associationName]

      if (!association) {
        if (!this.associations[associationName]) {
          throw new Error(`Association ${associationName} does not exists in model ${this.name}`)
        }
      }

      query.include[association.type].push(associationName)
    })
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

    query.count(`${this.table}.id`, { as: 'total' })

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
      query.select(this.defaultAttributes.map(attr => `${this.table}.${attr}`))
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

  /**
   * Delete record
   */
  static async delete(id) {
    return this
      .query()
      .where('id', id)
      .del()
  }
}

export default Model
