# 🚀 Node.js Backend Base Engine

Một bộ khung Backend hoàn chỉnh cho môi trường Production được xây dựng với Node.js, Express và Redis. Bộ Base này tập trung vào tối ưu hóa bộ nhớ đệm (Caching), xác thực bảo mật và kiến trúc có khả năng mở rộng cao, cung cấp nền tảng vững chắc cho các ứng dụng web hiện đại.

## Mục lục

* [Tổng quan](#Tổng quan)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Demo](#demo)
* [Images](#images)

## Tổng quan

Node.js Backend Base là một giải pháp xử lý dữ liệu tập trung vào hiệu suất và bảo mật. Dự án giải quyết các vấn đề cốt lõi của hệ thống Backend như: giảm tải cho Database (thông qua Redis Cache), quản lý phiên làm việc an toàn (JWT) và xử lý lỗi tập trung.

Kiến trúc được thiết kế theo dạng Feature-based (phân chia theo tính năng), giúp tách biệt rõ ràng các module nghiệp vụ, sẵn sàng để tích hợp mượt mà với các giao diện quản trị như Shadcn Admin Dashboard.

## Tính năng nổi bật

🔐 Xác thực & Phân quyền
* JWT-based Auth: Quản lý đăng nhập không trạng thái (Stateless) qua Access Token.
* Passport.js Strategy: Cấu trúc sẵn sàng để mở rộng đa phương thức xác thực (Local, Google, Facebook).
* Phân quyền RBAC: Middleware kiểm soát quyền truy cập (Admin/Member) ngay tại tầng API.

⚡ Tối ưu hóa bộ nhớ đệm (Redis Caching)
* Smart Cache Middleware: Tự động lưu trữ dữ liệu dựa trên userId và đường dẫn API (fullPath).
* Chuẩn hóa truy vấn (Query Normalization): Tự động sắp xếp các tham số tìm kiếm, phân trang để tối ưu tỷ lệ trùng khớp cache (Hit-rate).
* Tự động dọn dẹp (Auto-Invalidation): Cơ chế tự xóa cache khi có thao tác Cập nhật/Xóa để đảm bảo dữ liệu luôn chính xác.

📡 Giao tiếp Real-time
* Socket.IO Engine: Hỗ trợ kết nối hai chiều ổn định, độ trễ thấp.
* Hướng sự kiện (Event-driven): Sẵn sàng cho các tính năng Chat, thông báo đẩy (Notifications) và truyền tín hiệu Video Call.

🛠 Độ tin cậy của hệ thống
* Xử lý lỗi tập trung: Cơ chế catchAsync đảm bảo Server không bị sập đột ngột khi gặp lỗi ngoại lệ.
* Phản hồi chuẩn hóa: Định dạng dữ liệu trả về (JSON) đồng nhất cho toàn bộ hệ thống.

## Công nghệ sử dụng

* Ngôn ngữ: Node.js (ES Modules)
* Framework: Express.js
* Cơ sở dữ liệu: MongoDB (Mongoose)
* Bộ nhớ đệm: Redis (Cloud-ready với Upstash/Railway)
* Bảo mật: JWT, Passport.js, Bcrypt
* Real-time: Socket.io
* Triển khai: Vercel
