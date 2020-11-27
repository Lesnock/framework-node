import Model from '../core/Model'

class Department extends Model {
  static table = 'departments'

  static columns = {
    id: {
      type: 'integer'
    },
    name: {
      type: 'string'
    }
  }

  static searchable = ['id', 'name']
  static orderable = ['id', 'name']
}

export default Department
