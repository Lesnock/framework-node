class Reponse {
  /**
   * Defines if response is successfull
   */
  success = true

  /**
   * Defines the errors
   */
  errors = null

  /**
   * Define the form errors by key => value pairs
   */
  formErrors = {}

  constructor(isSuccess = true) {
    this.isSuccess = isSuccess
  }

  get() {
    return {
      success: this.success,
      errors: this.errors,
      formErrors: this.formErrors
    }
  }

  setSuccess(isSuccess) {
    this.success = isSuccess
  }

  getSuccess() {
    return this.success
  }

  setErrors(errors) {
    this.errors = errors
  }

  getErrors() {
    return this.errors
  }

  setFormError(name, message) {
    this.formErrors[name] = message
  }

  setFormErrors(formErrors) {
    this.formErrors = formErrors
  }

  getFormError(name) {
    return this.formErrors[name]
  }

  getFormErrors() {
    return this.formErrors
  }
}

export default Reponse
