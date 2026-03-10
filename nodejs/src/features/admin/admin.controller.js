import { PARAMS } from '#server/shared/constants/index';
import { catchAsync, handleResponse } from '#server/shared/utils/response';
import Todo from '../todos/todo.model.js';
import User from '../users/user.model.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const { page, limit, search = PARAMS.SEARCH } = req.query;

  // Chuyển đổi sang số để tính toán skip
  const pageNum = Number(page) || PARAMS.PAGE;
  const limitNum = Number(limit) || PARAMS.LIMIT;

  const filters = {
    username: { $regex: search, $options: 'i' },
  };

  const [data, totalItems] = await Promise.all([
    User.find(filters)
      .sort({ createdAt: -1 }) // Thêm sort để xem cái mới nhất trước
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filters),
  ]);

  return handleResponse(res, {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalItems,
      totalPages: Math.ceil(totalItems / limitNum),
    },
  });
});

export const getAllTodos = catchAsync(async (req, res, next) => {
  const { page, limit, search = PARAMS.SEARCH } = req.query;

  // Chuyển đổi sang số để tính toán skip
  const pageNum = Number(page) || PARAMS.PAGE;
  const limitNum = Number(limit) || PARAMS.LIMIT;

  const filters = {
    title: { $regex: search, $options: 'i' },
  };

  const [data, totalItems] = await Promise.all([
    Todo.find(filters)
      .sort({ createdAt: -1 }) // Thêm sort để xem cái mới nhất trước
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    Todo.countDocuments(filters),
  ]);

  return handleResponse(res, {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalItems,
      totalPages: Math.ceil(totalItems / limitNum),
    },
  });
});
