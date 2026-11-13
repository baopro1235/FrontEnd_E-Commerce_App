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
import type { ProfileForm } from "@/features/profile/profile.schema"

interface PersonalInfoSectionProps {
  email: string
  form: UseFormReturn<ProfileForm>
  message: string
  error: string
  onSave: (data: ProfileForm) => Promise<void>
}

function PersonalInfoSection({
  email,
  form,
  message,
  error,
  onSave,
}: PersonalInfoSectionProps) {
  const { errors, isSubmitting } = form.formState

  return (
    <Card id="personal-info" className="scroll-mt-6">
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>
          Cập nhật tên và số điện thoại dùng cho đơn hàng.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-5"
          noValidate
          onSubmit={form.handleSubmit(onSave)}
        >
          <FieldGroup className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.fullName}>
              <FieldLabel htmlFor="profile-name">Họ và tên</FieldLabel>
              <Input
                autoComplete="name"
                id="profile-name"
                aria-invalid={!!errors.fullName}
                {...form.register("fullName")}
              />
              <FieldError>{errors.fullName?.message}</FieldError>
            </Field>
            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="profile-phone">Điện thoại</FieldLabel>
              <Input
                autoComplete="tel"
                id="profile-phone"
                aria-invalid={!!errors.phone}
                {...form.register("phone")}
              />
              <FieldError>{errors.phone?.message}</FieldError>
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="profile-email">Email</FieldLabel>
              <Input
                autoComplete="email"
                id="profile-email"
                readOnly
                value={email}
              />
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
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default PersonalInfoSection
