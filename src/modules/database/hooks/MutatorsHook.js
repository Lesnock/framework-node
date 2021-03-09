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

      rows.forEach(row => {
        Object.keys(model.columns).forEach(column => {
          if (
            model.columns[column].mutators &&
            model.columns[column].mutators[method]
          ) {
            const value = row[column]
            row[column] = model.columns[column].mutators[method](value, {
              ...row
            })
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

      async function mutate(result) {
        if (!result) return

        for (const column of Object.keys(model.columns)) {
          if (
            model.columns[column].hidden !== true &&
            model.columns[column].mutators &&
            model.columns[column].mutators.get
          ) {
            let value = result[column]

            result[column] = await model.columns[column].mutators.get(
              value,
              result
            )
          }
        }
      }

      if (Array.isArray(params.result)) {
        for (const result of params.result) {
          await mutate(result)
        }
      } else {
        await mutate(params.result)
      }
    }
  )
}
