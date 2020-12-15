import { string, number } from '../modules/validations'

import Model from '../core/Model'

class Department extends Model {
  static table = 'departments'

  static columns = {
    id: {
      type: 'integer',
      label: 'ID',
      searchable: true,
      orderable: true,
      validations: {
        default: number()
      }
    },

    name: {
      type: 'string',
      label: 'Nome',
      searchable: true,
      orderable: true,
      validations: {
        default: string().nullable().required().unique(this, 'name')
      }
    }
  }
}

export default Department
