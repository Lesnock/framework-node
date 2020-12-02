/**
 * Add hook for include create
 *
 * Example: const users = await User.getAll({ include: ['department'] })
 *
 * Associations are built in Model instance
 *
 * @param database
 */
export default function addIncludeHook(database) {
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
