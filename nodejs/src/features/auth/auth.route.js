import express from 'express';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateMeSchema,
  verifyEmailSchema,
} from './auth.validate.js';
import {
  register,
  login,
  logout,
  profile,
  updateMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
} from './auth.controller.js';
import validate from '#server/shared/middlewares/validate.middleware';
import { isAuth } from '#server/shared/middlewares/auth.middleware';
import { uploadCloud } from '#server/shared/configs/storage';

const authRouter = express.Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
authRouter.post('/login', validate(loginSchema), login);
authRouter.get('/profile', isAuth, profile);
authRouter.patch(
  '/update-me',
  isAuth,
  uploadCloud.single('avatar'),
  validate(updateMeSchema),
  updateMe,
);
authRouter.patch(
  '/change-password',
  isAuth,
  validate(changePasswordSchema),
  changePassword,
);
authRouter.post('/logout', isAuth, logout);
authRouter.post('/refresh-token', refreshToken);
authRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  forgotPassword,
);
authRouter.post(
  '/reset-password',
  validate(resetPasswordSchema),
  resetPassword,
);

export default authRouter;
