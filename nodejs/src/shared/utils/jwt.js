import jwt from "jsonwebtoken";
import ENV from "../configs/env.js";

/**
 * Tạo JSON Web Token (JWT)
 * @param {Object} params - Đối tượng chứa thông tin tạo token
 * @param {Object} params.payload - Dữ liệu muốn lưu trong token (id, role...)
 * @param {string} [params.expiresIn] - Thời gian hết hạn (mặc định lấy từ ENV)
 * @param {string} [params.jwt_secret] - Mã bí mật để ký token (mặc định lấy từ ENV)
 * @returns {string} Chuỗi JWT đã được ký
 */
export const generateToken = ({
  payload,
  expiresIn = ENV.JWT_EXPIRESIN,
  jwt_secret = ENV.JWT_SECRET,
}) => {
  return jwt.sign(payload, jwt_secret, { expiresIn });
};

/**
 * Xác thực và giải mã JSON Web Token
 * @param {string} token - Chuỗi token cần kiểm tra
 * @param {string} [jwt_secret] - Mã bí mật để giải mã (mặc định lấy từ ENV)
 * @returns {Object} Dữ liệu đã giải mã (payload) hoặc ném lỗi nếu token không hợp lệ
 */
export const verifyToken = (token, jwt_secret = ENV.JWT_SECRET) => {
  // Lưu ý: jwt.verify sẽ tự động ném lỗi (JsonWebTokenError) nếu token sai hoặc hết hạn
  return jwt.verify(token, jwt_secret);
};
