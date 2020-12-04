import { isValid, format, parse } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

/**
 * Filters
 *
 * This function add filters to a query
 *
 * Available filters:
 * sort & order
 * search
 * field search
 * limit
 * page
 */

export function setFilters(query, filters, model) {
  const columnNames = Object.keys(model.columns)

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
      // Search for each column
      columnNames.forEach((column) => {
        if (!model.columns[column].searchable) {
          return
        }

        let search = filters.search

        const columnType = model.columns[column].type

        if (['integer', 'float'].includes(columnType)) {
          search = Number(filters.search) || 0
          return this.orWhere(`${model.table}.${column}`, search)
        }

        // Date
        if (['date'].includes(columnType)) {
          const date = new Date(search)

          parse(search, 'yyyy-MM-dd', new Date())

          if (isValid(date)) {
            return this.orWhereBetween(`${model.table}.${column}`, [
              parse(`${search} 00:00`, 'yyyy-MM-dd HH:mm', new Date()),
              parse(`${search} 23:59`, 'yyyy-MM-dd HH:mm', new Date())
            ])
          }

          return
        }

        return this.orWhere(`${model.table}.${column}`, 'ilike', `%${search}%`)
      })
    })
  }

  // ======== Field Search =========
  if (filters.fieldsearch) {
    console.log(filters.fieldsearch)
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

        // Number
        if (['integer', 'float'].includes(columnType)) {
          search = Number(search) || 0
          return this.where(`${model.table}.${field}`, search)
        }

        // Date
        if (['date'].includes(columnType)) {
          const date = new Date(search)

          parse(search, 'yyyy-MM-dd', new Date())

          if (isValid(date)) {
            return this.whereBetween(`${model.table}.${field}`, [
              parse(`${search} 00:00`, 'yyyy-MM-dd HH:mm', new Date()),
              parse(`${search} 23:59`, 'yyyy-MM-dd HH:mm', new Date())
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
