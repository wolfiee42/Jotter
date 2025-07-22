import { model, Schema } from 'mongoose'
import { TForgetPassword, TUser, UserRole } from './user.interface'
import bcrypt from 'bcryptjs'
import config from '../../config'

const UserSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      required: false,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: false,
      default: '',
    },
    space: {
      type: Schema.Types.ObjectId,
      ref: 'Space',
    },
    favourite: {
      type: Schema.Types.ObjectId,
      ref: 'Favorite',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    role: {
      type: [String],
      default: [UserRole.USER],
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)
// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  if (this.password) {
    this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt))
  }
  next()
})

export const UserModel = model('User', UserSchema)

const OTPSchema = new Schema<TForgetPassword>(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export const OTPModel = model('OTP', OTPSchema)
