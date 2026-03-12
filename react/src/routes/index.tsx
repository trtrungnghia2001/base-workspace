import AuthCard from "@/features/auth/components/AuthCard";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { UpdateMeForm } from "@/features/auth/components/UpdateMeForm";
import { useRoutes } from "react-router-dom";
import AuthProtected from "./AuthProtected";
import RootLayout from "@/components/layout/RootLayout";

const Routes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "register",
          element: <AuthCard />,
        },
        {
          path: "verify-email",
          element: <AuthCard />,
        },
        {
          path: "login",
          element: <AuthCard />,
        },
        {
          path: "forgot-password",
          element: <AuthCard />,
        },
        {
          path: "reset-password",
          element: <AuthCard />,
        },
        {
          path: "me",
          element: <AuthProtected />,
          children: [
            {
              path: "update-me",
              element: <UpdateMeForm />,
            },
            {
              path: "change-password",
              element: <ChangePasswordForm />,
            },
          ],
        },
      ],
    },
  ]);

  return routes;
};

export default Routes;
