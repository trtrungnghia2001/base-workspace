import Joi from 'joi';

export const createTodoSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).allow('', null),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  dueDate: Joi.date().greater('now').optional(),
});

export const updateTodoSchema = createTodoSchema.fork(['title'], (schema) =>
  schema.optional(),
);
