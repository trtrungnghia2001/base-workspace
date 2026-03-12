import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateMeSchema, type UpdateMeInput } from "../data/schema";
import { updateMeDefaultValues } from "../data/constants";
import { FormFieldCustom } from "@/components/custom/FormFieldCustom";
import { Button } from "@/components/ui/button";
import { useProfile, useUpdateMe } from "../data/hooks";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { MediaUpload } from "@/components/custom/media-upload";

export function UpdateMeForm() {
  const { data: userData, isLoading } = useProfile();
  const { isPending, mutate, isSuccess } = useUpdateMe();

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const form = useForm<UpdateMeInput>({
    resolver: zodResolver(updateMeSchema),
    defaultValues: updateMeDefaultValues,
  });
  const onSubmit = async (data: UpdateMeInput) => {
    mutate({ data, file: fileToUpload });
  };

  useEffect(() => {
    if (userData?.data) {
      form.reset({
        username: userData.data.username,
        avatarUrl: userData.data.avatarUrl,
        bio: userData.data.bio,
      });
    }
  }, [userData, form]);

  useEffect(() => {
    if (isSuccess) {
      setFileToUpload(null);
    }
  }, [isSuccess]);

  if (isLoading) return <div>Loading user profile...</div>;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormFieldCustom
          name="avatarUrl"
          control={form.control}
          render={({ field }) => (
            <MediaUpload
              containerClassName="mx-auto"
              value={field.value as string}
              maxFiles={1}
              mode="avatar"
              onChange={(files) => setFileToUpload(files[0])}
            />
          )}
        />

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
          name="bio"
          control={form.control}
          label="Bio"
          render={({ field, fieldState }) => (
            <div className="grid w-full gap-1.5">
              <Textarea
                {...field}
                id="bio"
                placeholder="Tell us a little bit about yourself"
                className="min-h-100 resize-none"
                aria-invalid={fieldState.invalid}
              />
              <p className="text-xs text-muted-foreground text-right">
                {field.value?.length || 0}/500 characters
              </p>
            </div>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || form.formState.isDirty}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </FieldGroup>
    </form>
  );
}
