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
  // belongsTo and hasOne Hook
  database.addHook('before', 'select', '*', (when, method, table, params) => {
    const model = params.query.model
    const include = params.query.include

    if (!model || !include) {
      return
    }

    include.belongsTo.forEach(selectAndJoin)
    include.hasOne.forEach(selectAndJoin)

    function selectAndJoin(associationName) {
      const association = model.associations[associationName]

      const columns = association.model.columns

      for (const columnName in columns) {
        const column = columns[columnName]

        if (!column.hidden) {
          const as = `${associationName}.${column.as || columnName}`
          params.query.select(`${association.model.table}.${columnName} as ${as}`)
        }
      }

      params.query.leftJoin(
        association.model.table,
        `${model.table}.${association.column}`,
        `${association.model.table}.${association.target}`
      )
    }
  })

  // hasMany hook (Eager loading)
  database.addHook('after', 'select', '*', (when, method, table, params) => {
    const model = params.query.model
    const include = params.query.include

    // console.log(when, method, table)

    if (!model || !include) {
      return
    }

    for (const associationName of include.hasMany) {
      eagerLoadInclude(associationName)
    }

    async function eagerLoadInclude(associationName) {
      const association = model.associations[associationName]

      const results = [...params.result]

      const target = model.columns[association.target].as || association.target
      const column = association.column

      const fetchedIds = results.map(row => {
        return row[target]
      })

      const foreign = await association.model
        .findAll()
        .whereIn(`${association.model.table}.${column}`, fetchedIds)

      for (const index in params.result) {
        params.result[index][associationName] = foreign.filter(row => row[column] === params.result[index][target])
      }
    }
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
