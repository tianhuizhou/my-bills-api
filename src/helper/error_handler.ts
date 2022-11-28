/*
 * Error handler for endpoints
 */
import { Request, Response, NextFunction } from 'express'

interface ErrorException {
  msg?: string
  status?: number
}

const errorHandler = (error: ErrorException, req: Request, res: Response, _: NextFunction) => {
  console.error(error)
  res.status(error.status || 500).json({ error: error.msg, error_code: error.status })
}

module.exports = errorHandler
