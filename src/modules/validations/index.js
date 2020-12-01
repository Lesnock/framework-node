import Yup from './custom'

export default Yup

export const string = (label) => {
  return Yup.string().label(label)
}

export const number = (label) => {
  return Yup.number()
    .label(label)
    .typeError(`O campo ${label} deve ser um número`)
}

export const mixed = (label) => {
  return Yup.mixed().label(label)
}

export const object = (label) => {
  return Yup.object().label(label)
}

export const bool = (label) => {
  return Yup.bool()
    .label(label)
    .typeError(`O campo ${label} deve ser do tipo verdadeiro/falso`)
}

export const boolean = (label) => {
  return Yup.boolean()
    .label(label)
    .typeError(`O campo ${label} deve ser do tipo verdadeiro/falso`)
}

export const date = (label) => {
  return Yup.date()
    .label(label)
    .typeError(`O campo ${label} deve ser do tipo data`)
}

export const array = (label) => {
  return Yup.array()
    .label(label)
    .typeError(`O campo ${label} deve ser do tipo array`)
}
