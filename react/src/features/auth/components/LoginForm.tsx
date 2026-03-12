import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "../data/schema";
import { loginDefaultValues } from "../data/constants";
import { FormFieldCustom } from "@/components/custom/FormFieldCustom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLogin } from "../data/hooks";

export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const { isPending, mutate } = useLogin();
  const onSubmit = async (data: LoginInput) => {
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

        <FormFieldCustom
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  to={`/forgot-password`}
                  className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="••••••••"
                aria-invalid={fieldState.invalid}
              />
            </div>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>

        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          <Link
            to={`/register`}
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
