import Model from '../core/Model'

class Department extends Model {
  static table = 'departments'

  static columns = {
    id: {
      type: 'integer',
    },
    name: {
      type: 'string',
    }
  }

  static associations = {
    users: {
      type: 'hasMany',
      // model: User,
      column: 'department_id',
      target: 'id'
    }
  }

  static searchable = ['id', 'name'] // Passar
  static orderable = ['id', 'name'] // Passar
}

export default Department
