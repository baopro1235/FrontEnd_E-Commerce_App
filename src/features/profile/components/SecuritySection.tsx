import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { PasswordForm } from "@/features/profile/profile.schema"

interface SecuritySectionProps {
  form: UseFormReturn<PasswordForm>
  message: string
  error: string
  onSave: (data: PasswordForm) => Promise<void>
}

function SecuritySection({
  form,
  message,
  error,
  onSave,
}: SecuritySectionProps) {
  const { errors, isSubmitting } = form.formState

  return (
    <Card id="security" className="scroll-mt-6">
      <CardHeader>
        <CardTitle>Bảo mật</CardTitle>
        <CardDescription>
          Dùng mật khẩu mạnh và không chia sẻ mật khẩu với người khác.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-5"
          noValidate
          onSubmit={form.handleSubmit(onSave)}
        >
          <FieldGroup className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field
              className="sm:col-span-2"
              data-invalid={!!errors.currentPassword}
            >
              <FieldLabel htmlFor="current-password">
                Mật khẩu hiện tại
              </FieldLabel>
              <Input
                autoComplete="current-password"
                id="current-password"
                type="password"
                aria-invalid={!!errors.currentPassword}
                {...form.register("currentPassword")}
              />
              <FieldError>{errors.currentPassword?.message}</FieldError>
            </Field>
            <Field data-invalid={!!errors.newPassword}>
              <FieldLabel htmlFor="new-password">Mật khẩu mới</FieldLabel>
              <Input
                autoComplete="new-password"
                id="new-password"
                type="password"
                aria-invalid={!!errors.newPassword}
                {...form.register("newPassword")}
              />
              <FieldError>{errors.newPassword?.message}</FieldError>
            </Field>
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirm-new-password">
                Xác nhận mật khẩu mới
              </FieldLabel>
              <Input
                autoComplete="new-password"
                id="confirm-new-password"
                type="password"
                aria-invalid={!!errors.confirmPassword}
                {...form.register("confirmPassword")}
              />
              <FieldError>{errors.confirmPassword?.message}</FieldError>
            </Field>
          </FieldGroup>
          {error && (
            <p aria-live="polite" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {message && (
            <p aria-live="polite" className="text-sm text-primary">
              {message}
            </p>
          )}
          <div className="flex justify-end">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Đang cập nhật..." : "Đổi mật khẩu"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SecuritySection
