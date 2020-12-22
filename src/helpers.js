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

export function filterNestedArray(array, path = '', search, options) {
  return array.filter((row) => findInNested(row, path, search, options))
}

export function findInNested(row, path, search, options = {}) {
  console.log('options', options)
  if (row === undefined || row === null) {
    return false
  }

  const pathArray = path.split('.') // ['items[]', 'product', 'name']

  let hasFind = false

  // Array
  if (Array.isArray(row)) {
    let arrayHas = false

    row.forEach((item) => {
      if (findInNested(item, path, search)) {
        arrayHas = true
      }
    })

    hasFind = arrayHas
  }

  // Object
  else if (typeof row === 'object') {
    const nextPaths = pathArray.length > 1 ? pathArray.slice(1).join('.') : ''

    // Final object
    hasFind = findInNested(
      row[pathArray[0].replace('[]', '')],
      nextPaths,
      search
    )
  }

  // Value
  else {
    const insensitive = options.insensitive || true
    const exact = options.exact || false

    // Path should not finish yet
    if (pathArray[0]) {
      hasFind = false
    } else {
      let searchTerm = insensitive
        ? String(search).toLowerCase()
        : String(search)

      let value = insensitive ? String(row).toLowerCase() : String(row)

      console.log(exact)

      if (exact) {
        hasFind = value === searchTerm
      } else {
        const find = value.search(searchTerm)

        if (find >= 0) {
          hasFind = true
        }
      }
    }
  }

  return hasFind
}
