import knex from 'knex'
import knexFile from '../../../knexfile'

class Database {
  connection() {
    if (process.env.NODE_ENV === 'production') {
      return knex(knexFile.production)
    }

    return knex(knexFile.development)
  }
}

export default Database
