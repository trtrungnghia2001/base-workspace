import { COOKIE_DEFAULT_OPTIONS } from '../constants/index.js';

/**
 * Hàm hỗ trợ set cookie linh hoạt
 * @param {Response} res - Đối tượng response của express
 * @param {string} name - Tên cookie (accessToken, refreshToken, v.v.)
 * @param {string} value - Giá trị cần lưu (Token chuỗi)
 * @param {Object} options - Các tùy chọn ghi đè nếu cần
 */
export const setCookie = (res, name, value) => {
  res.cookie(name, value, COOKIE_DEFAULT_OPTIONS);
};

/**
 * Hàm xóa cookie theo tên
 */
export const clearCookie = (res, name) => {
  res.clearCookie(name, { ...COOKIE_DEFAULT_OPTIONS, maxAge: 0 });
};
