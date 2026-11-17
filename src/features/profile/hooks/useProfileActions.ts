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
import { addressApi, type Province, type Ward } from "@/services/addressApi"

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
  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("")
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true)
  const [isLoadingWards, setIsLoadingWards] = useState(false)
  const [provinceError, setProvinceError] = useState("")
  const [wardError, setWardError] = useState("")
  const [provinceRetryCount, setProvinceRetryCount] = useState(0)
  const [wardRetryCount, setWardRetryCount] = useState(0)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phone: "" },
    mode: "onTouched",
  })
  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "Nhà riêng",
      streetAddress: "",
      provinceCode: "",
      wardCode: "",
    },
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

  useEffect(() => {
    const controller = new AbortController()

    async function loadProvinces() {
      setIsLoadingProvinces(true)
      setProvinceError("")

      try {
        setProvinces(await addressApi.getProvinces(controller.signal))
      } catch (error) {
        if (!controller.signal.aborted) {
          setProvinceError(
            `Không thể tải danh sách tỉnh/thành phố: ${getErrorMessage(error)}`,
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingProvinces(false)
        }
      }
    }

    void loadProvinces()
    return () => controller.abort()
  }, [provinceRetryCount])

  useEffect(() => {
    if (!selectedProvinceCode) {
      return
    }

    const controller = new AbortController()

    async function loadWards() {
      setIsLoadingWards(true)
      setWardError("")

      try {
        setWards(
          await addressApi.getWards(
            Number(selectedProvinceCode),
            controller.signal,
          ),
        )
      } catch (error) {
        if (!controller.signal.aborted) {
          setWardError(
            `Không thể tải danh sách phường/xã: ${getErrorMessage(error)}`,
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingWards(false)
        }
      }
    }

    void loadWards()
    return () => controller.abort()
  }, [selectedProvinceCode, wardRetryCount])

  function handleProvinceChange(provinceCode: string) {
    setSelectedProvinceCode(provinceCode)
    addressForm.setValue("wardCode", "", {
      shouldDirty: true,
      shouldValidate: true,
    })
    setWards([])
    setWardError("")
    setIsLoadingWards(false)
    setWardRetryCount(0)
  }

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
    addressForm.reset({
      label: "Nhà riêng",
      streetAddress: "",
      provinceCode: "",
      wardCode: "",
    })
    setSelectedProvinceCode("")
    setWards([])
    setWardError("")
    setIsLoadingWards(false)
    setIsAddressFormOpen(true)
  }

  function openEditAddressForm(address: UserAddress) {
    setEditingAddressId(address.id)
    setAddressError("")
    const provinceCode = String(address.provinceCode ?? "")
    addressForm.reset({
      label: address.label,
      streetAddress: address.streetAddress ?? address.street,
      provinceCode,
      wardCode: String(address.wardCode ?? ""),
    })
    if (provinceCode !== selectedProvinceCode) {
      setWards([])
      setWardError("")
    }
    setSelectedProvinceCode(provinceCode)
    if (!provinceCode) {
      setIsLoadingWards(false)
    }
    setIsAddressFormOpen(true)
  }

  function closeAddressForm() {
    setIsAddressFormOpen(false)
    setEditingAddressId(null)
  }

  async function saveAddress(data: AddressForm) {
    setAddressError("")
    setAddressMessage("")

    const province = provinces.find(
      (item) => item.code === Number(data.provinceCode),
    )
    const ward = data.wardCode
      ? wards.find((item) => item.code === Number(data.wardCode))
      : undefined

    if (!province) {
      addressForm.setError("provinceCode", {
        type: "validate",
        message: "Vui lòng chọn tỉnh/thành phố hợp lệ.",
      })
      return
    }

    if (data.wardCode && !ward) {
      addressForm.setError("wardCode", {
        type: "validate",
        message: "Vui lòng chọn phường/xã hợp lệ.",
      })
      return
    }

    const address = {
      label: data.label,
      streetAddress: data.streetAddress,
      provinceCode: province.code,
      provinceName: province.name,
      wardCode: ward?.code,
      wardName: ward?.name,
      street: [data.streetAddress, ward?.name, province.name]
        .filter(Boolean)
        .join(", "),
    }

    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, address)
        setAddressMessage("Địa chỉ đã được cập nhật.")
      } else {
        await addAddress(address)
        setAddressMessage("Đã thêm địa chỉ giao hàng.")
      }
      closeAddressForm()
      addressForm.reset({
        label: "Nhà riêng",
        streetAddress: "",
        provinceCode: "",
        wardCode: "",
      })
      setSelectedProvinceCode("")
      setWards([])
      setIsLoadingWards(false)
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
    provinces,
    wards,
    selectedProvinceCode,
    isLoadingProvinces,
    isLoadingWards,
    provinceError,
    wardError,
    passwordMessage,
    passwordError,
    isAddressFormOpen,
    editingAddressId,
    openNewAddressForm,
    openEditAddressForm,
    closeAddressForm,
    handleProvinceChange,
    retryProvinces: () => setProvinceRetryCount((count) => count + 1),
    retryWards: () => setWardRetryCount((count) => count + 1),
    saveProfile,
    saveAddress,
    chooseDefaultAddress,
    deleteAddress,
    savePassword,
  }
}
