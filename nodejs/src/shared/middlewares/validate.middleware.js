import createError from "http-errors";

const validate = (schema) => (req, res, next) => {
  // Thực hiện validate body của request
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Trả về tất cả lỗi thay vì chỉ lỗi đầu tiên
    stripUnknown: true, // Loại bỏ các field thừa không có trong schema
  });

  if (error) {
    // Gom tất cả tin nhắn lỗi lại thành một chuỗi hoặc mảng
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(createError(400, errorMessage));
  }

  // Gán lại dữ liệu đã được làm sạch (strip) vào req.body
  req.body = value;
  next();
};

export default validate;
