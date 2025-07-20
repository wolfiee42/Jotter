import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import config from '../config'
const verifyUser = (token: string): JwtPayload => {
  return jwt.verify(token, config.secret_token as Secret) as JwtPayload
}

export default verifyUser
