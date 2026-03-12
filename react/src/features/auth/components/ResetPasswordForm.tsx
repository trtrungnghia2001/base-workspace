import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema, type ResetPasswordInput } from "../data/schema";
import { resetPasswordDefaultValues } from "../data/constants";
import { FormFieldCustom } from "@/components/custom/FormFieldCustom";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useResetPassword } from "../data/hooks";

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { ...resetPasswordDefaultValues, token },
  });
  const { isPending, mutate } = useResetPassword();
  const onSubmit = async (data: ResetPasswordInput) => {
    mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormFieldCustom
          name="password"
          control={form.control}
          label="New Password"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="password"
              placeholder="••••••••"
              aria-invalid={fieldState.invalid}
            />
          )}
        />

        <FormFieldCustom
          name="confirmPassword"
          control={form.control}
          label="Confirm New Password"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="password"
              placeholder="••••••••"
              aria-invalid={fieldState.invalid}
            />
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending..." : "Send Reset Link"}
        </Button>

        <FieldDescription className="text-center">
          Suddenly remembered?{" "}
          <Link to="/login" className="underline hover:text-primary">
            Back to login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
