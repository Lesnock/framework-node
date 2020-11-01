import knex from 'knex'
import knexFile from '../../../knexfile'

export function getDatabase() {
  if (process.env.NODE_ENV === 'production') {
    return knex(knexFile.production)
  }

  return knex(knexFile.development)
}

export default getDatabase()
