import React, { createContext, useContext, useState } from "react";
import * as authApi from "../api/auth";

type User = { email?: string; token?: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  loginGoogle: (token: string) => Promise<void>;
  register: (data: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  }) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const raw = localStorage.getItem("bc_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem("bc_token");
    } catch {
      return null;
    }
  });

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem("bc_token", t);
    else localStorage.removeItem("bc_token");
  };

  const login = async (email: string, password: string) => {
    // call backend login
    const payload = { account: email, password };
    const res: any = await authApi.login(payload);
    // backend returns { err, mess, accessToken, user }
    if (res?.err === 0 && res.accessToken) {
      const u = res.user || { email };
      setUser(u);
      setToken(res.accessToken);
      try {
        localStorage.setItem("bc_user", JSON.stringify(u));
        // also write legacy key 'user' used by header
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            avatar: u.avatar || null,
          }),
        );
        // notify other listeners (header) about auth change
        try {
          window.dispatchEvent(new Event("authChanged"));
        } catch {}
      } catch {}
      return;
    }
    const err = new Error(res?.mess || "Đăng nhập thất bại");
    throw err;
  };

  const loginUser = async (email: string, password: string) => {
    // call backend login-user
    const payload = { account: email, password };
    const res: any = await authApi.loginUser(payload);
    // backend returns { err, mess, accessToken, user }
    if (res?.err === 0 && res.accessToken) {
      const u = res.user || { email };
      setUser(u);
      setToken(res.accessToken);
      try {
        localStorage.setItem("bc_user", JSON.stringify(u));
        // also write legacy key 'user' used by header
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            avatar: u.avatar || null,
          }),
        );
        // notify other listeners (header) about auth change
        try {
          window.dispatchEvent(new Event("authChanged"));
        } catch {}
      } catch {}
      return;
    }
    const err = new Error(res?.mess || "Đăng nhập thất bại");
    throw err;
  };

  const loginGoogle = async (token: string) => {
    // call backend login-google
    const res: any = await authApi.loginGoogle(token);
    // backend returns { err, mess, accessToken, user }
    if (res?.err === 0 && res.accessToken) {
      const u = res.user || {};
      setUser(u);
      setToken(res.accessToken);
      try {
        localStorage.setItem("bc_user", JSON.stringify(u));
        // also write legacy key 'user' used by header
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            avatar: u.avatar || null,
          }),
        );
        // notify other listeners (header) about auth change
        try {
          window.dispatchEvent(new Event("authChanged"));
        } catch {}
      } catch {}
      return;
    }
    const err = new Error(res?.mess || "Đăng nhập Google thất bại");
    throw err;
  };

  const register = async (data: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  }) => {
    const res: any = await authApi.register({
      email: data.email,
      password: data.password,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
    });
    if (res?.err === 0) {
      // registration successful; backend may return accessToken and user
      if (res.accessToken) {
        const u = res.user || { email: data.email };
        setUser(u);
        setToken(res.accessToken);
        try {
          localStorage.setItem("bc_user", JSON.stringify(u));
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
              avatar: u.avatar || null,
            }),
          );
          try {
            window.dispatchEvent(new Event("authChanged"));
          } catch {}
        } catch {}
      }
      return res;
    }
    const err = new Error(res?.mess || "Đăng ký thất bại");
    throw err;
  };

  const forgotPassword = async (email: string) => {
    const res: any = await authApi.forgotPassword({ email });
    if (res?.err !== 0) {
      const err = new Error(res?.mess || "Gửi email quên mật khẩu thất bại");
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("bc_user");
      localStorage.removeItem("user");
      localStorage.removeItem("bc_token");
      try {
        window.dispatchEvent(new Event("authChanged"));
      } catch {}
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginUser,
        loginGoogle,
        register,
        forgotPassword,
        logout,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;
