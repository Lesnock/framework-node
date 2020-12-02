import { helpers } from 'knex-hooks'

/**
 * Automatically fill created_at and updated_at before insert and update
 */
export default function TimezonesHook(database) {
  database.addHook(
    'before',
    'insert',
    '*',
    async (when, method, table, params) => {
      const data = helpers.getInsertData(params.query)

      const rows = Array.isArray(data) ? data : [data]

      const columns = await database(table).columnInfo()

      if ('created_at' in columns) {
        rows.forEach((row) => {
          row.created_at = new Date()
        })
      }
    }
  )

  database.addHook(
    'before',
    'update',
    '*',
    async (when, method, table, params) => {
      const data = helpers.getUpdateData(params.query)

      const rows = Array.isArray(data) ? data : [data]

      const columns = await database(table).columnInfo()

      if ('updated_at' in columns) {
        rows.forEach((row) => {
          row.updated_at = new Date()
        })
      }
    }
  )
}
