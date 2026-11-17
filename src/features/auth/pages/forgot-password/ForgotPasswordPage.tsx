import { useState } from 'react'
import { ArrowLeft, Check, Mail, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'
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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import '../auth-page.css'

const steps = ['Email', 'Mã OTP', 'Hoàn tất']

function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')

  return (
    <main className="auth-page">
      <section aria-labelledby="forgot-password-title" className="w-full max-w-md">
        <Card className="border-border/70 shadow-xl shadow-foreground/5">
          <CardHeader className="gap-2 pb-2 text-center">
            <div
              aria-label={`Bước ${step} trên 3`}
              className="mb-3 flex items-center justify-center"
              role="group"
            >
              {steps.map((label, index) => {
                const stepNumber = index + 1
                const isComplete = stepNumber < step
                const isCurrent = stepNumber === step

                return (
                  <div className="flex items-center" key={label}>
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        aria-current={isCurrent ? 'step' : undefined}
                        className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                          isComplete || isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isComplete ? <Check aria-hidden="true" /> : stepNumber}
                      </span>
                      <span
                        className={`text-xs ${
                          isCurrent
                            ? 'font-medium text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`mb-5 h-px w-12 sm:w-16 ${
                          stepNumber < step ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <h1 className="auth-title" id="forgot-password-title">
              {step === 1
                ? 'Quên mật khẩu?'
                : step === 2
                  ? 'Nhập mã xác minh'
                  : 'Hoàn tất'}
            </h1>
            <CardDescription>
              {step === 1
                ? 'Nhập email đã đăng ký để bắt đầu khôi phục mật khẩu.'
                : step === 2
                  ? `Nhập mã OTP gồm 6 chữ số đã được gửi đến ${email}.`
                  : 'Bạn đã hoàn thành các bước trên giao diện khôi phục mật khẩu.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 1 && (
              <form
                className="flex flex-col gap-5"
                onSubmit={(event) => {
                  event.preventDefault()
                  setStep(2)
                }}
              >
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                    <Input
                      autoComplete="email"
                      autoFocus
                      id="forgot-email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="ban@example.com"
                      required
                      type="email"
                      value={email}
                    />
                    <FieldDescription>
                      Vui lòng sử dụng email bạn đã dùng để đăng ký.
                    </FieldDescription>
                  </Field>
                </FieldGroup>
                <Button className="h-11 w-full" type="submit">
                  Tiếp tục
                  <Mail aria-hidden="true" />
                </Button>
              </form>
            )}

            {step === 2 && (
              <form
                className="flex flex-col gap-5"
                onSubmit={(event) => {
                  event.preventDefault()
                  setStep(3)
                }}
              >
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="otp">Mã OTP</FieldLabel>
                    <Input
                      autoComplete="one-time-code"
                      autoFocus
                      id="otp"
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="••••••"
                      required
                      title="Vui lòng nhập mã OTP gồm 6 chữ số."
                      type="text"
                    />
                    <FieldDescription>
                      Nhập mã gồm 6 chữ số để tiếp tục.
                    </FieldDescription>
                  </Field>
                </FieldGroup>
                <Button className="h-11 w-full" type="submit">
                  Xác nhận
                  <ShieldCheck aria-hidden="true" />
                </Button>
              </form>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center gap-5 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check aria-hidden="true" className="size-7" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Giao diện khôi phục đã hoàn tất. Tính năng gửi OTP và đặt lại
                  mật khẩu sẽ được kết nối sau.
                </p>
                <Link
                  className={buttonVariants({ className: 'h-11 w-full' })}
                  to="/login"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            )}
          </CardContent>

          {step < 3 && (
            <CardFooter className="justify-center gap-1 border-t bg-muted/30 py-4 text-sm">
              {step === 2 ? (
                <Button
                  className="h-auto p-0 text-muted-foreground"
                  onClick={() => setStep(1)}
                  variant="link"
                >
                  <ArrowLeft aria-hidden="true" />
                  Đổi email
                </Button>
              ) : (
                <>
                  <span className="text-muted-foreground">
                    Nhớ lại mật khẩu?
                  </span>
                  <Link
                    className={buttonVariants({
                      variant: 'link',
                      size: 'sm',
                    })}
                    to="/login"
                  >
                    Đăng nhập
                  </Link>
                </>
              )}
            </CardFooter>
          )}
        </Card>
      </section>
    </main>
  )
}

export default ForgotPasswordPage
