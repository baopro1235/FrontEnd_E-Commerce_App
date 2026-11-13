import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
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
import '../auth-page.css'

const loginSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginPage() {
  const [message, setMessage] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  })

  async function handleLogin(data: LoginForm) {
    setMessage('')
    try {
      await login(data)
      navigate('/profile', { replace: true })
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi không xác định.',
      )
    }
  }

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
                    <Button
                      className="h-auto p-0 text-muted-foreground"
                      onClick={() =>
                        setMessage('Chức năng khôi phục mật khẩu chưa được kết nối.')
                      }
                      size="sm"
                      type="button"
                      variant="link"
                    >
                      Quên mật khẩu?
                    </Button>
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
