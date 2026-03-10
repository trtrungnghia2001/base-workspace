import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ROLES } from '#server/shared/constants/index';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [6, 'Mật khẩu phải ít nhất 6 ký tự'],
      select: false, // Khi query bình thường sẽ không hiện password (bảo mật)
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    isVerified: { type: Boolean, default: false },
    username: {
      type: String,
      required: [true, 'Username là bắt buộc'],
      unique: true,
      trim: true,
      minlength: [3, 'Username phải ít nhất 3 ký tự'],
    },
    avatarUrl: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', // Ảnh mặc định
    },
    avatarId: {
      type: String,
    },
    bio: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    versionKey: false, // Bỏ trường __v không cần thiết
  },
);

// TẠO TTL INDEX: Tự động xóa sau 24 giờ (86400 giây)
// NHƯNG chỉ xóa những User chưa verify
userSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400,
    partialFilterExpression: { isVerified: false },
  },
);

// --- HOOKS: Tự động mã hóa mật khẩu trước khi lưu ---
userSchema.pre('save', async function () {
  // Chỉ hash lại nếu mật khẩu bị thay đổi (tránh lỗi khi update thông tin khác)
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- METHODS: Hàm hỗ trợ so sánh mật khẩu khi Login ---
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Vì password ở trên có 'select: false', nên khi dùng hàm này phải đảm bảo password đã được nạp
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
