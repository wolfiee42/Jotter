import { JwtPayload } from 'jsonwebtoken'
import { User } from './type'
import { PermissionManager } from '../lib/pm/PermissionManager'

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null
      user?: User
      pm?: PermissionManager
    }
  }
}
