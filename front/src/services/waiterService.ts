import api from "../api/axios";
import { getApiError } from "../pages/Menu/api";
import { Waiter } from "../types/servicesFeedback";

// GET /api/waiters
export async function getWaiters(): Promise<Waiter[]> {
  try {
    const { data } = await api.get<{ ok: boolean; items: Waiter[] }>(
      "/api/waiters"
    );
    return data.items || [];
  } catch (e) {
    throw new Error(getApiError(e));
  }
}

// (opsional) POST /api/waiters  — admin üçün
export async function createWaiter(payload: {
  name: string;
  isActive?: boolean;
}): Promise<Waiter> {
  try {
    const { data } = await api.post<{ ok: boolean; data: Waiter }>(
      "/api/waiters",
      payload
    );
    return data.data;
  } catch (e) {
    throw new Error(getApiError(e));
  }
}
// waiterService.ts

// Mövcud funksiyalarınız (getWaiters, createWaiter) qalır…

export async function updateWaiter(
  id: string,
  payload: { name?: string; isActive?: boolean }
): Promise<Waiter> {
  try {
    const { data } = await api.patch<{ ok: boolean; data: Waiter }>(
      `/api/waiters/${id}`,
      payload
    );
    return data.data;
  } catch (e) {
    throw new Error(getApiError(e));
  }
}

export async function deleteWaiter(id: string): Promise<boolean> {
  try {
    const { data } = await api.delete<{ ok: boolean }>(`/api/waiters/${id}`);
    return !!data.ok;
  } catch (e) {
    throw new Error(getApiError(e));
  }
}
