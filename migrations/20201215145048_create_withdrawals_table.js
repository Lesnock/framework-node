exports.up = function (knex) {
  return knex.schema.createTable('withdrawals', (table) => {
    table.string('uuid')
    table.string('person')
    table.text('obs')
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('withdrawals')
}
