exports.up = function (knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments()
    table.string('protheus_cod').unique()
    table.string('ncm')
    table.string('name').unique()
    table.string('unity')
    table.float('last_price')
    table.float('quantity')
    table.float('min_quantity')
    table.float('max_quantity')
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('products')
}
