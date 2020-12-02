import { string, number, date } from '../modules/validations'

import Model from '../core/Model'

class Product extends Model {
  static table = 'products'

  static columns = {
    id: {
      type: 'integer',
      label: 'ID',
      validations: {
        default: number()
      }
    },

    name: {
      type: 'string',
      label: 'Nome',
      validations: {
        insert: string().unique(this, 'name'),
        update: string().unique(this, 'name')
      }
    },

    quantity: {
      type: 'float',
      label: 'Quantidade',
      validations: {
        insert: number().min(0).required(),
        update: number().min(0)
      }
    },

    min_quantity: {
      type: 'float',
      label: 'Quantidade mínima',
      validations: {
        insert: number().min(0),
        update: number().min(0)
      }
    },

    unity: {
      type: 'string',
      label: 'Unidade',
      validations: {
        insert: string().required(),
        update: string()
      }
    },

    last_price: {
      type: 'float',
      label: 'Último preço pago',
      validations: {
        insert: number().min(0).required(),
        update: number().min(0)
      }
    },

    created_at: {
      type: 'date',
      label: 'Criado em',
      validations: {
        default: date()
      }
    },

    updated_at: {
      type: 'date',
      label: 'Atualizado em',
      validations: {
        default: date()
      }
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
