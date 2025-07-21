import { Router } from 'express'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserValidation } from './user.validation'
import validateRequest from '../../middleware/validateRequest'
import Authentication from '../../middleware/authentication'
import { Authorize } from '../../middleware/authorize'

const router = Router()

router.post(
  '/registration',
  validateRequest(UserValidation.registrationValidation),
  UserController.userOnboardingByEmailPassword,
)
router.post(
  '/login',
  validateRequest(UserValidation.loginValidation),
  UserController.loginWithEmailPassword,
)
router.post(
  '/onboarding-with-google',
  validateRequest(UserValidation.loginByGoogleValidation),
  UserController.onboardingWithGoogle,
)

router.post(
  '/forget-password',
  validateRequest(UserValidation.forgetPasswordValidation),
  UserController.forgetPassword,
)

router.patch(
  '/change-password',
  Authentication,
  Authorize({ role: 'user' }),
  validateRequest(UserValidation.changePasswordValidation),
  UserController.changePassword,
)

router.patch(
  '/otp-verification',
  validateRequest(UserValidation.otpVerificationValidation),
  UserController.otpVerification,
)

router.patch(
  '/change-password-otp',
  validateRequest(UserValidation.changePasswordUsingOTPValidation),
  UserController.changePasswordUsingOTP,
)

router.get('/logout', UserService.clearToken)

export const UserRoute = router
