import express from 'express';
import authRouter from './auth/auth.route.js';
import adminRouter from './admin/admin.route.js';
import todoRouter from './todos/todo.route.js';
import { cacheMiddleware } from '#server/shared/middlewares/cache.middleware';
import { authorize, isAuth } from '#server/shared/middlewares/auth.middleware';
import { getAllPublic } from './todos/todo.controller.js';

const routerV1 = express.Router();

const apiPrefix = '/api/v1'; // Bạn có thể thêm /api/v1 nếu muốn
routerV1.use(`${apiPrefix}/auth`, authRouter);
routerV1.use(`${apiPrefix}/admin`, isAuth, authorize('admin'), adminRouter);
routerV1.use(`${apiPrefix}/todos`, isAuth, todoRouter);
routerV1.use(
  `${apiPrefix}/public/todos`,
  cacheMiddleware('todo_list'),
  getAllPublic,
);

export default routerV1;
