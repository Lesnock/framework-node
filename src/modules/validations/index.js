/**
 * This file should export all custom validations
 */

/**
 * Verify uniqueness of register field
 */
export function unique(model) {
  const test = async (value, context) => {
    const name = context.path
    const createError = context.createError

    const exists = await model.exists(
      { [name]: value },
      model.ignoreId || undefined
    )

    if (exists) {
      return createError({
        // path: name,
        message: `O campo ${model.columns[name].label} já está em uso`
      })
    }

    return true
  }

  return { test }
}
