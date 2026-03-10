export const emailTemplates = {
  verifyEmail: (username, verifyUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
        <h2>Xác nhận tài khoản của bạn</h2>
      </div>
      <div style="padding: 20px; color: #333;">
        <p>Xin chào <b>${username}</b>,</p>
        <p>Cảm ơn bạn đã đăng ký! Để bắt đầu sử dụng hệ thống, vui lòng xác nhận địa chỉ email của bạn bằng cách nhấn vào nút bên dưới:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Kích hoạt tài khoản</a>
        </div>
        <p style="font-size: 13px; color: #666;">Link này sẽ có hiệu lực trong <b>24 giờ</b>. Sau thời gian này, nếu chưa kích hoạt, tài khoản sẽ tự động bị xóa để bảo mật.</p>
        <p>Nếu bạn không thực hiện đăng ký này, hãy bỏ qua email này.</p>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        © ${new Date().getUTCFullYear()} Gemini Base System. All rights reserved.
      </div>
    </div>
  `,

  resetPassword: (username, resetUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
        <h2>Khôi phục mật khẩu</h2>
      </div>
      <div style="padding: 20px; color: #333;">
        <p>Xin chào <b>${username}</b>,</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấn vào nút bên dưới để tiếp tục:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Đặt lại mật khẩu</a>
        </div>
        <p style="font-size: 13px; color: #666;">Link này sẽ hết hạn sau 15 phút.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        © ${new Date().getUTCFullYear()} Gemini Base System. All rights reserved.
      </div>
    </div>
  `,

  resetSuccess: (username) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #10b981; color: white; padding: 20px; text-align: center;">
        <h2>Mật khẩu đã được thay đổi!</h2>
      </div>
      <div style="padding: 20px; color: #333;">
        <p>Chào <b>${username}</b>,</p>
        <p>Mật khẩu tài khoản của bạn đã được thay đổi thành công vào lúc <b>${new Date().toLocaleString()}</b>.</p>
        <p>Nếu bạn không thực hiện việc này, hãy liên hệ ngay với chúng tôi để bảo vệ tài khoản.</p>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        © ${new Date().getUTCFullYear()} Gemini Base System. All rights reserved.
      </div>
    </div>
  `,
};
