import axios from "axios";
import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL + "/api/menu";

// 🔹 Bütün yeməkləri gətir
export const getMenuItems = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// 🔹 Yeni yemək əlavə et
export const createMenuItem = async (data: {
  name: Record<string, string>;
  description: Record<string, string>;
  price: string;
  time?: string;
  rating?: number;
  category?: string;
  image?: File;
}) => {
  const formData = new FormData();

  // ✅ Ad və təsviri hər dil üçün əlavə et
  Object.entries(data.name).forEach(([lang, value]) =>
    formData.append(`name[${lang}]`, value)
  );

  Object.entries(data.description).forEach(([lang, value]) =>
    formData.append(`description[${lang}]`, value)
  );

  formData.append("price", data.price);
  if (data.time) formData.append("time", data.time);
  if (data.rating) formData.append("rating", String(data.rating));
  if (data.category) formData.append("category", data.category);
  if (data.image) formData.append("image", data.image);

  const res = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// 🔹 Yeməyi yenilə (Edit)
export const updateMenuItem = async (
  id: string,
  data: {
    name: Record<string, string>;
    description: Record<string, string>;
    price: string;
    time?: string;
    rating?: number;
    category?: string;
    image?: File | null;
  }
) => {
  const formData = new FormData();

  Object.entries(data.name).forEach(([lang, value]) =>
    formData.append(`name[${lang}]`, value)
  );

  Object.entries(data.description).forEach(([lang, value]) =>
    formData.append(`description[${lang}]`, value)
  );

  formData.append("price", data.price);
  if (data.time) formData.append("time", data.time);
  if (data.rating) formData.append("rating", String(data.rating));
  if (data.category) formData.append("category", data.category);
  if (data.image) formData.append("image", data.image);

  const res = await axios.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// 🔹 Yeməyi sil
export const deleteMenuItem = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

// 🔹 ID ilə yeməyi gətir
export const getMenuItemById = async (id: string): Promise<Product> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
