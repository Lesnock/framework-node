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
}

export default Model
