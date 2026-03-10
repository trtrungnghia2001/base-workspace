import User from '#server/features/users/user.model';
import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt.js';
import { catchAsync } from '../utils/response.js';
import { redisClient } from '../configs/redis.js';

/**
 * Middleware xác thực người dùng qua JWT trong Cookie
 */
export const isAuth = catchAsync(async (req, res, next) => {
  // 1. Lấy token từ cookie (Tên cookie phải khớp với lúc bạn setCookie)
  const token = req.cookies.accessToken || req.headers.authorization;

  if (!token) {
    throw createError.Unauthorized('Vui lòng đăng nhập để truy cập!');
  }

  // CHẶN NGAY TẠI ĐÂY: Kiểm tra Blacklist trong Redis
  const isBlacklisted = await redisClient.get(`bl:${token}`);
  if (isBlacklisted) {
    throw createError.Unauthorized(
      'Phiên làm việc đã kết thúc, vui lòng đăng nhập lại',
    );
  }

  try {
    // 2. Giải mã và kiểm tra tính hợp lệ của token
    const decoded = verifyToken(token);

    // 3. (Tùy chọn) Kiểm tra xem User còn tồn tại trong DB không
    // Điều này quan trọng nếu User bị xóa nhưng Token vẫn còn hạn
    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      throw createError(
        StatusCodes.UNAUTHORIZED,
        'Người dùng không còn tồn tại!',
      );
    }

    // 4. Lưu thông tin user vào request để dùng ở Controller
    req.user = user;
    next();
  } catch (error) {
    console.error(error);

    // Nếu token hết hạn hoặc sai chữ ký, verifyToken sẽ ném lỗi
    throw createError(
      StatusCodes.UNAUTHORIZED,
      'Phiên đăng nhập hết hạn, vui lòng login lại!',
    );
  }
});

/**
 * Middleware phân quyền (Ví dụ: chỉ Admin mới được vào)
 * @param {...string} roles - Danh sách các quyền được phép (admin, user...)
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(
          StatusCodes.FORBIDDEN,
          'Bạn không có quyền thực hiện hành động này!',
        ),
      );
    }
    next();
  };
};
