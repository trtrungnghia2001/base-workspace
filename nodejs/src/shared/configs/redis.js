import { createClient } from 'redis';
import ENV from './env.js';

// 1. Khởi tạo client
const redisClient = createClient({
  url: !ENV.IS_PRODUCTION
    ? `redis://${ENV.REDIS_USERNAME}:${ENV.REDIS_PASSWORD}@${ENV.REDIS_HOST}:${ENV.REDIS_PORT}`
    : `redis://${ENV.REDIS_HOST}:${ENV.REDIS_PORT}`,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
  },
});

// 2. Các sự kiện lắng nghe lỗi/kết nối
redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Cloud: Connected!'));

// 3. Hàm kết nối (Sẽ gọi trong app.js hoặc server.js)
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error('❌ Could not connect to Redis:', err);
    process.exit(1);
  }
};

export { redisClient, connectRedis };
