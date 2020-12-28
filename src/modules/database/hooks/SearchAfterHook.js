import { filterNestedArray } from '../../../helpers'

export default function searchAfter(database) {
  database.addHook(
    'after',
    'select',
    '*',
    async (when, method, table, params) => {
      const model = params.query.model
      const includes = params.query.includes

      if (
        !model ||
        !includes ||
        params.query.searchAfter ||
        !params.result.length
      ) {
        return
      }

      params.query.model.virtuals.forEach((virtual) => {
        const filtered = filterNestedArray(params.result)
      })
    }
  )
}
