import Model from '../core/Model'
import User from './User'

class Phone extends Model {
  static table = 'phones'

  static columns = {
    id: {
      type: 'integer',
      as: 'ID'
    },
    number: {
      type: 'integer',
    },
    user_id: {
      type: 'integer'
    }
  }

  static associations = {
    users: {
      type: 'hasMany',
      model: User,
      column: 'department_id',
      target: 'id'
    }
  }
}

export default Phone
