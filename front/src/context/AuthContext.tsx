import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  name: string;
  email?: string;
  role?: string;
  // istəsən əlavə sahələr
};

type AuthState = {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
};

type LoginInput = {
  token: string;
  user: User;
  rememberMe?: boolean; // true → localStorage, false → sessionStorage
};

type AuthContextValue = AuthState & {
  login: (input: LoginInput) => void;
  logout: () => void;
  setUser: (u: User | null) => void; // profil yeniləmə üçün
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Storage açarları
const TOKEN_KEY = "access_token";
const USER_KEY = "user";

function readFromStorage(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

  let user: User | null = null;
  if (userRaw) {
    try { user = JSON.parse(userRaw); } catch { user = null; }
  }
  return { token, user, isLoggedIn: !!token };
}

function clearBothStorages() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [{ token, user, isLoggedIn }, setAuth] = useState<AuthState>(() => readFromStorage());

  const login = useCallback((input: LoginInput) => {
    const { token, user, rememberMe } = input;

    // əvvəlcə hər ehtimala qarşı təmizlə
    clearBothStorages();

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));

    setAuth({ token, user, isLoggedIn: true });

    // digər tablar üçün sync
    window.dispatchEvent(new Event("storage"));
  }, []);

  const logout = useCallback(() => {
    clearBothStorages();
    setAuth({ token: null, user: null, isLoggedIn: false });

    // digər tablar üçün sync
    window.dispatchEvent(new Event("storage"));
  }, []);

  const setUserState = useCallback((u: User | null) => {
    // aktiv hansı storage-dadırsa ora yaz
    const hasLocal = !!localStorage.getItem(TOKEN_KEY);
    const storage = hasLocal ? localStorage : sessionStorage;

    if (u) storage.setItem(USER_KEY, JSON.stringify(u));
    else storage.removeItem(USER_KEY);

    setAuth((prev) => ({ ...prev, user: u }));
    window.dispatchEvent(new Event("storage"));
  }, []);

  // Multi-tab / başqa komponentlərdən dəyişiklikləri eşit
  useEffect(() => {
    const onStorage = () => setAuth(readFromStorage());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, isLoggedIn, login, logout, setUser: setUserState }),
    [token, user, isLoggedIn, login, logout, setUserState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
