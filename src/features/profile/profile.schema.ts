import { z } from "zod"

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên quá dài"),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .pipe(
      z.string().regex(/^(0\d{9}|\+84\d{9})$/, "Số điện thoại không hợp lệ"),
    ),
})

export const addressSchema = z.object({
  label: z.string().trim().min(2, "Vui lòng nhập tên địa chỉ").max(50),
  streetAddress: z
    .string()
    .trim()
    .min(5, "Vui lòng nhập địa chỉ cụ thể")
    .max(255),
  provinceCode: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  wardCode: z.string(),
})

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu mới cần ít nhất 8 ký tự")
      .max(64, "Mật khẩu không được vượt quá 64 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })

export type ProfileForm = z.infer<typeof profileSchema>
export type AddressForm = z.infer<typeof addressSchema>
export type PasswordForm = z.infer<typeof passwordSchema>