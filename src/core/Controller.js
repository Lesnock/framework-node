import Views from '../modules/views'
import Database from '../modules/database'

class Controller {
  get database() {
    const database = new Database()
    return database.connection()
  }

  get views() {
    const views = new Views()
    return views
  }
}

export default Controller
