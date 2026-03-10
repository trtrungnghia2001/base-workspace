import ENV from '#server/shared/configs/env';
import { redisClient } from '#server/shared/configs/redis';
import { clearCookie, setCookie } from '#server/shared/utils/cookie';
import { generateToken } from '#server/shared/utils/jwt';

export const generateAuthTokens = (payload) => {
  const accessToken = generateToken({
    payload,
    jwt_secret: ENV.JWT_SECRET,
    expiresIn: ENV.JWT_EXPIRESIN,
  });
  const refreshToken = generateToken({
    payload,
    jwt_secret: ENV.JWT_REFRESH_SECRET,
    expiresIn: ENV.JWT_REFRESH_EXPIRESIN,
  });

  return { accessToken, refreshToken };
};

/**
 * Helper: Khởi tạo phiên đăng nhập (Login/Refresh)
 * @param {Response} res - Express response object
 * @param {Object} user - Thông tin user (id, role)
 */
export const createAuthSession = async (res, user) => {
  const payload = { _id: user._id, role: user.role };
  const { accessToken, refreshToken } = generateAuthTokens(payload);

  // Lưu refresh token vào Redis (Với key là userId để dễ dàng quản lý)
  const RF_EXP_MS = 7 * 24 * 60 * 60 * 1000;
  const rfKey = `rf_token:${payload._id}`;

  await redisClient.setEx(rfKey, RF_EXP_MS / 1000, refreshToken); // setEx nhận thời gian tính bằng giây

  // Gắn token vào Cookie
  setCookie(res, 'accessToken', accessToken, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
  setCookie(res, 'refreshToken', refreshToken, {
    maxAge: RF_EXP_MS,
  });

  return { accessToken };
};

/**
 * Helper: Hủy phiên đăng nhập (Logout/Revoke)
 * @param {Response} res - Express response object
 * @param {string} userId - ID của người dùng
 */
export const destroyAuthSession = async (res, userId) => {
  const rfKey = `rf_token:${userId}`;

  // 1. Xóa token trong Redis (Vô hiệu hóa Refresh Token ngay lập tức)
  await redisClient.del(rfKey);

  // 2. Xóa các Cookie ở trình duyệt
  clearCookie(res, 'accessToken');
  clearCookie(res, 'refreshToken');
};
