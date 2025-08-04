import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/menu`; // lazım olsa .env-dən götür

// Bütün yeməkləri gətir
export const getMenuItems = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Yeni yemək əlavə et (FormData ilə, multilang support)
export const createMenuItem = async (data: {
  name: { az: string; en: string; ru: string }; // artıq obyekt
  price: string;
  time?: string;
  rating?: number;
  category?: string;
  image?: File;
}) => {
  const formData = new FormData();

  // name obyektini stringify edib göndəririk
  formData.append("name", JSON.stringify(data.name));
  formData.append("price", data.price);

  if (data.time) formData.append("time", data.time);
  if (data.rating) formData.append("rating", String(data.rating));
  if (data.category) formData.append("category", data.category);
  if (data.image) formData.append("image", data.image);

  const res = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
export const deleteMenuItem = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
