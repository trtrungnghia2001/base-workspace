import { PARAMS } from '#server/shared/constants/index';
import { catchAsync, handleResponse } from '#server/shared/utils/response';
import createHttpError from 'http-errors';
import Todo from './todo.model.js';
import { clearTodoCache } from './todo.helper.js';

export const create = catchAsync(async (req, res, next) => {
  const todo = await Todo.create({ ...req.body, userId: req.user._id });

  // XÓA CACHE NGAY
  await clearTodoCache(req.user._id);

  return handleResponse(res, { data: todo });
});

export const getById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const todo = await Todo.findOne({ _id: id, userId: req.user._id });
  if (!todo) {
    throw createHttpError.NotFound('Todo not found');
  }
  return handleResponse(res, { data: todo });
});

export const getAll = catchAsync(async (req, res, next) => {
  const { page, limit, search = PARAMS.SEARCH, status, priority } = req.query;

  // Chuyển đổi sang số để tính toán skip
  const pageNum = Number(page) || PARAMS.PAGE;
  const limitNum = Number(limit) || PARAMS.LIMIT;

  const filters = {
    userId: req.user._id,
    title: { $regex: search, $options: 'i' },
  };

  // Chỉ thêm filter nếu có giá trị truyền lên
  if (status) filters.status = status;
  if (priority) filters.priority = priority;

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

export const updateById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const todo = await Todo.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true },
  );

  if (!todo) throw createHttpError.NotFound('Todo not found');

  // XÓA CACHE NGAY
  await clearTodoCache(req.user._id);

  return handleResponse(res, { data: todo });
});

export const deleteById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user._id });

  if (!todo) throw createHttpError.NotFound('Todo not found');

  // XÓA CACHE NGAY
  await clearTodoCache(req.user._id);

  return handleResponse(res, { message: 'Xóa thành công', data: todo });
});

export const getAllPublic = catchAsync(async (req, res, next) => {
  const { page, limit, search = PARAMS.SEARCH, status, priority } = req.query;

  // Chuyển đổi sang số để tính toán skip
  const pageNum = Number(page) || PARAMS.PAGE;
  const limitNum = Number(limit) || PARAMS.LIMIT;

  const filters = {
    title: { $regex: search, $options: 'i' },
  };

  // Chỉ thêm filter nếu có giá trị truyền lên
  if (status) filters.status = status;
  if (priority) filters.priority = priority;

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
