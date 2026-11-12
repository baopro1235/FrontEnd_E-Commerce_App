
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  AuthUser,
  RegisterAccountInput,
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
