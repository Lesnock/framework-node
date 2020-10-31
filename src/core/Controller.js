import Database from '../modules/database'

class Controller {
  get database() {
    const database = new Database()
    return database.connection()
  }
}

export default Controller
