class API_Error extends Error {
  public statusCode: number
  constructor(statusCode: number, message: string | undefined, stack = '') {
    super(message)

    // assign status code
    this.statusCode = statusCode

    // check if stack is available
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default API_Error
