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

/**
 * Filter nested array with path and search
 *
 * Example, if you want to filter an array where: departments.name equals to 'TI'
 *
 * Just call it: filterNestedArray(array, 'departments.name', 'TI')
 *
 * For inner arrays use the '[]' syntax:
 *
 * filterNestedArray(array, 'user.phones[].number', 101)
 * @param {*} array
 * @param {*} path
 * @param {*} search
 * @param {*} options exact and insensitve
 *
 * @returns The filtered array with just the items that corresponds to the search
 */
export function filterNestedArray(
  array,
  path = '',
  search,
  { exact = false, insensitive = true } = {}
) {
  return array.filter((row) =>
    checkInNested(row, path, search, { exact, insensitive })
  )
}

/**
 * Check if data has the search in the specific path
 * @param {Array | Object | Value} row
 * @param {*} path
 * @param {*} search
 * @param {*} options
 *
 * @returns {Boolean}
 */
export function checkInNested(
  row,
  path,
  search,
  { exact = false, insensitive = true }
) {
  if (row === undefined || row === null) {
    return false
  }

  const pathArray = path.split('.') // ['items[]', 'product', 'name']

  let hasFind = false

  // Array
  if (Array.isArray(row)) {
    let arrayHas = false

    row.forEach((item) => {
      if (checkInNested(item, path, search, { exact, insensitive })) {
        arrayHas = true
      }
    })

    hasFind = arrayHas
  }

  // Object
  else if (typeof row === 'object') {
    const nextPaths = pathArray.length > 1 ? pathArray.slice(1).join('.') : ''

    // Final object
    hasFind = checkInNested(
      row[pathArray[0].replace('[]', '')],
      nextPaths,
      search,
      { exact, insensitive }
    )
  }

  // Value
  else {
    // Path should not finish yet
    if (pathArray[0]) {
      hasFind = false
    } else {
      let searchTerm = insensitive
        ? String(search).toLowerCase()
        : String(search)

      let value = insensitive ? String(row).toLowerCase() : String(row)

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
