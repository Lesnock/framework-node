/**
 * Hook for run mutators in columns
 * *
 * @param database
 */
export default function addAsHook(database) {
  // ============== hasMany hook (Eager loading) =================== //
  database.addHook(
    'after',
    'select',
    '*',
    async (when, method, table, params) => {
      const model = params.query.model

      if (!model) return

      params.result.forEach((result) => {
        const columns = Object.keys(result)

        columns.forEach((column) => {
          if (!model.columns[column]) return

          if (model.columns[column].as) {
            const value = result[column]

            delete result[column]

            result[model.columns[column].as] = value
          }
        })
      })
    }
  )
}
