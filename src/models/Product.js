import { string, number, date } from '../modules/validations'

import Model from '../core/Model'

class Product extends Model {
  static table = 'products'

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

    protheus_cod: {
      type: 'string',
      label: 'Cód. Protheus',
      searchable: true,
      orderable: true,
      validations: {
        default: string('Cód. Protheus').nullable().unique(this, 'protheus_cod')
      }
    },

    ncm: {
      type: 'string',
      label: 'NCM',
      searchable: true,
      orderable: true,
      validations: {
        default: string()
      }
    },

    name: {
      type: 'string',
      label: 'Nome',
      searchable: true,
      orderable: true,
      validations: {
        insert: string().nullable().required().unique(this, 'name'),
        update: string().nullable().unique(this, 'name')
      }
    },

    quantity: {
      type: 'float',
      label: 'Quantidade',
      searchable: false,
      orderable: true,
      validations: {
        insert: number().min(0).required(),
        update: number().min(0)
      }
    },

    min_quantity: {
      type: 'float',
      label: 'Quantidade mínima',
      searchable: false,
      orderable: true,
      validations: {
        insert: number().min(0).required(),
        update: number().min(0)
      }
    },

    max_quantity: {
      type: 'float',
      label: 'Quantidade máxima',
      searchable: false,
      orderable: true,
      validations: {
        insert: number().min(0).required(),
        update: number().min(0)
      }
    },

    unity: {
      type: 'string',
      label: 'Unidade',
      searchable: true,
      orderable: true,
      validations: {
        insert: string().required(),
        update: string()
      }
    },

    last_price: {
      type: 'float',
      label: 'Último preço pago',
      orderable: true,
      searchable: false,
      validations: {
        insert: number().min(0),
        update: number().min(0)
      }
    },

    created_at: {
      type: 'date',
      label: 'Criado em',
      searchable: false,
      orderable: true,
      validations: {
        default: date()
      }
    },

    updated_at: {
      type: 'date',
      label: 'Atualizado em',
      orderable: true,
      searchable: false,
      validations: {
        default: date()
      }
    }
  }
}

export default Product
