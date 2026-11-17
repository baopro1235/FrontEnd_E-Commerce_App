import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useAuth } from "@/context/AuthContext"
import {
  loginSchema,
  type LoginForm,
  registerSchema,
  type RegisterInput,
} from "@/features/auth/auth.schema"
import { addressApi, type Province, type Ward } from "@/services/addressApi"

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Đã xảy ra lỗi không xác định."
}

export function useLoginActions() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  })

  async function handleLogin(data: LoginForm) {
    setMessage("")
    try {
      await login(data)
      navigate("/profile", { replace: true })
    } catch (error) {
      setMessage(getErrorMessage(error))
    }
  }

  function handleForgotPassword() {
    setMessage("Chức năng khôi phục mật khẩu chưa được kết nối.")
  }

  return { form, message, handleLogin, handleForgotPassword }
}

export function useRegisterActions() {
  const { register: registerUser } = useAuth()
  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("")
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true)
  const [isLoadingWards, setIsLoadingWards] = useState(false)
  const [provinceError, setProvinceError] = useState("")
  const [wardError, setWardError] = useState("")
  const [provinceRetryCount, setProvinceRetryCount] = useState(0)
  const [wardRetryCount, setWardRetryCount] = useState(0)
  const [successMessage, setSuccessMessage] = useState("")
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      provinceCode: "",
      wardCode: "",
      streetAddress: "",
    },
    mode: "onTouched",
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadProvinces() {
      setIsLoadingProvinces(true)
      setProvinceError("")

      try {
        const data = await addressApi.getProvinces(controller.signal)
        setProvinces(data)
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
        const data = await addressApi.getWards(
          Number(selectedProvinceCode),
          controller.signal,
        )
        setWards(data)
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
    form.setValue("wardCode", "", {
      shouldDirty: true,
      shouldValidate: true,
    })
    setWards([])
    setWardError("")
    setWardRetryCount(0)
  }

  async function onSubmit(data: RegisterInput) {
    setSuccessMessage("")

    const province = provinces.find(
      (item) => item.code === Number(data.provinceCode),
    )
    const ward = data.wardCode
      ? wards.find((item) => item.code === Number(data.wardCode))
      : undefined

    if (!province) {
      form.setError("provinceCode", {
        type: "validate",
        message: "Vui lòng chọn tỉnh/thành phố hợp lệ.",
      })
      return
    }

    if (data.wardCode && !ward) {
      form.setError("wardCode", {
        type: "validate",
        message: "Vui lòng chọn phường/xã hợp lệ.",
      })
      return
    }

    try {
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        address: {
          provinceCode: province.code,
          provinceName: province.name,
          ...(ward && {
            wardCode: ward.code,
            wardName: ward.name,
          }),
          streetAddress: data.streetAddress,
        },
      })
      setSuccessMessage("Đăng ký thành công. Bạn đã được đăng nhập.")
      form.reset()
      setSelectedProvinceCode("")
      setWards([])
    } catch (error) {
      form.setError("root.server", {
        type: "server",
        message: getErrorMessage(error),
      })
    }
  }

  return {
    form,
    provinces,
    wards,
    selectedProvinceCode,
    isLoadingProvinces,
    isLoadingWards,
    provinceError,
    wardError,
    successMessage,
    handleProvinceChange,
    retryProvinces: () => setProvinceRetryCount((count) => count + 1),
    retryWards: () => setWardRetryCount((count) => count + 1),
    onSubmit,
  }
}
