import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { changePasswordSchema, type ChangePasswordInput } from "../data/schema";
import { changePasswordDefaultValues } from "../data/constants";
import { FormFieldCustom } from "@/components/custom/FormFieldCustom";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "../data/hooks";

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: changePasswordDefaultValues,
  });
  const { isPending, mutate } = useChangePassword();
  const onSubmit = async (data: ChangePasswordInput) => {
    mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormFieldCustom
          name="oldPassword"
          control={form.control}
          label="Old Password"
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
          name="newPassword"
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
      </FieldGroup>
    </form>
  );
}
