import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import '../auth-page.css'

function RegisterPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp.')
      return
    }

    setMessage('Chức năng đăng ký chưa được kết nối.')
  }

  return (
    <main className="auth-page">
      <section aria-labelledby="register-title" className="w-full max-w-3xl">
        <Card className="border-border/70 shadow-xl shadow-foreground/5">
          <CardHeader className="gap-2 pb-2 text-center">
            <h1 className="auth-title" id="register-title">
              Tạo tài khoản
            </h1>
            <CardDescription>
              Điền thông tin bên dưới để đăng ký thành viên Paintmart.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit}
            >
              <FieldGroup className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="phone">
                    Điện thoại <span aria-hidden="true">*</span>
                  </FieldLabel>
                  <Input
                    autoComplete="tel"
                    id="phone"
                    name="phone"
                    placeholder="090 123 4567"
                    required
                    type="tel"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    autoComplete="email"
                    id="email"
                    name="email"
                    placeholder="ban@example.com"
                    type="email"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="full-name">
                    Họ và tên <span aria-hidden="true">*</span>
                  </FieldLabel>
                  <Input
                    autoComplete="name"
                    id="full-name"
                    name="fullName"
                    placeholder="Nguyễn Văn An"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="city">
                    Tỉnh / Thành phố <span aria-hidden="true">*</span>
                  </FieldLabel>
                  <Input
                    autoComplete="address-level1"
                    id="city"
                    name="city"
                    placeholder="Tỉnh hoặc thành phố"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="district">
                    Quận / Huyện <span aria-hidden="true">*</span>
                  </FieldLabel>
                  <Input
                    autoComplete="address-level2"
                    id="district"
                    name="district"
                    placeholder="Quận hoặc huyện"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="ward">Phường / Xã</FieldLabel>
                  <Input
                    autoComplete="address-level3"
                    id="ward"
                    name="ward"
                    placeholder="Phường hoặc xã"
                  />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="address">
                    Địa chỉ <span aria-hidden="true">*</span>
                  </FieldLabel>
                  <Input
                    autoComplete="street-address"
                    id="address"
                    name="address"
                    placeholder="Số nhà, tên đường"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">
                    Mật khẩu <span aria-hidden="true">*</span>
                  </FieldLabel>
                  <Input
                    autoComplete="new-password"
                    id="password"
                    name="password"
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setMessage('')
                    }}
                    placeholder="Tạo mật khẩu"
                    required
                    type="password"
                  />
                </Field>

                <Field data-invalid={passwordsDoNotMatch || undefined}>
                  <FieldLabel htmlFor="confirm-password">
                    Xác nhận mật khẩu <span aria-hidden="true">*</span>
                  </FieldLabel>
                  <Input
                    aria-invalid={passwordsDoNotMatch}
                    autoComplete="new-password"
                    id="confirm-password"
                    name="confirmPassword"
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)
                      setMessage('')
                    }}
                    placeholder="Nhập lại mật khẩu"
                    required
                    type="password"
                  />
                </Field>
              </FieldGroup>

              <Button className="h-11 w-full" type="submit">
                Đăng ký
              </Button>

              <p
                aria-live="polite"
                className="min-h-5 text-center text-sm text-muted-foreground"
                role={passwordsDoNotMatch ? 'alert' : undefined}
              >
                {passwordsDoNotMatch
                  ? 'Mật khẩu xác nhận không khớp.'
                  : message}
              </p>
            </form>
          </CardContent>

          <CardFooter className="justify-center gap-1 border-t bg-muted/30 py-4 text-sm">
            <span className="text-muted-foreground">
              Đã có tài khoản?
            </span>
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
