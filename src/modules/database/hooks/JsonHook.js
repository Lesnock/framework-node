/**
 * Hook for resolve columns that are of the type 'json'
 * *
 * @param database
 */
export default function addIncludeHook(database) {
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
          if (model.columns[column].type === 'json') {
            result[column] = JSON.parse(result[column])
          }
        })
      })
    }
  )
}
