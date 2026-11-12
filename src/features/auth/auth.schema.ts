import { z } from "zod"

export const registerSchema = z
  .object({
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
        z
          .string()
          .regex(/^(0\d{9}|\+84\d{9})$/, "Số điện thoại không hợp lệ"),
      ),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Vui lòng nhập email")
      .max(254, "Email quá dài")
      .email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 ký tự")
      .max(64, "Mật khẩu không được vượt quá 64 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    provinceCode: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
    district: z
      .string()
      .trim()
      .min(2, "Vui lòng nhập quận/huyện")
      .max(100, "Tên quận/huyện quá dài"),
    wardCode: z.string(),
    streetAddress: z
      .string()
      .trim()
      .min(5, "Vui lòng nhập địa chỉ cụ thể")
      .max(255, "Địa chỉ quá dài"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>

export interface RegistrationAddress {
  provinceCode: number
  provinceName: string
  district: string
  wardCode?: number
  wardName?: string
  streetAddress: string
}

export interface UserAddress {
  id: string
  label: string
  street: string
  isDefault: boolean
  provinceCode?: number
  provinceName?: string
  district?: string
  wardCode?: number
  wardName?: string
  streetAddress?: string
}

export interface AuthUser {
  id: string
  fullName: string
  email: string
  phone: string
  addresses: UserAddress[]
}

export interface RegisterAccountInput {
  fullName: string
  email: string
  password: string
  phone: string
  address: RegistrationAddress
}
