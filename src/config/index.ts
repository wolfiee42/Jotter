import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  node_environment: process.env.NODE_ENVIRONMENT,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  admin_email: process.env.ADMIN_EMAIL,
  secret_token: process.env.SECRET_TOKEN,
  secret_refresh_token: process.env.REFRESH_SECRET_TOKEN,
  expires_in_secret_token: process.env.EXPIRE_IN,
  expires_in_refresh_token: process.env.REFRESH_EXPIRE_IN,
  bcrypt_salt: process.env.BCRYPT_SALT,
  google_login_secret: process.env.GOOGLE_LOGIN_SECRET,
}
