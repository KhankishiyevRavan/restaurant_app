import api from "../api/axios";
import { getApiError } from "../pages/api";
import type { FeedbackItem, Paginated } from "../types/servicesFeedback";

export type CreateFeedbackInput = {
  rating: number; // 1..5
  waiterId: string; // seçilmiş ofisiant
  message?: string; // opsional
  images: File[]; // min 1, max 3
};

// POST /api/service-feedback (multipart)
export async function createFeedback(
  input: CreateFeedbackInput
): Promise<FeedbackItem> {
  const { rating, waiterId, message, images } = input;

  const fd = new FormData();
  fd.append("rating", String(rating));
  fd.append("waiterId", waiterId);
  if (message) fd.append("message", message);
  images.forEach((file) => fd.append("images", file)); // name="images"

  try {
    const { data } = await api.post<{ ok: boolean; data: FeedbackItem }>(
      "/api/service-feedback",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  } catch (e) {
    throw new Error(getApiError(e));
  }
}

// GET /api/service-feedback?page=&limit=
export async function listFeedback(params?: {
  page?: number;
  limit?: number;
}): Promise<Paginated<FeedbackItem>> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  try {
    const { data } = await api.get<Paginated<FeedbackItem>>(
      "/api/service-feedback",
      { params: { page, limit } }
    );
    return data;
  } catch (e) {
    throw new Error(getApiError(e));
  }
}

// GET /api/service-feedback/:id
export async function getFeedbackById(id: string): Promise<FeedbackItem> {
  try {
    const { data } = await api.get<{ ok: boolean; data: FeedbackItem }>(
      `/api/service-feedback/${id}`
    );
    return data.data;
  } catch (e) {
    throw new Error(getApiError(e));
  }
}
