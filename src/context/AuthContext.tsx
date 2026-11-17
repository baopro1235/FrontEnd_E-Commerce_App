
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  AuthUser,
  RegisterAccountInput,
  UserAddressInput,
} from "../features/auth/auth.schema";
import { mockApi } from "../mocks/mockApis";

interface LoginInput {
  email: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  register: (data: RegisterAccountInput) => Promise<void>;
  logout: () => void;
  updateUser: (
    fields: Partial<Pick<AuthUser, "fullName" | "phone">>,
  ) => Promise<void>;
  addAddress: (address: UserAddressInput) => Promise<void>;
  updateAddress: (
    addressId: string,
    address: UserAddressInput,
  ) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function restoreUser(): AuthUser | null {
  try {
    const savedUser = localStorage.getItem("auth_user");
    const savedToken = localStorage.getItem("auth_token");

    if (savedUser && savedToken) {
      return JSON.parse(savedUser) as AuthUser;
    }
  } catch {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  }

  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_token");
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(restoreUser);

  const login = async (credentials: LoginInput) => {
    const { token, user: userData } = await mockApi.login(credentials);

    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(userData));

    setUser(userData);
  };

  const register = async (formData: RegisterAccountInput) => {
    const { token, user: userData } = await mockApi.register(formData);

    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    setUser(null);
  };

  const updateUser = async (
    updatedFields: Partial<Pick<AuthUser, "fullName" | "phone">>,
  ) => {
    if (!user) {
      throw new Error("User is not authenticated");
    }

    const updatedUser = await mockApi.updateProfile(user.id, updatedFields);

    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const updateAddresses = async (
    update: (userId: string) => Promise<AuthUser>,
  ) => {
    if (!user) {
      throw new Error("User is not authenticated");
    }

    const updatedUser = await update(user.id);
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const addAddress = (address: UserAddressInput) =>
    updateAddresses((userId) => mockApi.addAddress(userId, address));

  const updateAddress = (addressId: string, address: UserAddressInput) =>
    updateAddresses((userId) =>
      mockApi.updateAddress(userId, addressId, address),
    );

  const removeAddress = (addressId: string) =>
    updateAddresses((userId) => mockApi.removeAddress(userId, addressId));

  const setDefaultAddress = (addressId: string) =>
    updateAddresses((userId) => mockApi.setDefaultAddress(userId, addressId));

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!user) {
      throw new Error("User is not authenticated");
    }

    await mockApi.changePassword(user.id, { currentPassword, newPassword });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading: false,
        login,
        register,
        logout,
        updateUser,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
