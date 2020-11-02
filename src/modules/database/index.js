import knex from 'knex'
import knexHooks from 'knex-hooks'
import knexFile from '../../../knexfile'
import { resolveDotNotation } from '../../helpers'

export function getDatabase() {
  if (process.env.NODE_ENV === 'production') {
    const conn = knex(knexFile.production)
  }

  const conn = knex(knexFile.development)

  knexHooks(conn)
  addHooks(conn)

  return conn
}

/**
 * Add all hooks
 * @param database
 */
function addHooks(database) {
  addIncludeHook(database)
  addDotNotationHook(database)
}

/**
 * Add hook for include create
 *
 * Example: const users = await User.getAll({ include: ['department'] })
 *
 * Associations are built in Model instance
 *
 * @param database
 */
function addIncludeHook(database) {
  database.addHook('before', 'select', '*', (when, method, table, params) => {
    const model = params.query.model
    const include = params.query.include

    if (!model || !include) {
      return
    }

    include.forEach(associationName => {
      if (!model.associations[associationName]) {
        throw new Error(`Association ${associationName} does not exists in model ${model.name}`)
      }

      const association = model.associations[associationName]

      if (association.type === 'belongsTo' || association.type === 'hasOne') {
        const columns = association.model.columns

        for (const columnName in columns) {
          const column = columns[columnName]

          if (!column.hidden) {
            const as = `${associationName}.${column.as || columnName}`
            params.query.select(`${association.model.table}.${columnName} as ${as}`)
          }
        }
      }

      params.query.leftJoin(
        association.model.table,
        `${model.table}.${association.column}`,
        `${association.model.table}.${association.target}`
      )
    })
  })
}

/**
 * Resolves all dot notations after select
 *
 * Example: { 'department.name': 'TI' } => { department: { name: 'TI' } }
 *
 * @param database
 */
function addDotNotationHook(database) {
  database.addHook('after', 'select', '*', (when, method, table, params) => {
    for (const index in params.result) {
      const row = params.result[index]
      params.result[index] = resolveDotNotation(row)
    }
  })
}

export default getDatabase()
