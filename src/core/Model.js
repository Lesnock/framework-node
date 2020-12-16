import { object } from 'yup'

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
   * Define all associations
   */
  static associations = {}

  /**
   * Define if model should be validated
   */
  static withValidation = true

  /**
   * Validation errors
   */
  static validationErrors = []

  /**
   * Ignore ID - Used to ignore an register when updating
   */
  static ignoreId = null

  /**
   * Primary key
   */
  static primaryKey = 'id'

  /**
   * Associations
   */
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

  /**
   * Get all results from a table and attach count and total
   * @param {*} options
   */
  static async findAllWithCountAndTotal(options = {}) {
    const results = {}

    results.rows = await this.findAll(options)

    results.total = await this.getTotal(options.filters)
    results.count = results.rows.length

    return results
  }

  static addIncludeToQuery(query, include) {
    query.includes = {
      belongsTo: [],
      hasOne: [],
      hasMany: []
    }

    include.forEach((includeModel) => {
      const association = this.associations[includeModel.table]

      if (!association) {
        throw new Error(
          `Association ${includeModel.table} does not exists in ${this.name} model`
        )
      }

      const { type, fk, target, as } = association

      if (!type || !fk) {
        throw new Error('All includes should have at least: type and fk')
      }

      // All this includes will be resolved in the Knex Hooks (modules/database)
      query.includes[type].push({ model: includeModel, fk, target, as })
    })
  }

  /**
   * Get total count with out without params
   * @param {Object} options
   */
  static async getTotal(filters = {}) {
    let query = this.query()

    query.model = this

    query.select(this.primaryKey)

    if (filters) {
      filters.limit = undefined
      filters.page = undefined

      query = setFilters(query, filters, this)
    }

    const result = await query

    return result.length
  }

  /**
   * Get a single record by id
   * @param {*} id
   */
  static async find(primaryKey, options = {}) {
    const query = this.query()

    query.model = this

    query.select(this.mountAttributes()).where(this.primaryKey, primaryKey)

    query.select(this.mountAttributes())

    if (options.include) {
      this.addIncludeToQuery(query, options.include)
    }

    return query.first()
  }

  /**
   * Find the first row that matches column = value
   * @param {String} column
   * @param {Any} value
   */
  static async findBy(column, value) {
    const query = this.query().where(column, value)

    query.model = this

    query.select(this.mountAttributes())

    return query.first()
  }

  /**
   * Insert data
   * @param {*} data
   */
  static async insert(data) {
    const columns = Object.keys(data)

    // Remove all columns that does not exists in database
    columns.forEach((column) => {
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
  static async update(primaryKey, data) {
    const columns = Object.keys(data)

    // Remove all columns that does not exists in database
    columns.forEach((column) => {
      if (!this.columns[column]) {
        delete data[column]
      }
    })

    return this.query().where(this.primaryKey, primaryKey).update(data)
  }

  /**
   * Delete record
   */
  static async delete(primaryKey) {
    return this.query().where(this.primaryKey, primaryKey).del()
  }

  /**
   * Verify if a register exists in database
   */
  static async exists(where, ignoreId = null) {
    const query = this.query()
    query.where(where)

    if (ignoreId) {
      query.whereNot(this.primaryKey, ignoreId)
    }

    const exists = await query

    return exists.length > 0
  }

  static withoutValidate() {
    this.withValidation = false
    return this
  }

  static async validate(data, validationName = 'all', options = {}) {
    const validations = {}

    const columns = Object.keys(this.columns)

    columns.forEach((columnName) => {
      const column = this.columns[columnName]

      if (column.validations) {
        const validation =
          column.validations[validationName] || column.validations['default']

        validations[columnName] = validation.label(column.label || columnName)
      }
    })

    const schema = object(validations)

    return schema.validate(data, options)
  }
}

export default Model
