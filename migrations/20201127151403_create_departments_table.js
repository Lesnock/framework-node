exports.up = function (knex) {
  return knex.schema.createTable('departments', (table) => {
    table.increments()
    table.string('name').unique()
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('departments')
}
