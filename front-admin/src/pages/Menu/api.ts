import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5002";

export const api = axios.create({
  baseURL, // məsələn: http://localhost:5002
  withCredentials: true,
});

// Sadə error helper (opsional)
export function getApiError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const msg =
      (e.response?.data as any)?.message || e.response?.statusText || e.message;
    return msg || "Şəbəkə xətası";
  }
  return "Naməlum xəta";
}
