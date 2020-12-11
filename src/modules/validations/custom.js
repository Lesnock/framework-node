import Yup from './locale'

/**
 * This file should export all custom validations
 */
Yup.addMethod(Yup.number, 'unique', unique)
Yup.addMethod(Yup.string, 'unique', unique)
Yup.addMethod(Yup.mixed, 'unique', unique)

/**
 * Verify uniqueness of register field
 */
export function unique(model) {
  return this.test('unique', async (value, context) => {
    const { path } = context
    const createError = context.createError

    if (value === null) {
      return true
    }

    const exists = await model.exists(
      { [path]: value },
      model.ignoreId || undefined
    )

    if (exists) {
      const label = model.columns[path].label

      return createError({
        path,
        message: `Já existe um registro com o mesmo ${label || path}`
      })
    }

    return true
  })
}

export default Yup
