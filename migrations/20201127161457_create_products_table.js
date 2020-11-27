exports.up = function (knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments()
    table.string('name').unique()
    table.string('unity')
    table.float('last_price')
    table.float('quantity')
    table.float('min_quantity')
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('products')
}
