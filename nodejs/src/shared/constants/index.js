import ENV from '../configs/env.js';

export const PARAMS = {
  PAGE: 1,
  LIMIT: 10,
  SEARCH: '',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const COOKIE_DEFAULT_OPTIONS = {
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
  sameSite: ENV.IS_PRODUCTION ? 'none' : 'lax',
  // Thời gian sống của cookie tính bằng mili giây. Hết thời gian này, trình duyệt tự
  // động xóa sạch dấu vết.
  maxAge: 24 * 60 * 60 * 1000, // Mặc định 1 ngày
};
