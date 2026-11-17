import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { useLoginActions } from '@/features/auth/hooks/useAuthActions'
import '../auth-page.css'

function LoginPage() {
  const location = useLocation()
  const { logoutPending, clearLogoutPending } = useAuth()
  const requiresLogin =
    (location.state as { requiresLogin?: boolean } | null)?.requiresLogin ===
    true
  const { form, message, handleLogin } = useLoginActions()

  useEffect(() => {
    if (logoutPending) clearLogoutPending()
  }, [clearLogoutPending, logoutPending])

  return (
    <main className="auth-page">
      <section aria-labelledby="login-title" className="w-full max-w-md">
        <Card className="border-border/70 shadow-xl shadow-foreground/5">
          <CardHeader className="gap-2 pb-2 text-center">
            <h1 className="auth-title" id="login-title">
              Đăng nhập
            </h1>
            <CardDescription>
              Chào mừng bạn quay trở lại Paintmart.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {requiresLogin && (
              <p
                className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
                role="alert"
              >
                Vui lòng đăng nhập để truy cập trang này.
              </p>
            )}
            <form
              className="flex flex-col gap-5"
              onSubmit={form.handleSubmit(handleLogin)}
              noValidate
            >
              <FieldGroup>
                <Field data-invalid={!!form.formState.errors.email}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    autoComplete="email"
                    id="email"
                    placeholder="ban@example.com"
                    type="email"
                    aria-invalid={!!form.formState.errors.email}
                    {...form.register('email')}
                  />
                  <FieldError>{form.formState.errors.email?.message}</FieldError>
                </Field>

                <Field data-invalid={!!form.formState.errors.password}>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                    <Link
                      className="h-auto p-0 text-muted-foreground"
                      to="/forgot-password"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <Input
                    autoComplete="current-password"
                    id="password"
                    placeholder="Nhập mật khẩu"
                    type="password"
                    aria-invalid={!!form.formState.errors.password}
                    {...form.register('password')}
                  />
                  <FieldError>
                    {form.formState.errors.password?.message}
                  </FieldError>
                </Field>
              </FieldGroup>

              <Button
                className="h-11 w-full"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>

              <p
                aria-live="polite"
                className="min-h-5 text-center text-sm text-muted-foreground"
                id="login-message"
              >
                {message}
              </p>
            </form>
          </CardContent>

          <CardFooter className="justify-center gap-1 border-t bg-muted/30 py-4 text-sm">
            <span className="text-muted-foreground">Chưa có tài khoản?</span>
            <Link
              className={buttonVariants({ variant: 'link', size: 'sm' })}
              to="/register"
            >
              Đăng ký
            </Link>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}

export default LoginPage
