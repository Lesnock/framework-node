exports.up = function (knex) {
  return knex.schema.createTable('withdrawal_items', (table) => {
    table.increments()
    table.integer('withdrawal_id')
    table.integer('product_id')
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('withdrawal_items')
}
