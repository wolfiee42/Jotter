import { ObjectId } from 'mongoose'

export type TUser = {
  _id?: string
  username: string
  email: string
  password?: string
  space: ObjectId
  favourite: ObjectId
  isBanned: boolean
  role: string[]
  permissions: string[]
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
