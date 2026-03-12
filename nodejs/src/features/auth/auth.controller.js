import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import { catchAsync, handleResponse } from '#server/shared/utils/response';
import User from '../users/user.model.js';
import { verifyToken } from '#server/shared/utils/jwt';
import { createAuthSession, destroyAuthSession } from './auth.helper.js';
import { redisClient } from '#server/shared/configs/redis';
import { emailTemplates } from '#server/shared/templates/emailTemplates';
import { sendEmail } from '#server/shared/utils/mailer';
import ENV from '#server/shared/configs/env';
import { StorageService } from '#server/shared/configs/storage';
import jwt from 'jsonwebtoken';

export const register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  let user; // Khai báo biến chung để dùng cho cả 2 trường hợp

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.isVerified) {
      throw createError.Conflict('Email đã được sử dụng');
    }

    // Ghi đè thông tin cho User chưa verify
    existingUser.username = username;
    existingUser.password = password;
    existingUser.createdAt = Date.now();
    user = await existingUser.save();
  } else {
    // Tạo user mới hoàn toàn
    user = await User.create({ username, email, password });
  }

  // 3. Tạo Verify Token
  const verifyToken = crypto.randomBytes(32).toString('hex');
  console.log({ verifyToken });

  const hashedToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');

  // 4. Lưu vào Redis (Dùng biến 'user' đã gán ở trên)
  await redisClient.setEx(
    `verify_email:${hashedToken}`,
    86400,
    user._id.toString(),
  );

  // 5. Gửi Mail kích hoạt
  const verifyUrl = `${ENV.WEBSITE_URL}/verify-email?token=${verifyToken}`;
  const htmlContent = emailTemplates.verifyEmail(username, verifyUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: 'Kích hoạt tài khoản của bạn',
      html: htmlContent,
    });

    return handleResponse(res, {
      message:
        'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản trong vòng 24 giờ.',
    });
  } catch (error) {
    // Chỉ xóa nếu là user mới tạo hoàn toàn để tránh logic phức tạp khi update
    if (!existingUser) {
      await User.findByIdAndDelete(user._id);
    }
    await redisClient.del(`verify_email:${hashedToken}`);
    throw createError.InternalServerError(
      'Không thể gửi email kích hoạt, vui lòng thử lại sau.',
    );
  }
});
export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  // 1. Hash cái token người dùng gửi lên để so sánh với cái đã lưu trong Redis
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // 2. Tìm userId trong Redis
  const userId = await redisClient.get(`verify_email:${hashedToken}`);

  if (!userId) {
    throw createError.BadRequest(
      'Liên kết xác nhận đã hết hạn hoặc không hợp lệ. Vui lòng đăng ký lại.',
    );
  }

  // 3. Cập nhật User trong MongoDB
  // Quan trọng: Khi isVerified: true, TTL Index sẽ không xóa User này nữa
  const user = await User.findByIdAndUpdate(
    userId,
    { isVerified: true },
    { new: true },
  );

  if (!user) {
    throw createError.NotFound('Không tìm thấy người dùng');
  }

  // 4. Xóa Token trong Redis để tránh việc click lại link cũ
  await redisClient.del(`verify_email:${hashedToken}`);

  return handleResponse(res, {
    message: 'Tài khoản của bạn đã được xác thực thành công!',
  });
});
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Kiểm tra user tồn tại chưa. (Phải dùng .select("+password") vì Model đang để select: false)
  const existingUser = await User.findOne({ email, isVerified: true }).select(
    '+password',
  );
  if (!existingUser) {
    throw createError.NotFound('Email hoặc mật khẩu sai');
  }

  // Nếu KHÔNG tìm thấy user
  if (!existingUser) {
    throw createError.Unauthorized('Email hoặc mật khẩu không chính xác');
  }

  // 2. Kiểm tra mật khẩu
  const isMatch = await existingUser.comparePassword(password);
  if (!isMatch) {
    throw createError.Unauthorized('Email hoặc mật khẩu không chính xác');
  }

  // 3. Tạo Token, gắn vào cookie, lưu vào redis
  const { accessToken } = await createAuthSession(res, existingUser);

  // 4. Trả về response chuẩn hóa
  delete existingUser._doc.password; // Xóa password trước khi trả về (bảo mật)

  return handleResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Đăng nhập thành công',
    data: {
      user: existingUser,
      accessToken,
    },
  });
});
export const profile = catchAsync(async (req, res, next) => {
  return handleResponse(res, {
    data: req.user,
  });
});
export const updateMe = catchAsync(async (req, res, next) => {
  const file = req.file;
  const updates = req.body;
  const user = req.user;

  let newAvatarData = null;

  try {
    if (file) {
      // 2. Upload ảnh mới
      const result = await StorageService.toCloudinary(file.buffer, 'avatars');
      newAvatarData = {
        url: result.secure_url,
        publicId: result.public_id, // Cloudinary trả về public_id bao gồm cả folder
      };

      updates.avatarUrl = newAvatarData.url;
      updates.avatarId = newAvatarData.publicId; // Lưu ID này vào DB để sau này xóa cho chuẩn
    }

    // 3. Cập nhật vào DB
    const updatedUser = await User.findByIdAndUpdate(user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    // 4. NẾU UPDATE DB THÀNH CÔNG -> Xóa ảnh cũ (nếu có)
    if (file && user.avatarId) {
      await StorageService.removeCloudinary(user.avatarId);
    }

    return handleResponse(res, {
      message: 'Cập nhật thông tin thành công',
      data: updatedUser,
    });
  } catch (error) {
    // 5. ROLLBACK: Nếu lỗi DB, xóa cái ảnh vừa mới upload lên
    if (newAvatarData) {
      await StorageService.removeCloudinary(newAvatarData.publicId);
    }
    next(error); // Đừng quên chuyển lỗi cho Error Middleware xử lý
  }
});
export const changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id; // Lấy từ middleware isAuth

  // 1. Tìm user và lấy luôn password (vì bình thường ta hay set select: false)
  const user = await User.findById(userId).select('+password');

  // 2. Kiểm tra mật khẩu cũ có đúng không
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw createError.Unauthorized('Mật khẩu hiện tại không chính xác');
  }

  // 3. Kiểm tra mật khẩu mới không được trùng mật khẩu cũ
  if (oldPassword === newPassword) {
    throw createError.BadRequest('Mật khẩu mới phải khác mật khẩu cũ');
  }

  // 4. Cập nhật mật khẩu mới
  user.password = newPassword;
  await user.save(); // Middleware pre-save sẽ tự động hash password này

  // 5. SECURITY UPGRADE: Vô hiệu hóa toàn bộ session cũ trên các thiết bị khác
  // Tìm tất cả refresh tokens của user này trong Redis và xóa sạch

  const rfKey = `rf_token:${userId}`;
  const sessionKeys = await redisClient.keys(`${rfKey}*`);

  if (sessionKeys.length > 0) {
    await redisClient.del(sessionKeys);
  }

  // 6. Gửi mail thông báo đã đổi pass thành công (Tùy chọn nhưng nên có)
  const htmlContent = emailTemplates.resetSuccess(user.username);
  await sendEmail({
    email: user.email,
    subject: 'Thông báo: Mật khẩu đã được thay đổi',
    html: htmlContent,
  });

  return handleResponse(res, {
    message:
      'Đổi mật khẩu thành công! Vui lòng đăng nhập lại trên các thiết bị.',
  });
});
export const logout = catchAsync(async (req, res, next) => {
  const { accessToken } = req.cookies;
  let userId = null;

  // 1. Xử lý Blacklist nếu có token
  if (accessToken) {
    try {
      const payload = jwt.decode(accessToken);
      if (payload) userId = payload._id;

      const decoded = verifyToken(accessToken);

      if (decoded) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;

        userId = decoded._id;

        if (ttl > 0) {
          // Cho vào blacklist để vô hiệu hóa AT ngay lập tức
          await redisClient.setEx(`bl:${accessToken}`, ttl, 'true');
        }
      }
    } catch (err) {
      // Nếu verifyToken lỗi (token fake hoặc quá hạn), ta log ra và tiếp tục dọn dẹp
      console.log('Logout: Token verify failed, proceeding to clear cookies.');
    }
  }

  await destroyAuthSession(res, userId);

  return handleResponse(res, { message: 'Đã đăng xuất thành công' });
});
export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createError.Unauthorized('Không tìm thấy refresh token');
  }

  let payload;
  // 1. Verify chữ ký và hạn dùng
  try {
    payload = verifyToken(refreshToken, ENV.JWT_REFRESH_SECRET);
  } catch (err) {
    throw createError.Unauthorized('Phiên đăng nhập hết hạn');
  }

  // 2. CẦN CHECK REDIS
  // Lấy key dựa trên cấu trúc bạn đã thống nhất (ví dụ có version hoặc không)
  const rfKey = `rf_token:${payload._id}*`;
  const sessionKeys = await redisClient.keys(rfKey);

  // Kiểm tra xem Token này có thực sự tồn tại trong "danh sách trắng" của Redis không
  // (Hoặc bạn có thể dùng redisClient.get nếu lưu theo hashedToken)
  const isSessionValid = sessionKeys.length > 0;

  if (!isSessionValid) {
    throw createError.Unauthorized(
      'Phiên đăng nhập đã hết hạn hoặc đã bị thu hồi',
    );
  }

  // 3. Nếu ổn thì mới tạo Session mới
  const { accessToken } = await createAuthSession(res, payload);

  return handleResponse(res, { data: { accessToken } });
});
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // 1. Kiểm tra User có tồn tại không
  const user = await User.findOne({ email });
  if (!user) throw createError.NotFound('Email không tồn tại trên hệ thống');

  // 2. Tạo Reset Token ngẫu nhiên (chưa hash) để gửi cho User
  const resetToken = crypto.randomBytes(32).toString('hex');
  console.log({ resetToken });

  // 3. Hash token trước khi lưu vào Redis (Để lỡ Redis bị lộ, hacker cũng không dùng được)
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 4. Lưu vào Redis Cloud (TTL: 15 phút = 900 giây)
  // Key: reset_pw:hash_token, Value: userId
  await redisClient.setEx(`reset_pw:${hashedToken}`, 900, user._id.toString());

  // 5. Chuẩn bị URL gửi mail (Frontend URL)
  const resetUrl = `${ENV.WEBSITE_URL}/reset-password?token=${resetToken}`;

  // 6. Gọi template và truyền dữ liệu
  const htmlContent = emailTemplates.resetPassword(user.username, resetUrl);

  await sendEmail({
    email: user.email,
    subject: '🔒 Khôi phục mật khẩu của bạn',
    html: htmlContent,
  });

  return handleResponse(res, {
    message: 'Link khôi phục mật khẩu đã được gửi vào Email của bạn',
  });
});
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;

  // 1. Hash lại cái token nhận được từ URL để so khớp với Redis
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // 2. Tìm UserId trong Redis bằng Hashed Token
  const userId = await redisClient.get(`reset_pw:${hashedToken}`);
  if (!userId) {
    throw createError.BadRequest('Link đã hết hạn hoặc không hợp lệ');
  }

  // 3. Cập nhật mật khẩu mới
  const user = await User.findById(userId);
  if (!user) throw createError.NotFound('Người dùng không còn tồn tại');

  user.password = password; // Mongoose middleware (.pre('save')) sẽ tự hash cái này
  await user.save();

  // 4. XÓA TOKEN TRONG REDIS (Token này chỉ dùng 1 lần duy nhất)
  await redisClient.del(`reset_pw:${hashedToken}`);

  // 5. (Bảo mật thêm) Xóa luôn Refresh Token cũ để ép User login lại trên mọi thiết bị
  await redisClient.del(`rf_token:${userId}`);

  // 6. Gọi template và truyền dữ liệu
  const htmlContent = emailTemplates.resetSuccess(user.username);

  await sendEmail({
    email: user.email,
    subject: '🔒 Khôi phục mật khẩu của bạn thành công',
    html: htmlContent,
  });

  return handleResponse(res, {
    message: 'Chúc mừng! Mật khẩu đã được cập nhật thành công',
  });
});
