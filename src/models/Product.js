import Model from '../core/Model'

class Product extends Model {
  static table = 'products'

  static columns = {
    id: {
      type: 'integer'
      // as: 'ID',
    },
    name: {
      type: 'string'
    },
    quantity: {
      type: 'float'
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
