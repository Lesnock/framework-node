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
  // ============== belongsTo and hasOne Hook =================
  database.addHook('before', 'select', '*', (when, method, table, params) => {
    const model = params.query.model
    const includes = params.query.include

    if (!model || !includes) {
      return
    }

    includes
      .filter(include => include.type === 'belongsTo')
      .forEach(association => {
        selectAndJoin(association, 'belongsTo')
      })

    includes
      .filter(include => include.type === 'hasOne')
      .forEach(association => {
        selectAndJoin(association, 'hasOne')
      })

    function selectAndJoin(association, type) {
      const columns =
        association.attributes || Object.keys(association.model.columns)

      for (const columnName of columns) {
        const column = association.model.columns[columnName]

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
          type === 'hasOne' ? association.fk : association.target
        }`,
        `${association.model.table}.${
          type === 'hasOne' ? association.target : association.fk
        }`
      )

      params.query = association.query(params.query)
    }
  })

  // ============== hasMany hook (Eager loading) =================== //
  database.addHook(
    'after',
    'select',
    '*',
    async (when, method, table, params) => {
      const model = params.query.model
      const includes = params.query.include

      if (!model || !includes) {
        return
      }

      async function eagerLoad() {
        const hasManyIncludes = includes.filter(
          include => include.type === 'hasMany'
        )

        for (const association of hasManyIncludes) {
          const results = params.result

          const target =
            model.columns[association.target].as || association.target

          const fk = association.fk

          let fetchedIds = []

          if (Array.isArray(results)) {
            fetchedIds = results.map(row => {
              return row[target]
            })
          } else {
            fetchedIds.push(results[target])
          }

          const foreign = await association.model.findAll(
            {
              include: association.include,
              attributes: association.attributes,
              query: association.query
            },
            // Inject Query
            association.model
              .query()
              .whereIn(`${association.model.table}.${fk}`, fetchedIds)
          )

          if (Array.isArray(results)) {
            for (const index in params.result) {
              params.result[index][
                association.as || association.model.table
              ] = foreign.filter(
                row => row[fk] === params.result[index][target]
              )
            }
          } else {
            params.result[association.as || association.model.table] = foreign
          }
        }
      }

      await eagerLoad()
    }
  )
}
