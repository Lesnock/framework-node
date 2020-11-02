import Model from '../core/Model'

class Department extends Model {
  static table = 'departments'

  static columns = {
    id: {
      type: 'integer',
      as: 'ID'
    },
    name: {
      type: 'string',
    }
  }
}

export default Department
