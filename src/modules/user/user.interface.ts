export type TUser = {
  _id?: string
  name: string
  username?: string
  email: string
  mobileNumber?: string
  password?: string
  isBanned: boolean
  role: string[]
  permissions: string[]
  isSetInfo: boolean
}

export const UserRole = {
  ADMIN: 'admin',
  PREMIUM_USER: 'premium_user',
  USER: 'user',
} as const

export type TForgetPassword = {
  email: string
  _id?: string
  otp: string
  isVerified: boolean
}
