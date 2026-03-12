import { useAuthStore } from "@/features/auth/data/store";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useLogout } from "@/features/auth/data/hooks";
import { KeyRound, UserPen } from "lucide-react";

const AUTH_NAVS = [
  {
    title: "Đổi mật khẩu",
    path: "/change-password",
    icon: KeyRound, // Icon chìa khóa tròn cho bảo mật
  },
  {
    title: "Cập nhật thông tin",
    path: "/update-me",
    icon: UserPen, // Icon người dùng kèm cây bút để chỉnh sửa
  },
];

const Header = () => {
  const { mutate, isPending } = useLogout();
  const { currentAuth } = useAuthStore();
  return (
    <div className="flex items-center justify-between">
      {currentAuth && (
        <>
          <span>Hello: {currentAuth.username}</span>
          <div className="flex gap-4">
            {AUTH_NAVS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={`/me` + item.path}
                  className="flex items-center gap-3 p-1 transition-colors rounded-lg hover:bg-slate-100 group"
                >
                  <Icon
                    size={16}
                    className="text-slate-500 group-hover:text-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
      {currentAuth ? (
        <Button onClick={() => mutate()} disabled={isPending}>
          Logout
        </Button>
      ) : (
        <Button asChild>
          <Link to={`/login`}>Login</Link>
        </Button>
      )}
    </div>
  );
};

export default Header;
