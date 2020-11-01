import Model from '../core/Model'

class User extends Model {
  static table = 'users'

  static columns = {
    id: { type: 'integer' },
    name: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
  }

  static defaultAttributes = ['id', 'name', 'username']
  static searchable = ['id', 'name', 'username']
  static orderable = ['id', 'name', 'username']
}

export default User
