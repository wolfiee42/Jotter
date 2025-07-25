import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notFoundAPI = (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'API endpoint not found!',
    error: '',
  })
}

export default notFoundAPI
