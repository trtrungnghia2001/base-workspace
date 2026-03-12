import ENV from '../configs/env.js';
import { PARAMS } from '../constants/index.js';

export const handleResponse = (
  res,
  {
    statusCode = 200,
    success = true,
    message = 'Query successfully',
    data = null,
    pagination = null,
  } = {
    data,
    message,
    statusCode,
    success,
    pagination: {
      page: PARAMS.PAGE,
      limit: PARAMS.LIMIT,
      totalPages: 1,
      totalItems: 0,
    },
  },
) => {
  return res.status(statusCode).json({
    statusCode,
    success,
    message,
    data,
    ...(pagination && { pagination }),
  });
};

export const handleErrorResponse = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // 1. Log chi tiết ra Console để lập trình viên nhìn thấy
  // err.stack chứa toàn bộ "dấu vết" từ lúc lỗi phát sinh
  console.error('--------------- ❌ ERROR LOG ---------------');
  console.error(`Method: ${req.method} | URL: ${req.url}`);
  console.error(`statusCode: ${statusCode}`);
  console.error(`Message: ${message}`);
  console.error(`Stack Trace: ${err.stack}`); // <--- Đây là cái bạn cần nhất
  console.error('-------------------------------------------');

  // 2. Trả về cho Client
  return res.status(statusCode).json({
    statusCode: statusCode,
    success: false,
    message: message,
  });
};
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
