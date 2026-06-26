import { createContext, useState } from "react";
import type { ReactNode } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "barber" | "admin";
};
type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (
    userData: User,
    accessToken: string
  ) => void;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] =
    useState<User | null>(() => {
      const storedUser =
        localStorage.getItem("user");

      return storedUser
        ? (JSON.parse(storedUser) as User)
        : null;
    });

  const [token, setToken] =
    useState<string | null>(() => {
      return localStorage.getItem(
        "accessToken"
      );
    });

  const login = (
    userData: User,
    accessToken: string
  ) => {
    setUser(userData);
    setToken(accessToken);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "accessToken",
      accessToken
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;