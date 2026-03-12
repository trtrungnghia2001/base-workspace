import { useAuthStore } from "@/features/auth/data/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthProtected = () => {
  const { currentAuth } = useAuthStore();
  const location = useLocation();
  return currentAuth ? <Outlet /> : <Navigate to={`/login`} state={location} />;
};

export default AuthProtected;
