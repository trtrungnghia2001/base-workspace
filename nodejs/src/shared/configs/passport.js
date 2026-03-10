import passportConfig from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '#server/features/users/user.model';
import ENV from './env.js';

passportConfig.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      const body = profile._json;

      // check user
      let user = await User.findOne({ email: body.email }).lean();

      if (!user) {
        const newUser = {
          email: body.email,
          username: body.name,
          password: body.sub, // Dùng Google ID làm mật khẩu tạm thời (không dùng để đăng nhập trực tiếp)
          isVerified: true, // Đánh dấu là đã xác thực qua Google
          avatarUrl: body.picture, // Lấy ảnh đại diện từ Google
          providerGoogleId: body.sub, // Lưu Google ID để sau này có thể liên kết tài khoản
        };

        user = await User.create(newUser);
      }

      return done(null, user);
    },
  ),
);

passportConfig.serializeUser(function (user, done) {
  done(null, user);
});
passportConfig.deserializeUser(function (user, done) {
  done(null, user);
});

export default passportConfig;
