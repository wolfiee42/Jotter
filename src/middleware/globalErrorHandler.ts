/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { TErrorSource } from '../interface/error'
import { ZodError } from 'zod'
import handleZodError from '../errors/handleZodError'
import handleValidationError from '../errors/handleValidationError'
import handleCastError from '../errors/handleCastError'
import handleDuplicateError from '../errors/handleDuplicateError'
import AppError from '../errors/appError'
import config from '../config'

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500
  let message = 'ERROR: Something Went Wrong'

  let errorSource: TErrorSource = [
    {
      path: '',
      message: '',
    },
  ]

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSource = simplifiedError.errorSource
  } else if (err.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSource = simplifiedError.errorSource
  } else if (err.name === 'CastError') {
    const simplifiedError = handleCastError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSource = simplifiedError.errorSource
  } else if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSource = simplifiedError.errorSource
  } else if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
    errorSource = [
      {
        path: '',
        message: err.message,
      },
    ]
  } else if (err instanceof Error) {
    // statusCode = err.statusCode; //Property 'statusCode' does not exist on type 'Error'.ts(2339)
    message = err.message
    errorSource = [
      {
        path: '',
        message: err.message,
      },
    ]
  }

  // final return

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    // stack: config.node_environment === 'development' ? err?.stack : null,
    stack: config.node_environment !== 'production' ? err?.stack : undefined,
  })
}

export default globalErrorHandler
