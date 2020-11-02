import Phone from './Phone'
import Model from '../core/Model'
import Department from './Department'

class User extends Model {
  static table = 'users'

  static columns = {
    id: {
      type: 'integer',
      as: 'ID',
    },
    name: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
      hidden: true,
    },
    department_id: {
      type: 'integer',
    },
  }

  static associations = {
    department: {
      type: 'belongsTo',
      model: Department,
      column: 'department_id',
      target: 'id'
    },

    phones: {
      type: 'hasMany',
      model: Phone,
      column: 'user_id',
      target: 'id'
    }
  }

  static searchable = ['id', 'name', 'username'] // Passar
  static orderable = ['id', 'name', 'username'] // Passar
}

export default User
