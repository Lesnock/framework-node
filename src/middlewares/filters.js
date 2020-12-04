/**
 * All filters that should be included in the req.filters
 */
var availableFilters = [
  'sort',
  'order',
  'page',
  'limit',
  'search',
  'fieldsearch'
]

/**
 * Separate all filters from query to req.filters prop
 */
export default function filters(req, res, next) {
  req.filters = {}

  const params = Object.keys(req.query)

  for (let i = 0; i < params.length; i++) {
    const param = params[i]

    if (availableFilters.includes(param)) {
      req.filters[param] = req.query[param].toLowerCase()
    }
  }

  if (req.filters.order) {
    if (!['asc', 'desc'].includes(req.filters.order.toLowerCase())) {
      req.filters.order = 'asc'
    }
  }

  return next()
}
