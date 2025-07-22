import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { OTPModel, UserModel } from './user.model'
import sendResponse from '../../utils/sendResponse'
import { UserService } from './user.service'
import AppError from '../../errors/appError'
import { checkUser, isUsernameAvailable } from '../../utils/utils'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { sendEmail } from '../../utils/sendEmail'
import { SpaceModel } from '../space/space.model'
import { FavoriteModel } from '../favorite/favorite.model'

const userOnboardingByEmailPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email, username } = req.body
    const payload = req.body

    const session = await mongoose.startSession()
    let user, spaceCreation, favouriteCreation, tokens
    try {
      session.startTransaction()

      const existingUser = await UserModel.findOne({ email }).session(session)
      if (existingUser) {
        throw new AppError(409, 'Email already exists')
      }

      await isUsernameAvailable(username)

      user = await UserModel.create([payload], { session })
      user = user[0]
      if (!user) {
        throw new AppError(500, 'Failed to create user')
      }

      spaceCreation = await SpaceModel.create([{ user: user._id }], { session })
      spaceCreation = spaceCreation[0]
      if (!spaceCreation) {
        throw new AppError(500, 'Failed to create user space')
      }

      favouriteCreation = await FavoriteModel.create([{ user: user._id }], {
        session,
      })
      favouriteCreation = favouriteCreation[0]
      if (!favouriteCreation) {
        throw new AppError(500, 'Failed to create user favourite')
      }

      user.space = spaceCreation._id
      user.favourite = favouriteCreation._id
      await user.save({ session })

      // Create tokens
      tokens = UserService.createTokenHandler({
        id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      })
      if (!tokens) {
        throw new AppError(500, 'Token creation failed')
      }

      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
    }
    session.endSession()

    res.cookie('accessToken', tokens.accessToken)
    res.cookie('refreshToken', tokens.refreshToken)

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Registration successful',
      data: { user, spaceCreation },
    })
  },
)

const loginWithEmailPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email }).select('+password')

    if (!user) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'User not found',
      })
    }

    if (user.isBanned) {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: 'User is banned',
      })
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string,
    )

    if (!isPasswordValid) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: 'Invalid password',
      })
    }
    user.password = undefined
    // Create tokens
    const tokens = UserService.createTokenHandler({
      id: user._id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    })
    if (!tokens) {
      return sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Token creation failed',
      })
    }
    res.cookie('accessToken', tokens.accessToken)
    res.cookie('refreshToken', tokens.refreshToken)
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Login successful',
      data: { user, tokens },
    })
  },
)

const onboardingWithGoogle = catchAsync(async (req: Request, res: Response) => {
  const { email, isGoogleLogin } = req.body
  if (isGoogleLogin) {
    const existingUser = await UserModel.findOne({ email })

    if (!existingUser) {
      throw new AppError(
        500,
        'Please create an account before log in with google.',
      )
    }

    if (existingUser) {
      if (existingUser.isBanned) {
        throw new AppError(403, 'User is banned')
      }

      const tokens = UserService.createTokenHandler({
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        permissions: existingUser.permissions,
      })
      if (!tokens) {
        throw new AppError(500, 'Token creation failed')
      }
      res.cookie('accessToken', tokens.accessToken)
      res.cookie('refreshToken', tokens.refreshToken)
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Login successful',
        data: { user: existingUser, tokens },
      })
    }
  } else {
    throw new AppError(400, 'Invalid request')
  }
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const { oldPassword, newPassword } = req.body
  await checkUser(userId)

  const user = await UserModel.findById(userId).select('+password')

  const isPasswordValid = await bcrypt.compare(
    oldPassword,
    user?.password as string,
  )

  if (!isPasswordValid) {
    throw new AppError(401, 'Old password is incorrect')
  }
  user!.password = newPassword
  await user!.save()

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully',
  })
})

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const existingUser = await UserModel.findOne({ email })
      .session(session)
      .lean()
    if (!existingUser) {
      throw new AppError(400, 'No user found with this email.')
    }

    await OTPModel.deleteOne({ email }).session(session)

    const payload = {
      otp: Math.floor(100000 + Math.random() * 900000),
      email,
    }

    const [otpDoc] = await OTPModel.create([payload], { session })

    try {
      await sendEmail(
        email,
        'Your OTP Code for Password change',
        `Your OTP code is ${otpDoc.otp}`,
      )
    } catch {
      throw new AppError(500, 'Failed to send OTP email')
    }

    await session.commitTransaction()

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'OTP sent successfully.',
      data: otpDoc,
    })
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
})

const otpVerification = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body

  const otpDoc = await OTPModel.findOne({ email, otp })

  if (!otpDoc) {
    throw new AppError(400, 'Invalid OTP')
  }

  const user = await UserModel.findOne({ email })

  if (!user) {
    throw new AppError(404, 'User not found')
  }

  otpDoc.isVerified = true
  await otpDoc.save()

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OTP verified successfully',
  })
})

const changePasswordUsingOTP = catchAsync(
  async (req: Request, res: Response) => {
    const { email, newPassword } = req.body

    const otpDoc = await OTPModel.findOne({ email, isVerified: true })

    if (!otpDoc || !otpDoc.isVerified) {
      throw new AppError(400, 'Invalid or unverified OTP')
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    user.password = newPassword
    await user.save()

    await otpDoc.deleteOne()

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Password changed successfully using OTP',
    })
  },
)

export const UserController = {
  userOnboardingByEmailPassword,
  loginWithEmailPassword,
  onboardingWithGoogle,
  changePassword,
  forgetPassword,
  otpVerification,
  changePasswordUsingOTP,
}
