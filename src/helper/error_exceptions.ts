/*
 * Restful error exceptions
 * */
interface ErrorException {
  msg?: string
  status?: number
}

class RestfulException implements ErrorException {
  msg?: string
  status?: number
  constructor(msg: string, status: number) {
    this.msg = msg || 'Internal Server Error'
    this.status = status || 500
  }
}

class NotFoundRestException extends RestfulException {
  constructor(msg = '') {
    super(`${msg} Not Found`, 404)
  }
}

class BadRequestRestException extends RestfulException {
  constructor(msg = '') {
    super(`${msg || 'Invalid Request Body'}`, 400)
  }
}

export { NotFoundRestException, BadRequestRestException }
