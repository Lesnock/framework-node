import knex from 'knex'
import knexHooks from 'knex-hooks'
import knexFile from '../../../knexfile'
import { resolveDotNotation } from '../../helpers'

export function getDatabase() {
  const knexConfig = {
    production: knexFile.production,
    development: knexFile.development
  }

  const conn = knex(knexConfig[process.env.NODE_ENV])

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
  addCreatedAndUpdatedAtHook(database)
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
  // belongsTo and hasOne Hook
  database.addHook('before', 'select', '*', (when, method, table, params) => {
    const model = params.query.model
    const includes = params.query.includes

    if (!model || !includes) {
      return
    }

    includes.belongsTo.forEach((association) =>
      selectAndJoin(association, 'belongsTo')
    )
    includes.hasOne.forEach((association) =>
      selectAndJoin(association, 'hasOne')
    )

    function selectAndJoin(association, type) {
      const columns = association.model.columns

      for (const columnName in columns) {
        const column = columns[columnName]

        if (!column.hidden) {
          const as = `${association.as || association.table}.${
            column.as || columnName
          }`
          params.query.select(
            `${association.model.table}.${columnName} as ${as}`
          )
        }
      }

      params.query.leftJoin(
        association.model.table,
        `${model.table}.${
          type === 'belongsTo' ? association.fk : association.target
        }`,
        `${association.model.table}.${
          type === 'belongsTo' ? association.target : association.fk
        }`
      )
    }
  })

  // hasMany hook (Eager loading)
  database.addHook(
    'after',
    'select',
    '*',
    async (when, method, table, params) => {
      const model = params.query.model
      const includes = params.query.includes

      if (!model || !includes) {
        return
      }

      async function eagerLoad() {
        for (const association of includes.hasMany) {
          const results = [...params.result]

          const target =
            model.columns[association.target].as || association.target
          const fk = association.fk

          const fetchedIds = results.map((row) => {
            return row[target]
          })

          const foreign = await association.model
            .findAll()
            .whereIn(`${association.model.table}.${target}`, fetchedIds)

          for (const index in params.result) {
            params.result[index][
              association.as || association.model.table
            ] = foreign.filter(
              (row) => row[fk] === params.result[index][target]
            )
          }
        }
      }

      await eagerLoad()
    }
  )
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
    if (Array.isArray(params.result)) {
      for (const index in params.result) {
        const row = params.result[index]
        params.result[index] = resolveDotNotation(row)
      }
    } else {
      params.result = resolveDotNotation(params.result)
    }
  })
}

/**
 * Automatically fill created_at and updated_at before insert and update
 */
function addCreatedAndUpdatedAtHook(database) {
  database.addHook(
    'before',
    'insert',
    '*',
    async (when, method, table, params) => {
      const data = knexHooks.helpers.getInsertData(params.query)

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
      const data = knexHooks.helpers.getUpdateData(params.query)

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

export default getDatabase()
