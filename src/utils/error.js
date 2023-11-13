const getErrorMessage = (errors) => {
  if (errors?.length > 0) {
    return errors.join(', ') // join all errors
  }
  return ''
}

const mapErrorMessage = (errors = []) => {
  const resultErrors = {}
  for (const key in errors) {
    if (Object.hasOwnProperty.call(errors, key)) {
      const error = errors[key]
      resultErrors[key] = getErrorMessage(error)
    }
  }
  // console.log('resultErrors', resultErrors)
  return resultErrors
}

export {
  getErrorMessage,
  mapErrorMessage
}
