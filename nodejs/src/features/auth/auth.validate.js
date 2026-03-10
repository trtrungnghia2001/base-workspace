import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
export const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateMeSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional().messages({
    'string.min': 'Tên người dùng phải ít nhất 3 ký tự',
  }),

  bio: Joi.string().max(200).allow('', null).optional(),

  // Field này dùng để chứa file từ Multer (nếu bạn gửi qua form-data)
  avatar: Joi.any().optional(),

  // Field này thường dùng khi bạn muốn cập nhật trực tiếp URL
  // (ví dụ: dùng ảnh từ Google/Facebook)
  avatarUrl: Joi.string().uri().optional(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref('newPassword'))
    .required()
    .messages({ 'any.only': 'Mật khẩu xác nhận không khớp' }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({ 'any.required': 'Token là bắt buộc' }),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Mật khẩu xác nhận không khớp' }),
});
