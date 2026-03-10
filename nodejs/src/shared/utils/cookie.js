import ENV from "../configs/env.js";

/**
 * Hàm hỗ trợ set cookie linh hoạt
 * @param {Response} res - Đối tượng response của express
 * @param {string} name - Tên cookie (accessToken, refreshToken, v.v.)
 * @param {string} value - Giá trị cần lưu (Token chuỗi)
 * @param {Object} options - Các tùy chọn ghi đè nếu cần
 */
export const setCookie = (res, name, value, options = {}) => {
  const defaultOptions = {
    // Đây là lá chắn quan trọng nhất chống lại XSS (Cross-Site Scripting).
    // Khi bật cái này, trình duyệt sẽ cấm mọi mã JavaScript (document.cookie)
    // truy cập vào cookie. Hacker không thể dùng script lậu để đánh cắp Token.
    httpOnly: true,
    // Cookie chỉ được gửi đi thông qua kết nối mã hóa HTTPS. Nếu bạn dùng HTTP thường,
    // trình duyệt sẽ không gửi cookie này. (Ở local ta để false để dev cho dễ,
    // nên mới có check process.env.NODE_ENV).
    secure: ENV.IS_PRODUCTION,
    // Ngăn chặn tấn công CSRF (Cross-Site Request Forgery). Nó đảm bảo trình duyệt chỉ
    // gửi cookie này nếu yêu cầu bắt nguồn từ chính domain của bạn.
    // Nếu user nhấn vào một link lạ từ website khác, cookie sẽ không bị gửi kèm theo.
    sameSite: "strict",
    // Thời gian sống của cookie tính bằng mili giây. Hết thời gian này, trình duyệt tự
    // động xóa sạch dấu vết.
    maxAge: 24 * 60 * 60 * 1000, // Mặc định 1 ngày
    ...options, // Ghi đè tùy chọn nếu truyền vào
  };

  res.cookie(name, value, defaultOptions);
};

/**
 * Hàm xóa cookie theo tên
 */
export const clearCookie = (res, name) => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: ENV.IS_PRODUCTION,
    sameSite: "strict",
  });
};
