import { string, number } from 'yup'
import Model from '../core/Model'

class Product extends Model {
  static table = 'products'

  static columns = {
    id: {
      type: 'integer'
    },
    name: {
      label: 'Nome',
      type: 'string'
    },
    quantity: {
      type: 'float',
      label: 'Quantidade',
      validations: {
        insert: number().required('O campo quantidade é obrigatório'),
        update: number()
      }
    },
    min_quantity: {
      type: 'float'
    },
    unity: {
      type: 'string'
    },
    last_price: {
      type: 'float'
    },
    created_at: {
      type: 'date'
    },
    updated_at: {
      type: 'date'
    }
  }

  static searchable = ['id', 'name', 'unity']

  static orderable = [
    'id',
    'name',
    'quantity',
    'min_quantity',
    'unity',
    'last_price'
  ]
}

export default Product
