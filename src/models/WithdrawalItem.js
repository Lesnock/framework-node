import { string, number, date } from '../modules/validations'

import Model from '../core/Model'

class WithdrawalItem extends Model {
  static table = 'withdrawal_items'

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

    withdrawal_uuid: {
      type: 'integer',
      label: 'ID da entrega',
      searchable: true,
      orderable: true,
      validations: {
        default: string()
      }
    },

    product_id: {
      type: 'integer',
      label: 'ID do produto',
      searchable: true,
      orderable: true,
      validations: {
        default: number()
      }
    },

    created_at: {
      type: 'date',
      label: 'Criado em',
      searchable: false,
      orderable: true,
      hidden: true,
      validations: {
        default: date()
      }
    },

    updated_at: {
      type: 'date',
      label: 'Atualizado em',
      orderable: true,
      searchable: false,
      hidden: true,
      validations: {
        default: date()
      }
    }
  }
}

export default WithdrawalItem
