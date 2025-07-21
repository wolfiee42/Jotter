import { z } from 'zod';

const registrationValidation = z.object({
  body: z.object({
    username: z.string({
      required_error: 'Username is required',
    }),
    email: z.string({
      required_error: 'Email is required',
    }),
  }),
});

const loginValidation = z.object({
  body: z.object({
    email: z.string({
      required_error: 'email is required.',
    }),
    password: z.string({
      required_error: 'Password is required.',
    }),
  }),
});

const loginByGoogleValidation = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required.',
    }),
    isGoogleLogin: z.boolean({
      required_error: 'Please provide all required fields.',
    }),
  }),
});

const changePasswordValidation = z.object({
  body: z
    .object({
      oldPassword: z.string({
        required_error: 'Old Password is required.',
      }),
      newPassword: z.string({
        required_error: 'New Password is required.',
      }),
    })
    .strict(),
});

export const UserValidation = {
  registrationValidation,
  loginValidation,
  loginByGoogleValidation,
  changePasswordValidation,
};
