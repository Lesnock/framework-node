import * as Yup from 'yup'

Yup.setLocale({
  mixed: {
    default: 'Dados inválidos',
    required: ({ path, label }) => `O campo ${label || path} é obrigatório`,
    oneOf: ({ path, label, values }) =>
      `O campo ${label || path} deve ser um dos seguintes valores: ${values}`,
    notOneOf: ({ path, label, values }) =>
      `O campo ${
        label || path
      } não pode ser um dos seguintes valores: ${values}`
  },
  string: {
    length: ({ path, label, length }) =>
      `O campo ${label || path} deve ter exatamente ${length} caracteres`,
    min: 'deve ter pelo menos ${min} caracteres',
    max: 'deve ter no máximo ${max} caracteres',
    email: 'tem o formato de e-mail inválido',
    url: 'deve ter um formato de URL válida',
    trim: 'não deve conter espaços no início ou no fim.',
    lowercase: 'deve estar em maiúsculo',
    uppercase: 'deve estar em minúsculo'
  },
  number: {
    min: 'deve ser no mínimo ${min}',
    max: 'deve ser no máximo ${max}',
    lessThan: 'deve ser menor que ${less}',
    moreThan: 'deve ser maior que ${more}',
    notEqual: 'não pode ser igual à ${notEqual}',
    positive: 'deve ser um número posítivo',
    negative: 'deve ser um número negativo',
    integer: 'deve ser um número inteiro'
  },
  date: {
    min: 'deve ser maior que a data ${min}',
    max: 'deve ser menor que a data ${max}'
  },
  array: {
    min: 'deve ter no mínimo ${min} itens',
    max: 'deve ter no máximo ${max} itens'
  }
})

export default Yup
