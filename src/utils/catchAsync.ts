import { NextFunction, Request, RequestHandler, Response } from 'express'

// a global func for try-catch. using this func, i don't have to write try-Catch over and over again.

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(err => next(err))
  }
}

export default catchAsync
