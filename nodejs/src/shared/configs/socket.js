import { Server } from 'socket.io';
import ENV from './env.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5000',
        'http://127.0.0.1:5500',
        'http://localhost:3000',
        ENV.WEBSITE_URL,
      ],

      credentials: true,
      allowedHeaders: ['Authorization', 'Content-Type'],
    },
  });

  io.on('connection', (socket) => {
    const socketId = socket.id;
    console.log(`User connected with socketId:: ${socketId}`);

    // ===== CHAT ALL =====
    socket.on('chat message', (data) => {
      io.emit('chat message', {
        name: data.name,
        msg: data.msg,
        time: new Date(),
      });
    });

    // ===== CHAT ROOM =====
    // 1. Tham gia vào phòng (Dựa trên tên phòng mà Client gửi lên)
    socket.on('join-room', (roomName) => {
      socket.join(roomName);
      console.log(`👤 Socket ${socket.id} đã vào phòng: ${roomName}`);
    });

    // 2. Gửi tin nhắn CHỈ cho những người trong phòng đó
    socket.on('send-to-room', (data) => {
      const { room, message, sender } = data;

      // Dùng .to(room) để khu biệt đối tượng nhận
      io.to(room).emit('room-message', {
        sender,
        message,
        time: new Date(),
      });
    });

    // 3. Rời phòng
    socket.on('leave-room', (roomName) => {
      socket.leave(roomName);
      console.log(`🏃 Socket ${socket.id} đã rời phòng: ${roomName}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected with socketId:: ${socketId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io chưa được khởi tạo!');
  return io;
};
