import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Tiêu đề không được để trống'],
      trim: true,
      maxlength: [100, 'Tiêu đề không quá 100 ký tự'],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Index để tìm kiếm Todos của 1 user nhanh hơn
todoSchema.index({ userId: 1, createdAt: -1 });

const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);
export default Todo;
