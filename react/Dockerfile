# 1. Dùng React.js bản 22
FROM node:22-alpine

# 2. Đặt thư mục làm việc là /app
WORKDIR /app

# 3. Copy file quản lý thư viện trước để tối ưu hóa tốc độ build
COPY package*.json ./

# 4. Cài đặt các thư viện React
RUN npm install

# 5. Copy toàn bộ code React vào trong container
COPY . .

# 6. Vite React mặc định chạy cổng 5173
EXPOSE 5173

# 7. Lệnh khởi động React app
CMD ["npm", "run", "dev"]