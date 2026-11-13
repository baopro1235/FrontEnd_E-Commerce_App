import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định."
}

export function useProfileActions() {
  const {
    user,
    logout,
    updateUser,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    changePassword,
  } = useAuth()
  const [profileMessage, setProfileMessage] = useState("")
  const [profileError, setProfileError] = useState("")
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
  const resetProfileForm = profileForm.reset

  useEffect(() => {
    resetProfileForm({
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
    })
  }, [resetProfileForm, user?.fullName, user?.phone])

  async function saveProfile(data: ProfileForm) {
    setProfileMessage("")
    setProfileError("")
    try {
      await updateUser(data)
      setProfileMessage("Thông tin cá nhân đã được cập nhật.")
    } catch (error) {
      setProfileError(getErrorMessage(error))
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

  function closeAddressForm() {
    setIsAddressFormOpen(false)
    setEditingAddressId(null)
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
      closeAddressForm()
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

  return {
    user,
    logout,
    profileForm,
    addressForm,
    passwordForm,
    profileMessage,
    profileError,
    addressMessage,
    addressError,
    passwordMessage,
    passwordError,
    isAddressFormOpen,
    editingAddressId,
    openNewAddressForm,
    openEditAddressForm,
    closeAddressForm,
    saveProfile,
    saveAddress,
    chooseDefaultAddress,
    deleteAddress,
    savePassword,
  }
}
