import { isValid, parse, format } from 'date-fns'
import database from '../database'

/**
 * Filters
 *
 * This function add filters to a query
 *
 * Available filters:
 * sort & order
 * search
 * fieldsearch
 * limit
 * page
 */

export function setFilters(query, filters, model) {
  function createSearchWhere(model, includes) {
    const query = this

    const columnNames = Object.keys(model.columns)
    // Search for each column
    columnNames.forEach((column) => createColumnWhere(query, model, column))

    if (includes) {
      function addIncludeWhere(model, include) {
        const association = model.associations[include.model.table]

        console.log(association, model)

        const fieldHere =
          association.type === 'hasOne' ? association.fk : association.target

        const fieldThere =
          association.type === 'hasOne' ? association.target : association.fk

        // Verify each field of include if it has the search term
        this.orWhereExists(function () {
          // "this" is the subquery
          this.select(include.model.primaryKey || 'id')

          this.from(include.model.table)

          console.log(association.type, model.table, fieldHere, fieldThere)

          // Get just the register that it is beign joined
          this.where(
            `${model.table}.${fieldHere}`,
            database.raw(`${include.model.table}.${fieldThere}`)
          )

          // Add where for each column
          this.andWhere(function () {
            const columnNames = Object.keys(include.model.columns)

            // Search for each included columns
            columnNames.forEach((column) => {
              createColumnWhere(this, include.model, column)
            })
          })

          if (include.include) {
            include.include.forEach((inc) =>
              addIncludeWhere.call(this, include.model, inc)
            )
          }
        })
      }

      includes.forEach((include) => addIncludeWhere.call(query, model, include))
    }
  }

  /**
   * Create Where of Specific column
   * @param {*} query
   * @param {*} model
   * @param {*} column
   */
  function createColumnWhere(query, model, column) {
    if (!model.columns[column].searchable) {
      return
    }

    let search = filters.search

    const columnType = model.columns[column].type

    // Integer
    if (columnType === 'integer') {
      if (!Number.isInteger(Number(search)) && Number(search) % 1 !== 0) {
        return
      }

      return query.orWhere(`${model.table}.${column}`, Number(search))
    }

    // Float
    if (columnType === 'float') {
      search = Number(filters.search) || 0
      return query.orWhere(`${model.table}.${column}`, search)
    }

    // Date
    if (columnType === 'date') {
      const date = new Date(search)

      if (isValid(date)) {
        return query.orWhereBetween(`${model.table}.${column}`, [
          parse(
            `${format(date, 'yyyy-MM-dd')} 00:00`,
            'yyyy-MM-dd HH:mm',
            new Date()
          ),
          parse(
            `${format(date, 'yyyy-MM-dd')} 23:59`,
            'yyyy-MM-dd HH:mm',
            new Date()
          )
        ])
      }

      return
    }

    return query.orWhere(`${model.table}.${column}`, 'ilike', `%${search}%`)
  }

  // ======== Sort and order =========
  if (filters.sort) {
    if (model.columns[filters.sort]) {
      if (model.columns[filters.sort].orderable) {
        query = query.orderBy(`${model.table}.${filters.sort}`, filters.order)
      }
    }
  }

  // ======== Search =========
  if (filters.search) {
    // Create grouped "or where"
    query = query.where(function () {
      createSearchWhere.call(this, query.model, query.include)
    })
  }

  // ======== Field Search =========
  if (filters.fieldsearch) {
    if (typeof filters.fieldsearch === 'string') {
      filters.fieldsearch = JSON.parse(filters.fieldsearch)
    }

    const fields = Object.keys(filters.fieldsearch)

    query.where(function () {
      fields.forEach((field) => {
        if (!model.columns[field].searchable) {
          return
        }

        let search = filters.fieldsearch[field]

        const columnType = model.columns[field].type

        // Integer
        if (columnType === 'integer') {
          if (!Number.isInteger(search) && Number(search) % 1 !== 0) {
            return
          }

          return this.orWhere(`${model.table}.${field}`, Number(search))
        }

        // Float
        if (columnType === 'float') {
          search = Number(search) || 0
          return this.where(`${model.table}.${field}`, search)
        }

        // Date
        if (columnType === 'date') {
          const date = new Date(search)

          parse(search, 'yyyy-MM-dd', new Date())

          if (isValid(date)) {
            return this.whereBetween(`${model.table}.${field}`, [
              parse(
                `${format(date, 'yyyy-MM-dd')} 00:00`,
                'yyyy-MM-dd HH:mm',
                new Date()
              ),
              parse(
                `${format(date, 'yyyy-MM-dd')} 23:59`,
                'yyyy-MM-dd HH:mm',
                new Date()
              )
            ])
          }

          return
        }

        // Column is string
        return this.where(`${model.table}.${field}`, 'ilike', `%${search}%`)
      })
    })
  }

  // ======== Page =========
  const limit = filters.limit ? Number(filters.limit) : model.defaultLimit
  const page = filters.page ? Number(filters.page) : 1

  query = query.limit(limit)
  query = query.offset((page - 1) * limit)

  return query
}
