exports.up = function (knex) {
  return knex.schema.createTable('withdrawal_items', (table) => {
    table.increments()
    table.string('withdrawal_uuid')
    table.integer('product_id')
    table.integer('quantity')
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('withdrawal_items')
}
