import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../data/schema";
import { forgotPasswordDefaultValues } from "../data/constants";
import { FormFieldCustom } from "@/components/custom/FormFieldCustom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../data/hooks";

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
  });
  const { isPending, mutate } = useForgotPassword();
  const onSubmit = async (data: ForgotPasswordInput) => {
    mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormFieldCustom
          name="email"
          control={form.control}
          label="Email"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="email"
              type="email"
              placeholder="m@example.com"
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
