import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { verifyEmailSchema, type VerifyEmailInput } from "../data/schema";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "../data/hooks";

export function VerifyEmailForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const form = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token },
  });
  const { isPending, mutate } = useVerifyEmail();
  const onSubmit = async (data: VerifyEmailInput) => {
    mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <p className="text-sm text-muted-foreground">
          {token
            ? "Token đã sẵn sàng, nhấn nút bên dưới để xác thực."
            : "Không tìm thấy mã xác thực. Vui lòng kiểm tra lại email."}
        </p>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !token} // Vô hiệu hóa nếu không có token
        >
          {isPending ? "Verifying..." : "Verify Email"}
        </Button>

        <FieldDescription className="text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
