import { useEffect } from "react";
import { authService } from "./features/auth/data/api";
import { Toaster } from "./components/ui/sonner";
import Routes from "./routes";
import { useAuthStore } from "./features/auth/data/store";

const App = () => {
  const { currentAuth, login } = useAuthStore();
  useEffect(() => {
    const initAuth = async () => {
      // Chỉ gọi API nếu chưa có thông tin user trong store
      if (!currentAuth) {
        try {
          const res = await authService.passportSuccess();
          login(res.data.user, res.data.accessToken);
        } catch (error) {
          console.error("Auth initialization failed", error);
        }
      }
    };

    initAuth();
  }, []);

  return (
    <>
      <Routes />
      <Toaster />
    </>
  );
};

export default App;
