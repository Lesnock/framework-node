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
        }

        // Column is number, boolean or date
        if (['integer', 'float', 'boolean', 'date'].includes(columnType)) {
          console.log(`${model.table}.${column}`, search)
          this.orWhere(`${model.table}.${column}`, search)
        }
        // Column is string
        else {
          console.log(`${model.table}.${column}`, 'ilike', `%${search}%`)
          this.orWhere(`${model.table}.${column}`, 'ilike', `%${search}%`)
        }
      })
    })
  }

  // ======== Field Search =========
  // if (filters.fieldsearch) {
  //   const fields = Object.keys(filters.fieldsearch)

  //   fields.forEach((field) => {
  //     if (!model.columns[field].searchable) {
  //       return
  //     }

  //     const columnType = model.columns[field].type

  //     if (['integer', 'float'].includes(columnType)) {
  //       filters.search = Number(filters.search) || 0
  //     }
  //   })
  // }

  // ======== Page =========
  const limit = filters.limit ? Number(filters.limit) : model.defaultLimit
  const page = filters.page ? Number(filters.page) : 1

  query = query.limit(limit)
  query = query.offset((page - 1) * limit)

  return query
}
