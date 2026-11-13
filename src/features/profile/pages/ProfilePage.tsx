import { zodResolver } from "@hookform/resolvers/zod"
import {
  Check,
  ChevronRight,
  LockKeyhole,
  LogOut,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, Navigate, useNavigate } from "react-router"
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
import { useAuth } from "@/context/AuthContext"
import type { UserAddress } from "@/features/auth/auth.schema"
import {
  addressSchema,
  passwordSchema,
  profileSchema,
  type AddressForm,
  type PasswordForm,
  type ProfileForm,
} from "@/features/profile/profile.schema"
import "./profile-page.css"

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định."
}

function ProfilePage() {
  const { user, logout, updateUser, addAddress, updateAddress, removeAddress, setDefaultAddress, changePassword } =
    useAuth()
  const navigate = useNavigate()
  const [profileMessage, setProfileMessage] = useState("")
  const [addressMessage, setAddressMessage] = useState("")
  const [addressError, setAddressError] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phone: "" },
    mode: "onTouched",
  })
  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: "Nhà riêng", street: "" },
    mode: "onTouched",
  })
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  })

  useEffect(() => {
    profileForm.reset({
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
    })
  }, [profileForm, user?.fullName, user?.phone])

  if (!user) {
    return <Navigate replace to="/login" />
  }

  async function saveProfile(data: ProfileForm) {
    setProfileMessage("")
    try {
      await updateUser(data)
      setProfileMessage("Thông tin cá nhân đã được cập nhật.")
    } catch (error) {
      profileForm.setError("root.server", {
        type: "server",
        message: getErrorMessage(error),
      })
    }
  }

  function openNewAddressForm() {
    setEditingAddressId(null)
    setAddressError("")
    addressForm.reset({ label: "Nhà riêng", street: "" })
    setIsAddressFormOpen(true)
  }

  function openEditAddressForm(address: UserAddress) {
    setEditingAddressId(address.id)
    setAddressError("")
    addressForm.reset({ label: address.label, street: address.street })
    setIsAddressFormOpen(true)
  }

  async function saveAddress(data: AddressForm) {
    setAddressError("")
    setAddressMessage("")
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, data)
        setAddressMessage("Địa chỉ đã được cập nhật.")
      } else {
        await addAddress(data)
        setAddressMessage("Đã thêm địa chỉ giao hàng.")
      }
      setIsAddressFormOpen(false)
      setEditingAddressId(null)
      addressForm.reset({ label: "Nhà riêng", street: "" })
    } catch (error) {
      setAddressError(getErrorMessage(error))
    }
  }

  async function chooseDefaultAddress(addressId: string) {
    setAddressMessage("")
    setAddressError("")
    try {
      await setDefaultAddress(addressId)
      setAddressMessage("Đã cập nhật địa chỉ mặc định.")
    } catch (error) {
      setAddressError(getErrorMessage(error))
    }
  }

  async function deleteAddress(address: UserAddress) {
    if (!window.confirm(`Xóa địa chỉ "${address.label}"?`)) {
      return
    }

    setAddressMessage("")
    setAddressError("")
    try {
      await removeAddress(address.id)
      setAddressMessage("Địa chỉ đã được xóa.")
    } catch (error) {
      setAddressError(getErrorMessage(error))
    }
  }

  async function savePassword(data: PasswordForm) {
    setPasswordError("")
    setPasswordMessage("")
    try {
      await changePassword(data.currentPassword, data.newPassword)
      passwordForm.reset()
      setPasswordMessage("Mật khẩu đã được thay đổi.")
    } catch (error) {
      setPasswordError(getErrorMessage(error))
    }
  }

  function signOut() {
    logout()
    navigate("/login", { replace: true })
  }

  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("vi")

  return (
    <main className="profile-page">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:py-12">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <Link
              className="flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              to="/"
            >
              Paintmart <ChevronRight aria-hidden="true" /> Tài khoản
            </Link>
            <h1 className="profile-title">Hồ sơ của tôi</h1>
            <p className="text-sm text-muted-foreground">
              Quản lý thông tin cá nhân, địa chỉ giao hàng và bảo mật tài khoản.
            </p>
          </div>
          <Button
            className="w-fit"
            onClick={signOut}
            type="button"
            variant="outline"
          >
            <LogOut aria-hidden="true" data-icon="inline-start" />
            Đăng xuất
          </Button>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <Card>
              <CardContent className="flex items-center gap-4 pt-4">
                <div
                  aria-hidden="true"
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {user.fullName}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            <nav aria-label="Điều hướng hồ sơ">
              <Card>
                <CardContent className="flex flex-col gap-1 p-2">
                  <a className="profile-nav-link" href="#personal-info">
                    <UserRound aria-hidden="true" />
                    Thông tin cá nhân
                  </a>
                  <a className="profile-nav-link" href="#shipping-addresses">
                    <MapPin aria-hidden="true" />
                    Địa chỉ giao hàng
                  </a>
                  <a className="profile-nav-link" href="#security">
                    <LockKeyhole aria-hidden="true" />
                    Bảo mật
                  </a>
                </CardContent>
              </Card>
            </nav>
          </aside>

          <div className="flex min-w-0 flex-col gap-6">
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
                  onSubmit={profileForm.handleSubmit(saveProfile)}
                >
                  <FieldGroup className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                    <Field data-invalid={!!profileForm.formState.errors.fullName}>
                      <FieldLabel htmlFor="profile-name">Họ và tên</FieldLabel>
                      <Input
                        autoComplete="name"
                        id="profile-name"
                        aria-invalid={!!profileForm.formState.errors.fullName}
                        {...profileForm.register("fullName")}
                      />
                      <FieldError>
                        {profileForm.formState.errors.fullName?.message}
                      </FieldError>
                    </Field>
                    <Field data-invalid={!!profileForm.formState.errors.phone}>
                      <FieldLabel htmlFor="profile-phone">Điện thoại</FieldLabel>
                      <Input
                        autoComplete="tel"
                        id="profile-phone"
                        aria-invalid={!!profileForm.formState.errors.phone}
                        {...profileForm.register("phone")}
                      />
                      <FieldError>
                        {profileForm.formState.errors.phone?.message}
                      </FieldError>
                    </Field>
                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="profile-email">Email</FieldLabel>
                      <Input
                        autoComplete="email"
                        id="profile-email"
                        readOnly
                        value={user.email}
                      />
                    </Field>
                  </FieldGroup>
                  {profileForm.formState.errors.root?.server?.message && (
                    <p aria-live="polite" className="text-sm text-destructive">
                      {profileForm.formState.errors.root.server.message}
                    </p>
                  )}
                  {profileMessage && (
                    <p aria-live="polite" className="text-sm text-primary">
                      {profileMessage}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <Button
                      disabled={profileForm.formState.isSubmitting}
                      type="submit"
                    >
                      {profileForm.formState.isSubmitting
                        ? "Đang lưu..."
                        : "Lưu thay đổi"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card id="shipping-addresses" className="scroll-mt-6">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <CardTitle>Địa chỉ giao hàng</CardTitle>
                  <CardDescription>
                    Quản lý các địa chỉ nhận hàng của bạn.
                  </CardDescription>
                </div>
                {!isAddressFormOpen && (
                  <Button onClick={openNewAddressForm} type="button" variant="outline">
                    <Plus aria-hidden="true" data-icon="inline-start" />
                    Thêm địa chỉ
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {addressError && (
                  <p aria-live="polite" className="text-sm text-destructive">
                    {addressError}
                  </p>
                )}
                {addressMessage && (
                  <p aria-live="polite" className="text-sm text-primary">
                    {addressMessage}
                  </p>
                )}

                {isAddressFormOpen && (
                  <form
                    className="flex flex-col gap-5 rounded-xl border bg-muted/20 p-4"
                    noValidate
                    onSubmit={addressForm.handleSubmit(saveAddress)}
                  >
                    <h3 className="font-medium text-foreground">
                      {editingAddressId ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
                    </h3>
                    <FieldGroup className="grid gap-4 sm:grid-cols-2">
                      <Field data-invalid={!!addressForm.formState.errors.label}>
                        <FieldLabel htmlFor="address-label">Tên địa chỉ</FieldLabel>
                        <Input
                          id="address-label"
                          placeholder="Nhà riêng, công ty..."
                          aria-invalid={!!addressForm.formState.errors.label}
                          {...addressForm.register("label")}
                        />
                        <FieldError>
                          {addressForm.formState.errors.label?.message}
                        </FieldError>
                      </Field>
                      <Field data-invalid={!!addressForm.formState.errors.street}>
                        <FieldLabel htmlFor="address-street">
                          Địa chỉ chi tiết
                        </FieldLabel>
                        <Input
                          autoComplete="street-address"
                          id="address-street"
                          placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
                          aria-invalid={!!addressForm.formState.errors.street}
                          {...addressForm.register("street")}
                        />
                        <FieldError>
                          {addressForm.formState.errors.street?.message}
                        </FieldError>
                      </Field>
                    </FieldGroup>
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => setIsAddressFormOpen(false)}
                        type="button"
                        variant="ghost"
                      >
                        Hủy
                      </Button>
                      <Button
                        disabled={addressForm.formState.isSubmitting}
                        type="submit"
                      >
                        {addressForm.formState.isSubmitting
                          ? "Đang lưu..."
                          : "Lưu địa chỉ"}
                      </Button>
                    </div>
                  </form>
                )}

                {user.addresses.length === 0 ? (
                  <div className="rounded-xl border border-dashed px-5 py-8 text-center">
                    <MapPin
                      aria-hidden="true"
                      className="mx-auto mb-2 text-muted-foreground"
                    />
                    <p className="font-medium text-foreground">
                      Bạn chưa lưu địa chỉ nào
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Thêm địa chỉ để thuận tiện hơn khi đặt hàng.
                    </p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {user.addresses.map((address) => (
                      <li
                        className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between"
                        key={address.id}
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <MapPin
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-muted-foreground"
                          />
                          <div className="flex min-w-0 flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-foreground">
                                {address.label}
                              </p>
                              {address.isDefault && (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="break-words text-sm text-muted-foreground">
                              {address.street}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-1 sm:justify-end">
                          {!address.isDefault && (
                            <Button
                              className="text-muted-foreground"
                              onClick={() => void chooseDefaultAddress(address.id)}
                              size="sm"
                              type="button"
                              variant="ghost"
                            >
                              <Check aria-hidden="true" data-icon="inline-start" />
                              Đặt mặc định
                            </Button>
                          )}
                          <Button
                            aria-label={`Sửa địa chỉ ${address.label}`}
                            onClick={() => openEditAddressForm(address)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <Pencil aria-hidden="true" />
                          </Button>
                          <Button
                            aria-label={`Xóa địa chỉ ${address.label}`}
                            className="text-destructive hover:text-destructive"
                            onClick={() => void deleteAddress(address)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2 aria-hidden="true" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card id="security" className="scroll-mt-6">
              <CardHeader>
                <CardTitle>Bảo mật</CardTitle>
                <CardDescription>
                  Dùng mật khẩu mạnh và không chia sẻ mật khẩu với người khác.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="flex flex-col gap-5"
                  noValidate
                  onSubmit={passwordForm.handleSubmit(savePassword)}
                >
                  <FieldGroup className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                    <Field
                      className="sm:col-span-2"
                      data-invalid={!!passwordForm.formState.errors.currentPassword}
                    >
                      <FieldLabel htmlFor="current-password">
                        Mật khẩu hiện tại
                      </FieldLabel>
                      <Input
                        autoComplete="current-password"
                        id="current-password"
                        type="password"
                        aria-invalid={
                          !!passwordForm.formState.errors.currentPassword
                        }
                        {...passwordForm.register("currentPassword")}
                      />
                      <FieldError>
                        {passwordForm.formState.errors.currentPassword?.message}
                      </FieldError>
                    </Field>
                    <Field data-invalid={!!passwordForm.formState.errors.newPassword}>
                      <FieldLabel htmlFor="new-password">Mật khẩu mới</FieldLabel>
                      <Input
                        autoComplete="new-password"
                        id="new-password"
                        type="password"
                        aria-invalid={!!passwordForm.formState.errors.newPassword}
                        {...passwordForm.register("newPassword")}
                      />
                      <FieldError>
                        {passwordForm.formState.errors.newPassword?.message}
                      </FieldError>
                    </Field>
                    <Field
                      data-invalid={!!passwordForm.formState.errors.confirmPassword}
                    >
                      <FieldLabel htmlFor="confirm-new-password">
                        Xác nhận mật khẩu mới
                      </FieldLabel>
                      <Input
                        autoComplete="new-password"
                        id="confirm-new-password"
                        type="password"
                        aria-invalid={
                          !!passwordForm.formState.errors.confirmPassword
                        }
                        {...passwordForm.register("confirmPassword")}
                      />
                      <FieldError>
                        {passwordForm.formState.errors.confirmPassword?.message}
                      </FieldError>
                    </Field>
                  </FieldGroup>
                  {passwordError && (
                    <p aria-live="polite" className="text-sm text-destructive">
                      {passwordError}
                    </p>
                  )}
                  {passwordMessage && (
                    <p aria-live="polite" className="text-sm text-primary">
                      {passwordMessage}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <Button
                      disabled={passwordForm.formState.isSubmitting}
                      type="submit"
                    >
                      {passwordForm.formState.isSubmitting
                        ? "Đang cập nhật..."
                        : "Đổi mật khẩu"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
