import Todo from '#server/features/todos/todo.model';
import { connectMongoDB } from '#server/shared/configs/database';
import mongoose from 'mongoose';

async function seedTodos() {
  try {
    const userId = '69ae3f58b0231d00e9d6d993';
    const todos = Array.from({ length: 20 }).map((_, i) => ({
      userId: new mongoose.Types.ObjectId(userId),
      title: `Công việc thứ ${i + 1}`,
      description: `Mô tả chi tiết cho task số ${i + 1}`,
      status:
        i % 5 === 0 ? 'in-progress' : i % 2 === 0 ? 'pending' : 'completed',
      priority: ['low', 'medium', 'high'][i % 3],
      createdAt: new Date(Date.now() - i * 3600000), // Mỗi cái cách nhau 1 tiếng
    }));

    await Todo.insertMany(todos);
    console.log('Seed Todos: OK!');
  } catch (error) {
    console.error('Lỗi khi seed todos:', error);
  }
}

async function main() {
  try {
    await connectMongoDB();
    await seedTodos();
  } catch (error) {
    console.error('Lỗi khi kết nối DB hoặc seed:', error);
  }
}
await main();
// node src/seed/index.js
