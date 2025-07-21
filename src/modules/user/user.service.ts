import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createToken, ExpireTime } from '../../utils/jwtTokenGenerator';
import config from '../../config';

// create tokens intimes of login and registration
const createTokenHandler = (payload: {
  id: string;
  name: string;
  email: string;
  role: string[];
  permissions: string[];
}) => {
  const accessToken = createToken(
    payload,
    config.secret_token as string,
    config.expires_in_secret_token as ExpireTime,
  );
  const refreshToken = createToken(
    payload,
    config.secret_refresh_token as string,
    config.expires_in_refresh_token as ExpireTime,
  );

  return { accessToken, refreshToken };
};

// clear tokens after logout
const clearToken = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    return sendResponse(res, {
      statusCode: 202,
      success: false,
      message: "You're already Logged out.",
    });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logout successfully',
  });
});

export const UserService = {
  clearToken,
  createTokenHandler,
};
