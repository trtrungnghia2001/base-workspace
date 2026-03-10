import { redisClient } from '../configs/redis.js';

export const cacheMiddleware = (keyPrefix) => {
  return async (req, res, next) => {
    const userId = req.user?._id || 'guest';
    if (!userId) return next();

    // 1. Sắp xếp và Lọc bỏ query rỗng (để Key gọn hơn)
    const sortedQuery = Object.keys(req.query)
      .filter((key) => req.query[key] !== '' && req.query[key] !== undefined)
      .sort()
      .reduce((obj, key) => {
        obj[key] = req.query[key];
        return obj;
      }, {});

    const queryString = new URLSearchParams(sortedQuery).toString();

    // 2. Lấy Path đầy đủ (Ví dụ: /api/v1/todos)
    // req.baseUrl là "/api/v1/todos", req.path là "/"
    const fullPath = req.baseUrl + req.path;

    // 3. Tạo Key cuối cùng
    const key = queryString
      ? `${keyPrefix}:${userId}:${fullPath}?${queryString}`
      : `${keyPrefix}:${userId}:${fullPath}`;

    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        console.log(`🎯 [Cache Hit] Key: ${key}`);
        return res.status(200).json(JSON.parse(cachedData));
      }

      // Logic lưu cache giữ nguyên...
      const originalJson = res.json;
      res.json = (body) => {
        if (res.statusCode === 200) {
          redisClient.setEx(key, 300, JSON.stringify(body));
        }
        return originalJson.call(res, body);
      };
      next();
    } catch (err) {
      next();
    }
  };
};
