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
    email: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    password: {
      type: 'string',
      hidden: true
    },
    created_at: {
      type: 'date'
    },
    updated_at: {
      type: 'date'
    },
    department_id: {
      type: 'integer'
    }
  }

  static searchable = ['id', 'name', 'username', 'email'] // Passar
  static orderable = ['id', 'name', 'username', 'email'] // Passar
}

export default User
