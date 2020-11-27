import Model from '../core/Model'

class User extends Model {
  static table = 'users'

  static columns = {
    id: {
      type: 'integer'
      // as: 'ID',
    },
    name: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    password: {
      type: 'string',
      hidden: true
    },
    department_id: {
      type: 'integer'
    }
  }

  static searchable = ['id', 'name', 'username'] // Passar
  static orderable = ['id', 'name', 'username'] // Passar
}

export default User
