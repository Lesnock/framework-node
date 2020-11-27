exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments()
    table.string('name')
    table.string('email').unique()
    table.string('username').unique()
    table.string('password')
    // table.integer('department_id')
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
