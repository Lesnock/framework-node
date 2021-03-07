const helpers = require('knex-hooks').helpers

/**
 * Hook for run mutators in columns
 * *
 * @param database
 */
export default function addMutatorHook(database) {
  database.addHook(
    'before',
    ['insert', 'update'],
    '*',
    async (when, method, table, params) => {
      const model = params.query.model

      if (!model) return

      const data =
        method === 'insert'
          ? helpers.getInsertData(params.query)
          : helpers.getUpdateData(params.query)

      const rows = Array.isArray(data) ? data : [data]

      rows.forEach((row) => {
        Object.keys(row).forEach((column) => {
          if (model.columns[column][method]) {
            const value = model.columns[column]
            row[column] = model.columns[column][method](value)
          }
        })
      })
    }
  )

  // ============== Mutators After select =================== //
  database.addHook(
    'after',
    'select',
    '*',
    async (when, method, table, params) => {
      const model = params.query.model

      if (!model) return

      function mutate(result) {
        if (!result) return

        const columns = Object.keys(result)

        columns.forEach((column) => {
          if (!model.columns[column]) return

          if (model.columns[column].get) {
            let value = result[column]

            result[column] = model.columns[column].get(value)
          }
        })
      }

      if (Array.isArray(params.result)) {
        params.result.forEach(mutate)
      } else {
        mutate(params.result)
      }
    }
  )
}
