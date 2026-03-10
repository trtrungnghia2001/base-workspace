import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';
import path from 'path';

import ENV from './shared/configs/env.js';
import { connectMongoDB } from './shared/configs/database.js';
import { handleErrorResponse } from './shared/utils/response.js';
import { connectRedis } from './shared/configs/redis.js';
import { initSocket } from './shared/configs/socket.js';
import routerV1 from './features/v1.route.js';

const app = express();
const server = http.createServer(app);

// 1. Khởi tạo Socket.io gắn vào server chung
initSocket(server);

// 2. Kết nối DB/Redis
try {
  await Promise.all([connectMongoDB(), connectRedis()]);
  console.log('=== All services initialized ===');
} catch (err) {
  console.error('Critical connection error:', err);
  process.exit(1);
}

// 3. Middleware setup
app.use(
  cors({
    origin: [
      'http://localhost:5000',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      ENV.WEBSITE_URL,
    ],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  }),
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// 4. Routers
app.use(`/`, routerV1);
app.use(handleErrorResponse);
app.get('/chat', (req, res) => {
  const filePath = path.join(process.cwd(), 'public', 'index.html');

  res.sendFile(filePath);
});

// 5. LISTEN 1 LẦN DUY NHẤT TRÊN SERVER
server.listen(ENV.PORT, () => {
  console.log(`🚀 Server + Socket.io running on: http://localhost:${ENV.PORT}`);
});
