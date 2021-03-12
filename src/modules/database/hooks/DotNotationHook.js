import { resolveDotNotation } from '../../../helpers'

/**
 * Resolves all dot notations after select
 *
 * Example: { 'department.name': 'TI' } => { department: { name: 'TI' } }
 *
 * @param database
 */
export default function DotNotationHook(database) {
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
