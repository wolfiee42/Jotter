import mongoose from 'mongoose'
import { TErrorSource, TGenericErrorResponse } from '../interface/error'

const handleCastError = (err: mongoose.CastError): TGenericErrorResponse => {
  const errorSource: TErrorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ]

  const statusCode = 400

  return {
    statusCode,
    message: 'ERROR: Invalid ID',
    errorSource,
  }
}

export default handleCastError
