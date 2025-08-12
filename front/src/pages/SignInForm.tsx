import { useState } from "react";
import { useNavigate } from "react-router";

// You can set this in your Vite env: VITE_API_URL=https://yourdomain.com
const API_BASE = import.meta.env.VITE_API_URL || "";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "E‑poçt düzgün deyil";
    if (!password || password.length < 6) return "Şifrə minimum 6 simvol olmalıdır";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send & receive httpOnly refresh cookie
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Giriş mümkün olmadı");
      }

      // Server returns { token, user }
      const token: string | undefined = data?.token;
      const user = data?.user;
      if (!token) throw new Error("Token tapılmadı");

      // Persist access token depending on "remember me"
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem("access_token", token);
      storage.setItem("user", JSON.stringify(user));

      // Navigate to dashboard (change if needed)
      navigate("/admin/menu");
    } catch (err: any) {
      setError(err.message || "Naməlum xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 shadow-xl rounded-2xl p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hesaba giriş</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Zəhmət olmasa məlumatlarınızı daxil edin
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              E-poçt
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="ornek@mail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Şifrə
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
              >
                {showPassword ? (
                  // eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-2.35-2.35a12.3 12.3 0 0 0 3-4.02.9.9 0 0 0 0-.78C19.88 7.2 16.09 5 12 5c-1.6 0-3.15.35-4.56 1L3.53 2.47ZM9.83 8.3l1.2 1.2a3.25 3.25 0 0 1 3.47 3.47l1.2 1.2A4.75 4.75 0 0 0 9.83 8.3Zm-1.88 1.88A4.75 4.75 0 0 0 12 16.75c.57 0 1.11-.1 1.62-.29l1.23 1.23A6.25 6.25 0 0 1 5.5 12c.54-1.05 1.27-1.96 2.45-2.82Z"/><path d="M12 7.75c.8 0 1.55.17 2.23.47l-1.23 1.23A3.25 3.25 0 0 0 8.55 13.9l-1.23 1.23A4.75 4.75 0 0 1 12 7.75Z"/></svg>
                ) : (
                  // eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 5C7.5 5 3.73 7.61 1.53 11.39a.9.9 0 0 0 0 .82C3.73 15.99 7.5 18.6 12 18.6s8.27-2.61 10.47-6.39a.9.9 0 0 0 0-.82C20.27 7.61 16.5 5 12 5Zm0 11.1A4.1 4.1 0 1 1 12 8a4.1 4.1 0 0 1 0 8.2Zm0-6.1a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Yadda saxla
            </label>
            <button
              type="button"
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Şifrəni unutmusunuz?
            </button>
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 text-white font-medium py-2.5 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Giriş edilir…" : "Daxil ol"}
          </button>
        </form>

        {/* <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Hesabınız yoxdur? {" "}
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:underline"
          >
            Qeydiyyat
          </button>
        </div> */}
      </div>
    </div>
  );
}
