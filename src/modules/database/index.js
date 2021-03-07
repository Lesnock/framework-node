import knex from 'knex'
import knexHooks from 'knex-hooks'
import knexFile from '../../../knexfile'

// Hooks
import JsonHook from './hooks/JsonHook'
import AliasHook from './hooks/AliasHook'
import IncludeHook from './hooks/IncludeHook'
import MutatorsHook from './hooks/MutatorsHook'
import TimezonesHook from './hooks/TimezonesHook'
import DotNotationHook from './hooks/DotNotationHook'
import SearchAfterHook from './hooks/SearchAfterHook'

/**
 * Get the database instance
 */
export function getDatabase() {
  const knexConfig = {
    production: knexFile.production,
    development: knexFile.development
  }

  const connection = knex(knexConfig[process.env.NODE_ENV])

  knexHooks(connection)
  addHooks(connection)

  return connection
}

/**
 * Add all hooks
 * @param database
 */
function addHooks(database) {
  JsonHook(database)
  IncludeHook(database)
  TimezonesHook(database)
  DotNotationHook(database)
  MutatorsHook(database)
  AliasHook(database)
}

export default getDatabase()
