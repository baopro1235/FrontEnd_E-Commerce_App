import { Controller } from 'react-hook-form'
import { Link } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRegisterActions } from '@/features/auth/hooks/useRegisterActions'
import '../auth-page.css'

function RegisterPage() {
  const {
    form,
    provinces,
    wards,
    selectedProvinceCode,
    isLoadingProvinces,
    isLoadingWards,
    provinceError,
    wardError,
    successMessage,
    handleProvinceChange,
    retryProvinces,
    retryWards,
    onSubmit,
  } = useRegisterActions()
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = form

  return (
    <main className="auth-page">
      <section aria-labelledby="register-title" className="w-full max-w-3xl">
        <Card className="border-border/70 shadow-xl shadow-foreground/5">
          <CardHeader className="gap-2 pb-2 text-center">
            <h1 className="auth-title" id="register-title">
              Đăng ký
            </h1>
          </CardHeader>

          <CardContent>
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <FieldGroup className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                <Field data-invalid={!!errors.phone}>
                  <FieldLabel htmlFor="phone">
                    Điện thoại
                    <span aria-hidden="true" className="text-destructive">
                      (*)
                    </span>
                  </FieldLabel>
                  <Input
                    autoComplete="tel"
                    id="phone"
                    placeholder="090 123 4567"
                    aria-invalid={!!errors.phone}
                    {...register('phone')}
                  />
                  <FieldError>{errors.phone?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email">
                    Email
                    <span aria-hidden="true" className="text-destructive">
                      (*)
                    </span>
                  </FieldLabel>
                  <Input
                    autoComplete="email"
                    id="email"
                    placeholder="ban@example.com"
                    type="email"
                    aria-invalid={!!errors.email}
                    {...register('email')}
                  />
                  <FieldError>{errors.email?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.fullName}>
                  <FieldLabel htmlFor="full-name">
                    Họ và tên
                    <span aria-hidden="true" className="text-destructive">
                      (*)
                    </span>
                  </FieldLabel>
                  <Input
                    autoComplete="name"
                    id="full-name"
                    placeholder="Nguyễn Văn An"
                    aria-invalid={!!errors.fullName}
                    {...register('fullName')}
                  />
                  <FieldError>{errors.fullName?.message}</FieldError>
                </Field>

                <Controller
                  control={control}
                  name="provinceCode"
                  render={({ field }) => (
                    <Field data-invalid={!!errors.provinceCode}>
                      <FieldLabel htmlFor="city">
                        Tỉnh / Thành phố
                        <span aria-hidden="true" className="text-destructive">
                          (*)
                        </span>
                      </FieldLabel>
                      <Select
                        items={provinces.map((province) => ({
                          label: province.name,
                          value: String(province.code),
                        }))}
                        name={field.name}
                        onValueChange={(value) => {
                          const nextProvinceCode = value ?? ''
                          field.onChange(nextProvinceCode)
                          handleProvinceChange(nextProvinceCode)
                        }}
                        required
                        value={field.value || null}
                      >
                        <SelectTrigger
                          aria-describedby="city-status"
                          aria-invalid={!!errors.provinceCode}
                          className="w-full"
                          disabled={isLoadingProvinces || !!provinceError}
                          id="city"
                          onBlur={field.onBlur}
                          ref={field.ref}
                        >
                          <SelectValue placeholder="Chọn tỉnh / thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {provinces.map((province) => (
                              <SelectItem
                                key={province.code}
                                value={String(province.code)}
                              >
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FieldDescription
                        aria-live="polite"
                        className={
                          provinceError ? 'text-destructive' : undefined
                        }
                        id="city-status"
                      >
                        {isLoadingProvinces
                          ? 'Đang tải tỉnh/thành phố...'
                          : provinceError && (
                              <>
                                {provinceError}{' '}
                                <Button
                                  className="h-auto p-0"
                                  onClick={retryProvinces}
                                  size="sm"
                                  type="button"
                                  variant="link"
                                >
                                  Thử lại
                                </Button>
                              </>
                            )}
                      </FieldDescription>
                      <FieldError>{errors.provinceCode?.message}</FieldError>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="wardCode"
                  render={({ field }) => (
                    <Field data-invalid={!!errors.wardCode}>
                      <FieldLabel htmlFor="ward">Phường / Xã</FieldLabel>
                      <Select
                        items={wards.map((ward) => ({
                          label: ward.name,
                          value: String(ward.code),
                        }))}
                        name={field.name}
                        onValueChange={(value) => field.onChange(value ?? '')}
                        value={field.value || null}
                      >
                        <SelectTrigger
                          aria-describedby="ward-status"
                          aria-invalid={!!errors.wardCode}
                          className="w-full"
                          disabled={
                            !selectedProvinceCode ||
                            isLoadingWards ||
                            !!wardError
                          }
                          id="ward"
                          onBlur={field.onBlur}
                          ref={field.ref}
                        >
                          <SelectValue
                            placeholder={
                              !selectedProvinceCode
                                ? 'Chọn tỉnh/thành phố trước'
                                : 'Chọn phường / xã'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {wards.map((ward) => (
                              <SelectItem
                                key={ward.code}
                                value={String(ward.code)}
                              >
                                {ward.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FieldDescription
                        aria-live="polite"
                        className={wardError ? 'text-destructive' : undefined}
                        id="ward-status"
                      >
                        {isLoadingWards
                          ? 'Đang tải phường/xã...'
                          : wardError && (
                              <>
                                {wardError}{' '}
                                <Button
                                  className="h-auto p-0"
                                  onClick={retryWards}
                                  size="sm"
                                  type="button"
                                  variant="link"
                                >
                                  Thử lại
                                </Button>
                              </>
                            )}
                      </FieldDescription>
                      <FieldError>{errors.wardCode?.message}</FieldError>
                    </Field>
                  )}
                />

                <Field
                  className="md:col-span-2"
                  data-invalid={!!errors.streetAddress}
                >
                  <FieldLabel htmlFor="street-address">
                    Địa chỉ
                    <span aria-hidden="true" className="text-destructive">
                      (*)
                    </span>
                  </FieldLabel>
                  <Input
                    autoComplete="street-address"
                    id="street-address"
                    placeholder="Số nhà, tên đường"
                    aria-invalid={!!errors.streetAddress}
                    {...register('streetAddress')}
                  />
                  <FieldError>{errors.streetAddress?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="password">
                    Mật khẩu
                    <span aria-hidden="true" className="text-destructive">
                      (*)
                    </span>
                  </FieldLabel>
                  <Input
                    autoComplete="new-password"
                    id="password"
                    placeholder="Tạo mật khẩu"
                    type="password"
                    aria-invalid={!!errors.password}
                    {...register('password')}
                  />
                  <FieldError>{errors.password?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.confirmPassword}>
                  <FieldLabel htmlFor="confirm-password">
                    Xác nhận mật khẩu
                    <span aria-hidden="true" className="text-destructive">
                      (*)
                    </span>
                  </FieldLabel>
                  <Input
                    autoComplete="new-password"
                    id="confirm-password"
                    placeholder="Nhập lại mật khẩu"
                    type="password"
                    aria-invalid={!!errors.confirmPassword}
                    {...register('confirmPassword')}
                  />
                  <FieldError>{errors.confirmPassword?.message}</FieldError>
                </Field>
              </FieldGroup>

              {errors.root?.server?.message && (
                <p aria-live="polite" className="text-sm text-destructive">
                  {errors.root.server.message}
                </p>
              )}
              {successMessage && (
                <p aria-live="polite" className="text-sm text-center text-primary">
                  {successMessage}
                </p>
              )}

              <Button
                className="h-11 w-full"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center gap-1 border-t bg-muted/30 py-4 text-sm">
            <span className="text-muted-foreground">Đã có tài khoản?</span>
            <Link
              className={buttonVariants({ variant: 'link', size: 'sm' })}
              to="/login"
            >
              Đăng nhập
            </Link>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}

export default RegisterPage
