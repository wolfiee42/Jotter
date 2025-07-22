import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Secret } from 'jsonwebtoken'
import API_Error from '../errors/apiError'
import config from '../config'
import { verifyToken } from '../utils/jwtTokenGenerator'
import { PermissionManager } from '../lib/pm/PermissionManager'

//Auth Guard
const Authentication =
  //  async (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.cookies?.accessToken as string

      if (!token) {
        return next(new API_Error(StatusCodes.UNAUTHORIZED, 'Please Log In.'))
      }
      // verify token
      const verifiedUser = verifyToken(token, config.secret_token as Secret)

      if (!verifiedUser) {
        return next(
          new API_Error(
            StatusCodes.UNAUTHORIZED,
            'Invalid Token. Please log in again',
          ),
        )
      }

      const pm = new PermissionManager({
        roles: verifiedUser.role as string[],
        permissions: verifiedUser.permissions,
      })

      // verified user
      req.user = verifiedUser
      req.pm = pm

      next()
    } catch (error) {
      console.error(error)
      return next(
        new API_Error(
          StatusCodes.UNAUTHORIZED,
          'Unauthorized access. Please check your authentication credentials.',
        ),
      )
    }
  }

export default Authentication
