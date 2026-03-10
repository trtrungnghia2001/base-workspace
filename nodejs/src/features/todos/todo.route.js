import express from 'express';
import {
  create,
  deleteById,
  getAll,
  getAllPublic,
  getById,
  updateById,
} from './todo.controller.js';
import validate from '#server/shared/middlewares/validate.middleware';
import { createTodoSchema, updateTodoSchema } from './todo.validate.js';
import { cacheMiddleware } from '#server/shared/middlewares/cache.middleware';

const todoRouter = express.Router();

todoRouter.post(`/`, validate(createTodoSchema), create);
todoRouter.patch(`/:id`, validate(updateTodoSchema), updateById);
todoRouter.delete(`/:id`, deleteById);
todoRouter.get(`/:id`, cacheMiddleware('todo_detail'), getById);
todoRouter.get(`/`, cacheMiddleware('todo_list'), getAll);

export default todoRouter;
