import express from 'express';
import { getAllTodos, getAllUsers } from './admin.controller.js';

const adminRouter = express.Router();

adminRouter.get(`/users`, getAllUsers);
adminRouter.get(`/todos`, getAllTodos);

export default adminRouter;
