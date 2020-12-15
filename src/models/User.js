import { string, number, date } from '../modules/validations'

import Model from '../core/Model'

class User extends Model {
  static table = 'users'

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
        insert: string().nullable().required(),
        update: string().nullable()
      }
    },

    email: {
      type: 'string',
      label: 'Email',
      searchable: true,
      orderable: true,
      validations: {
        insert: string().nullable().required().unique(this, 'email'),
        update: string().nullable().unique(this, 'email')
      }
    },

    username: {
      type: 'string',
      label: 'Nome de usuário',
      searchable: true,
      orderable: true,
      validations: {
        insert: string().nullable().required().unique(this, 'username'),
        update: string().nullable().unique(this, 'username')
      }
    },

    password: {
      type: 'string',
      label: 'Senha',
      searchable: true,
      orderable: true,
      hidden: true,
      validations: {
        insert: string().nullable().required(),
        update: string().nullable()
      }
    },

    department_id: {
      type: 'integer',
      searchable: false,
      orderable: true,
      validations: {
        default: number().required()
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

export default User
