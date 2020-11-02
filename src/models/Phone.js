import Model from '../core/Model'

class Department extends Model {
  static table = 'departments'

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
}

export default Department
