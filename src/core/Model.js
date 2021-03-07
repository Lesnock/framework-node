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
   * Automatic includes
   */
  static autoIncludes = []

  /**
   * Virtual fields
   *
   * Used to search on objects after query is already finished
   */
  static virtuals = []

  /**
   * Get knex instance with table
   */
  static query() {
    const query = database(this.table)

    query.model = this

    return query
  }

  static mountAttributes(options) {
    let attributes = []
    let columns = options.attributes || Object.keys(this.columns)

    for (const columnName of columns) {
      const column = this.columns[columnName]

      if (column.hidden === true) {
        continue
      }

      const as = columnName

      attributes.push(`${this.table}.${columnName} as ${as}`)
    }

    return attributes
  }

  /**
   * Get all results from a table
   * @param {Object} options
   */
  static findAll(options = {}, initialQuery) {
    let query = initialQuery ? initialQuery : this.query().as('rows')

    query.select(this.mountAttributes(options))

    if (options.include) {
      this.addIncludeToQuery(query, options.include)
    }

    if (options.filters) {
      query = setFilters(query, options.filters, this)
    }

    return query
  }

  /**
   * Get all results from a table and attach count and total
   * @param {*} options
   */
  static async findAllWithCountAndTotal(options = {}, initialQuery) {
    const results = {}

    const query = this.findAll(options, initialQuery)

    results.rows = await query

    results.total = await this.getTotalByQuery(query, this.primaryKey)

    results.count = results.rows.length

    return results
  }

  static addIncludeToQuery(query, includes) {
    const prepareds = []

    includes.forEach((include) => {
      function prepareInclude(_include) {
        let model = null
        let innerInclude = undefined
        let includeAttributes = undefined

        if (typeof _include === 'object') {
          model = _include.model
          includeAttributes = _include.attributes

          if (_include.include && _include.include.length) {
            innerInclude = []

            _include.include.forEach((innerInc) => {
              innerInclude.push(prepareInclude.call(model, innerInc))
            })
          }
        } else {
          model = _include
        }

        const association = this.associations[model.table]

        if (!association) {
          throw new Error(
            `Association ${model.table} does not exists in ${model.name} model`
          )
        }

        const { type, fk, target, as } = association

        if (!type || !fk) {
          throw new Error('All includes should have at least: type and fk')
        }

        return {
          model,
          type,
          fk,
          target: target || 'id',
          as,
          include: innerInclude,
          attributes: includeAttributes
        }
      }

      prepareds.push(prepareInclude.call(this, include))
    })

    query.include = prepareds
  }

  static async getTotalByQuery(query, primaryKey = 'id') {
    query.clear('limit')
    query.clear('offset')

    const result = await database.count(primaryKey, { as: 'count' }).from(query)

    return Number(result[0].count)
  }

  /**
   * Get total count without params
   * @param {Object} options
   */
  static async getTotal(options = {}) {
    let query = this.query().as('sub')

    // query.select(this.primaryKey)
    query.select(this.mountAttributes(options))

    if (options.include) {
      this.addIncludeToQuery(query, options.include)
    }

    if (options.filters) {
      options.filters.limit = undefined
      options.filters.page = undefined

      query = setFilters(query, options.filters, this)
    }

    query
      .count(`${this.table}.${this.primaryKey}`)
      .groupBy(`${this.table}.${this.primaryKey}`)

    const result = await database.count('id').from(query)

    return Number(result[0].count)
  }

  /**
   * Get a single record by id
   * @param {*} id
   */
  static async find(primaryKey, options = {}) {
    const query = this.query()

    query.select(this.mountAttributes(options))

    query.where(this.primaryKey, primaryKey)

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

    const query = this.query()

    return query.insert(data)
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

    const query = this.query()

    query.model = this

    return query.where(this.primaryKey, primaryKey).update(data)
  }

  /**
   * Delete record
   */
  static async delete(primaryKey) {
    const query = this.query()

    return query.where(this.primaryKey, primaryKey).del()
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

  static async validate(data, validationName = 'default', options = {}) {
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
