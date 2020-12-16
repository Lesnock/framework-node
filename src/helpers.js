import { v4 } from 'uuid'

/**
 * Get controller action with bind to controller
 * @param {*} controller
 * @param {*} method
 */
export function action(controller, method) {
  return controller[method].bind(controller)
}

export function resolveDotNotation(dotNotationObj = {}) {
  /**
   * Comment Example
   * user = {
   *  id: 1,
   *  name: 'Caio',
   *  department.one.name: 'TI'
   * }
   *
   * Result:
   * user = {
   *  id: 1,
   *  name: 'Caio',
   *  department: {
   *    one: {
   *      name: 'TI',
   *    }
   *  }
   * }
   */

  const resolved = {}

  for (const prop in dotNotationObj) {
    const value = dotNotationObj[prop] // 'TI'

    // If prop has not point, just continue
    if (prop.indexOf('.') < 0) {
      resolved[prop] = value
      continue
    }

    const array = prop.split('.') // ['department', 'one', 'name']
    const first = array.shift() // ['department']
    const rest = array.join('.') // one.name

    if (!resolved[first]) {
      resolved[first] = {}
    }

    resolved[first][rest] = value // { department: { 'one.name': 'TI' } }

    resolved[first] = resolveDotNotation(resolved[first])
  }

  return resolved
}

/**
 * Generate UUID V4
 */
export function uuidv4() {
  return v4()
}

/**
 * Sort array by column
 * @param {*} array
 * @param {*} column
 */
export function sortArrayBy(array, column, order = 'asc') {
  const ordering = order === 'asc' ? 1 : -1

  return array.sort((a, b) => {
    if (a[column] < b[column]) {
      return -1 * ordering
    }

    if (a[column] > b[column]) {
      return 1 * ordering
    }

    return 0
  })
}
