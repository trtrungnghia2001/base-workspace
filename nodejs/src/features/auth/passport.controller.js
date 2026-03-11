import createError from 'http-errors';
import { catchAsync, handleResponse } from '#server/shared/utils/response';
import { createAuthSession } from './auth.helper.js';
import { StatusCodes } from 'http-status-codes';

export const passportSuccess = catchAsync(async (req, res, next) => {
  const getCK = req.cookies[`connect.sid`];
  if (!getCK) {
    throw createError.Unauthorized(`Invalid connect.sid`);
  }

  const user = req.user;

  if (!user) {
    throw createError.Unauthorized('Authentication failed');
  }

  const { accessToken } = await createAuthSession(res, user);

  return handleResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Đăng nhập thành công',
    data: {
      user: user,
      accessToken,
    },
  });
});

export const passportFailure = catchAsync(async (req, res, next) => {
  return handleResponse(res, {
    status: StatusCodes.UNAUTHORIZED,
    message: 'Authentication failed',
  });
});
