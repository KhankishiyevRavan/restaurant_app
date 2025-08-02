import axios from "axios";

const API_URL = "http://localhost:5000/api/menu"; // lazım olsa .env-dən götür

// Bütün yeməkləri gətir
export const getMenuItems = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Yeni yemək əlavə et (FormData ilə)
export const createMenuItem = async (data: {
  name: string;
  price: string;
  time?: string;
  rating?: number;
  category?: string;
  image?: File; // şəkil file
}) => {
  const formData = new FormData();
  formData.append("name", data.name);
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
