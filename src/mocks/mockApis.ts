import type {
  AuthUser,
  RegisterAccountInput,
  UserAddress,
  UserAddressInput,
} from "../features/auth/auth.schema"

const DB_KEY = "mock_users_db"
const DELAY = 500

interface StoredUser extends AuthUser {
  password: string
}

interface LoginInput {
  email: string
  password: string
}

interface ProfileUpdate {
  fullName?: string
  phone?: string
}

interface PasswordUpdate {
  currentPassword: string
  newPassword: string
}

function initDB() {
  if (!localStorage.getItem(DB_KEY)) {
    const defaultUsers: StoredUser[] = [
      {
        id: "u1",
        fullName: "Nguyễn Văn A",
        email: "user@example.com",
        password: "Password123",
        phone: "0901234567",
        addresses: [
          {
            id: "a1",
            label: "Nhà riêng",
            street: "123 Lê Lợi, Q.1, TP.HCM",
            isDefault: true,
          },
        ],
      },
    ]
    localStorage.setItem(DB_KEY, JSON.stringify(defaultUsers))
  }
}

function getUsers(): StoredUser[] {
  initDB()
  const users = localStorage.getItem(DB_KEY)
  if (!users) {
    throw new Error("Không thể đọc dữ liệu tài khoản.")
  }

  return JSON.parse(users) as StoredUser[]
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(DB_KEY, JSON.stringify(users))
}

function toAuthUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    addresses: user.addresses,
  }
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export const mockApi = {
  async login({ email, password }: LoginInput) {
    const users = getUsers()
    await wait(DELAY)
    const normalizedEmail = email.trim().toLowerCase()
    const user = users.find(
      (candidate) =>
        candidate.email.toLowerCase() === normalizedEmail &&
        candidate.password === password,
    )
    if (!user) {
      throw new Error("Email hoặc mật khẩu không chính xác")
    }

    return {
      token: `fake-jwt-token-${user.id}`,
      user: toAuthUser(user),
    }
  },

  async register({
    fullName,
    email,
    password,
    phone,
    address,
  }: RegisterAccountInput) {
    const users = getUsers()
    await wait(DELAY)
    const normalizedEmail = email.trim().toLowerCase()
    if (
      users.some(
        (user) => user.email.toLowerCase() === normalizedEmail,
      )
    ) {
      throw new Error("Email này đã được sử dụng")
    }

    const addressId = `a${Date.now()}`
    const userAddress: UserAddress = {
      id: addressId,
      label: "Nhà riêng",
      ...address,
      street: [
        address.streetAddress,
        address.wardName,
        address.provinceName,
      ]
        .filter(Boolean)
        .join(", "),
      isDefault: true,
    }
    const newUser: StoredUser = {
      id: `u${Date.now()}`,
      fullName,
      email: normalizedEmail,
      password,
      phone,
      addresses: [userAddress],
    }
    users.push(newUser)
    saveUsers(users)

    return {
      token: `fake-jwt-token-${newUser.id}`,
      user: toAuthUser(newUser),
    }
  },

  async updateProfile(
    userId: string,
    updatedData: ProfileUpdate,
  ): Promise<AuthUser> {
    await wait(DELAY)
    const users = getUsers()
    const index = users.findIndex((user) => user.id === userId)
    if (index === -1) {
      throw new Error("Không tìm thấy người dùng")
    }

    users[index] = { ...users[index], ...updatedData }
    saveUsers(users)
    return toAuthUser(users[index])
  },

  async addAddress(
    userId: string,
    address: UserAddressInput,
  ): Promise<AuthUser> {
    await wait(DELAY)
    const users = getUsers()
    const user = users.find((candidate) => candidate.id === userId)
    if (!user) {
      throw new Error("Không tìm thấy người dùng")
    }

    user.addresses.push({
      id: `a${Date.now()}`,
      ...address,
      isDefault: user.addresses.length === 0,
    })
    saveUsers(users)
    return toAuthUser(user)
  },

  async updateAddress(
    userId: string,
    addressId: string,
    updatedData: UserAddressInput,
  ): Promise<AuthUser> {
    await wait(DELAY)
    const users = getUsers()
    const user = users.find((candidate) => candidate.id === userId)
    const address = user?.addresses.find(
      (candidate) => candidate.id === addressId,
    )
    if (!user || !address) {
      throw new Error("Không tìm thấy địa chỉ")
    }

    Object.assign(address, updatedData)
    saveUsers(users)
    return toAuthUser(user)
  },

  async removeAddress(userId: string, addressId: string): Promise<AuthUser> {
    await wait(DELAY)
    const users = getUsers()
    const user = users.find((candidate) => candidate.id === userId)
    if (!user || !user.addresses.some((address) => address.id === addressId)) {
      throw new Error("Không tìm thấy địa chỉ")
    }

    const removedAddress = user.addresses.find(
      (address) => address.id === addressId,
    )
    user.addresses = user.addresses.filter(
      (address) => address.id !== addressId,
    )
    if (removedAddress?.isDefault && user.addresses[0]) {
      user.addresses[0].isDefault = true
    }

    saveUsers(users)
    return toAuthUser(user)
  },

  async setDefaultAddress(
    userId: string,
    addressId: string,
  ): Promise<AuthUser> {
    await wait(DELAY)
    const users = getUsers()
    const user = users.find((candidate) => candidate.id === userId)
    if (!user || !user.addresses.some((address) => address.id === addressId)) {
      throw new Error("Không tìm thấy địa chỉ")
    }

    user.addresses = user.addresses.map((address) => ({
      ...address,
      isDefault: address.id === addressId,
    }))
    saveUsers(users)
    return toAuthUser(user)
  },

  async changePassword(
    userId: string,
    { currentPassword, newPassword }: PasswordUpdate,
  ) {
    await wait(DELAY)
    const users = getUsers()
    const user = users.find((candidate) => candidate.id === userId)
    if (!user) {
      throw new Error("Không tìm thấy người dùng")
    }
    if (user.password !== currentPassword) {
      throw new Error("Mật khẩu hiện tại không đúng")
    }

    user.password = newPassword
    saveUsers(users)
    return { message: "Đổi mật khẩu thành công" }
  },
}
