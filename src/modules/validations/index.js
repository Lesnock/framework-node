import Yup from './custom'

export const string = () => {
  return Yup.string().typeError('O campo ${label} deve ser do tipo texto')
}

export const number = () => {
  return Yup.number().typeError('O campo ${label} deve ser um número')
}

export const mixed = () => {
  return Yup.mixed()
}

export const object = () => {
  return Yup.object().typeError('O campo ${label} deve ser do tipo objeto')
}

export const bool = () => {
  return Yup.bool().typeError(
    'O campo ${label} deve ser do tipo verdadeiro/falso'
  )
}

export const boolean = () => {
  return Yup.boolean().typeError(
    'O campo ${label} deve ser do tipo verdadeiro/falso'
  )
}

export const date = () => {
  return Yup.date().typeError('O campo ${label} deve ser do tipo data')
}

export const array = () => {
  return Yup.array().typeError('O campo ${label} deve ser do tipo array')
}

export default Yup
