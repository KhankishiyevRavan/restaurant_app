import axios from "axios";
import api from "../api/axios";
import { emitNotificationsUpdated } from "../utils/notificationsBus";

// 🔹 Notification tipi
export interface NotificationType {
  [x: string]: any;
  _id?: string;
  contractId: string;
  subscriberId: string;
  subscriberName?: string;
  servicePackageId: string;
  servicePackageName?: string;
  notificationDate: Date;
  // type?: "inspection" | "custom";
  type?: string;
  status?: "pending" | "done" | "sent";
  message: string;
}
export interface NotificationTypes {
  _id?: string;
  status?: "pending" | "finish";
  type?: string;
  subscriberId?: {
    _id?: string;
    fname?: string;
    lname?: string;
  };
  contractId?: {
    _id?: string;
    contractNumber?: string;
  };
  servicePackageId?: string;
  servicePackageName?: string;
  message?: string;
  notificationDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 🔹 Yeni notifikasiya yaratmaq
export const createNotification = async (data: NotificationType) => {
  return axios
    .post(`${import.meta.env.VITE_API_URL}/notifications`, data)
    .then((res) => res.data);
};

// 🔹 Bütün notifikasiyaları gətir
export const getAllNotifications = async (
  query: string = ""
): Promise<NotificationType[]> => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/notifications?${query}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// 🔹 ID ilə notifikasiya gətir
export const getNotificationById = async (
  id: string
): Promise<NotificationTypes> => {
  return axios
    .get(`${import.meta.env.VITE_API_URL}/notifications/${id}`)
    .then((res) => res.data);
};

export const updateNotificationStatus = async (id: string, status: string) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `${import.meta.env.VITE_API_URL}/notifications/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  emitNotificationsUpdated();
  return response.data;
};

// 🔹 Notifikasiya silmək
export const deleteNotification = async (
  id: string
): Promise<{ message: string }> => {
  return axios
    .delete(`${import.meta.env.VITE_API_URL}/notifications/${id}`)
    .then((res) => res.data);
};

// 🔹 Tam update
export const updateNotification = async (id: string, data: any) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/notifications/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) throw new Error("Failed to update notification");

    return await res.json();
  } catch (error) {
    console.error("Error updating notification:", error);
    throw error;
  }
};
