import Model from '../core/Model'

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
}

export default Phone
