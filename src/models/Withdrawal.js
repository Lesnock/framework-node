import { string, number, date } from '../modules/validations'

import Model from '../core/Model'

class Withdrawal extends Model {
  static table = 'withdrawals'

  static columns = {
    id: {
      type: 'string',
      label: 'ID',
      searchable: true,
      orderable: true,
      validations: {
        default: number()
      }
    },

    uuid: {
      type: 'string',
      label: 'UUID',
      searchable: true,
      orderable: true,
      validations: {
        default: string()
      }
    },

    person: {
      type: 'string',
      label: 'Pessoa',
      searchable: true,
      orderable: true,
      validations: {
        insert: string().nullable().required(),
        update: string().nullable()
      }
    },

    obs: {
      type: 'string',
      label: 'Observação',
      searchable: true,
      orderable: true,
      validations: {
        default: string().nullable()
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

  static associations = {
    withdrawal_items: {
      type: 'hasMany',
      fk: 'withdrawal_uuid',
      target: 'uuid',
      as: 'items'
    }
  }
}

export default Withdrawal
