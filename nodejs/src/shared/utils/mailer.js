import nodemailer from 'nodemailer';
import ENV from '../configs/env.js';

export const sendEmail = async (options = { email, subject, html }) => {
  // 1. Tạo transporter (Người vận chuyển)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: ENV.IS_PRODUCTION,
    },
  });

  // 2. Định nghĩa nội dung email
  const mailOptions = {
    from: `Base Project Support <support@yourdomain.com>`,
    to: options.email,
    subject: options.subject,
    html: options.html, // Dùng HTML cho đẹp
  };

  // 3. Gửi mail
  await transporter.sendMail(mailOptions);
};
