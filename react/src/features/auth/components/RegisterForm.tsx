import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "../data/schema";
import { registerDefaultValues } from "../data/constants";
import { FormFieldCustom } from "@/components/custom/FormFieldCustom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRegister } from "../data/hooks";

export function RegisterForm() {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaultValues,
  });
  const { isPending, mutate } = useRegister();
  const onSubmit = async (data: RegisterInput) => {
    mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormFieldCustom
          name="username"
          control={form.control}
          label="Username"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="username"
              placeholder="username"
              aria-invalid={fieldState.invalid}
            />
          )}
        />

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

        <FormFieldCustom
          name="password"
          label="Password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="password"
              type="password"
              placeholder="••••••••"
              aria-invalid={fieldState.invalid}
            />
          )}
        />

        <FormFieldCustom
          name="confirmPassword"
          control={form.control}
          label="Confirm Password"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              aria-invalid={fieldState.invalid}
            />
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
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
