# 1. Chọn hệ điều hành nền (Base Image) có sẵn Node.js bản 18
FROM node:18

# 2. Tạo một thư mục làm việc bên trong Container (giống như tạo folder dự án)
WORKDIR /app

# 3. Copy file package.json và package-lock.json trước
# Mục đích: Để tận dụng Docker Cache, nếu bạn không thêm thư viện mới, 
# Docker sẽ không cần chạy lại lệnh 'npm install' rất tốn thời gian.
COPY package*.json ./

# 4. Chạy lệnh cài đặt các thư viện (dependencies)
RUN npm install

# 5. Sau khi cài xong thư viện, mới copy toàn bộ code còn lại từ máy vào Container
COPY . .

# 6. Thông báo rằng Container này sẽ mở cổng 5000 (cổng Backend của bạn)
EXPOSE 5000

# 7. Lệnh cuối cùng để khởi động server (chỉ chạy khi container bắt đầu bật)
CMD ["npm", "start"]