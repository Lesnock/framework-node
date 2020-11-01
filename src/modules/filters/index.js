export function setFilters(query, filters, model) {
  // ======== Sort and order =========
  if (filters.sort) {
    if (model.orderable.includes(filters.sort)) {
      query = query.orderBy(filters.sort, filters.order)
    }
  }

  // ======== Search =========
  if (filters.search) {
    // Create grouped "or where"
    query = query.where(function () {
      model.searchable.forEach(column => {
        const columnType = model.columns[column].type

        // Column is number, boolean or date
        if (['integer', 'float', 'boolean', 'date'].includes(columnType)) {
          this.orWhere(column, filters.search)
        }
        // Column is string
        else {
          console.log(column, 'like', `%${filters.search}%`)
          this.orWhere(column, 'like', `%${filters.search}%`)
        }
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