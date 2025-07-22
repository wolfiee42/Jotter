import AppError from '../errors/appError'
import { UserModel } from '../modules/user/user.model'

export const checkUser = async (
  userId: string,
): Promise<ErrorConstructor | boolean> => {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw new AppError(404, 'User not found')
  }
  if (user.isBanned) {
    throw new AppError(
      403,
      `${user.username} has no permission to access this resource`,
    )
  }
  return true
}

export const isUsernameAvailable = async (username: string) => {
  const user = await UserModel.findOne({ username })
  if (user) {
    throw new AppError(409, `Username ${username} is already taken`)
  }
  return true
}
