import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { LoginForm } from "./LoginForm";
import SocialButton from "./SocialButton";
import { useLocation } from "react-router-dom";
import { RegisterForm } from "./RegisterForm";
import { VerifyEmailForm } from "./VerifyEmailForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ResetPasswordForm } from "./ResetPasswordForm";

const AuthCard = () => {
  const location = useLocation();
  return (
    <div
      className={cn(
        "w-full h-screen flex flex-col items-center justify-center gap-6",
      )}
    >
      <Card className="w-full sm:max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <SocialButton />
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or continue with
            </FieldSeparator>

            {location.pathname.includes("login") && <LoginForm />}
            {location.pathname.includes("register") && <RegisterForm />}
            {location.pathname.includes("verify-email") && <VerifyEmailForm />}
            {location.pathname.includes("forgot-password") && (
              <ForgotPasswordForm />
            )}
            {location.pathname.includes("reset-password") && (
              <ResetPasswordForm />
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
};

export default AuthCard;
