import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserValidation } from './user.validation';
import validateRequest from '../../middleware/validateRequest';
import Authentication from '../../middleware/authentication';
import { Authorize } from '../../middleware/authorize';

const router = Router();

router.post(
  '/registration',
  validateRequest(UserValidation.registrationValidation),
  UserController.userOnboardingByEmailPassword,
);
router.post(
  '/login',
  validateRequest(UserValidation.loginValidation),
  UserController.loginWithEmailPassword,
);
router.post(
  '/onboarding-with-google',
  validateRequest(UserValidation.loginByGoogleValidation),
  UserController.onboardingWithGoogle,
);

router.patch(
  '/change-password',
  Authentication,
  Authorize({ role: 'user' }),
  validateRequest(UserValidation.changePasswordValidation),
  UserController.changePassword,
);

router.post(
  '/forget-password',
  Authentication,
  Authorize({ role: 'user' }),
  UserController.forgetPassword
)

router.get('/logout', UserService.clearToken);

export const UserRoute = router;
