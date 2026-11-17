interface PasswordStrengthProps {
  password: string
}

export default function PasswordStrength({
  password,
}: PasswordStrengthProps) {
  if (!password) return null

  const checks = [
    ["Ít nhất 8 ký tự", password.length >= 8],
    ["Có chữ hoa", /\p{Lu}/u.test(password)],
    ["Có chữ thường", /\p{Ll}/u.test(password)],
    ["Có chữ số", /\p{N}/u.test(password)],
    ["Có ký tự đặc biệt", /[^\p{L}\p{N}]/u.test(password)],
  ] as const
  const score = checks.filter(([, passed]) => passed).length
  const strength = score === 5 ? "Mạnh" : score >= 3 ? "Trung bình" : "Yếu"
  const strengthTokens =
    score === 5
      ? { text: "text-password-strong", fill: "bg-password-strong" }
      : score >= 3
        ? { text: "text-password-medium", fill: "bg-password-medium" }
        : { text: "text-password-weak", fill: "bg-password-weak" }

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div
        aria-label={`Độ mạnh mật khẩu: ${strength}`}
        aria-valuemax={5}
        aria-valuemin={0}
        aria-valuenow={score}
        aria-valuetext={`${strength}, ${score}/5 tiêu chí`}
        className="flex gap-1"
        role="meter"
      >
        {checks.map(([label], index) => (
          <span
            aria-hidden="true"
            className={`h-1.5 flex-1 rounded-full ${
              index < score ? strengthTokens.fill : "bg-muted"
            }`}
            key={label}
          />
        ))}
      </div>
      <p aria-live="polite" className={strengthTokens.text}>
        Độ mạnh mật khẩu: {strength}
      </p>
      <ul className="grid gap-x-4 gap-y-1 text-xs sm:grid-cols-2">
        {checks.map(([label, passed]) => (
          <li
            className={
              passed ? "text-password-strong" : "text-muted-foreground"
            }
            key={label}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
