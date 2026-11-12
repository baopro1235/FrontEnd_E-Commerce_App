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

function LoginPage() {
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Chức năng đăng nhập chưa được kết nối.')
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
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    autoComplete="email"
                    id="email"
                    name="email"
                    placeholder="ban@example.com"
                    required
                    type="email"
                  />
                </Field>

                <Field>
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
                    name="password"
                    placeholder="Nhập mật khẩu"
                    required
                    type="password"
                  />
                </Field>
              </FieldGroup>

              <Button className="h-11 w-full" type="submit">
                Đăng nhập
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
