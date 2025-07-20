import { AnyZodObject } from 'zod'
import catchAsync from '../utils/catchAsync'
import { NextFunction, Request, Response } from 'express'

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // request will be validate here
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    })
    return next()
  })
}

export default validateRequest
