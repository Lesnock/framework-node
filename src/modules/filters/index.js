import { isValid, parse, format } from 'date-fns'

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
    if (model.virtuals.length) {
      query.searchAfter = filters.search
    }

    // Create grouped "or where"
    query = query.where(function () {
      // Search for each column
      columnNames.forEach((column) => {
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

          return this.orWhere(`${model.table}.${column}`, Number(search))
        }

        // Float
        if (columnType === 'float') {
          search = Number(filters.search) || 0
          return this.orWhere(`${model.table}.${column}`, search)
        }

        // Date
        if (columnType === 'date') {
          const date = new Date(search)

          if (isValid(date)) {
            return this.orWhereBetween(`${model.table}.${column}`, [
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

        return this.orWhere(`${model.table}.${column}`, 'ilike', `%${search}%`)
      })
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
