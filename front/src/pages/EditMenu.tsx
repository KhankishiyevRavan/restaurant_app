import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

type MenuItem = {
  _id: string;
  name: {
    az: string;
    tr: string;
    en: string;
    ru: string;
    fr: string;
  };
  price: string;
  time?: string;
  rating?: number;
  category?: string;
  image?: string;
};

export default function EditMenu() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [name, setName] = useState({ az: "", tr: "", en: "", ru: "", fr: "" });
  const [price, setPrice] = useState("");
  const [time, setTime] = useState("");
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("all");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/menu/${id}`
      );
      const data = res.data;
      setItem(data);
      setName(data.name);
      setPrice(data.price);
      setTime(data.time || "");
      setRating(data.rating || "");
      setCategory(data.category || "all");
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("price", price);
    if (time) formData.append("time", time);
    if (rating) formData.append("rating", rating.toString());
    if (category) formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/menu/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("✅ Menyu uğurla yeniləndi!");
      navigate("/admin/menu");
    } catch (error) {
      console.error("❌ Xəta:", error);
      alert("❌ Menyu yenilənmədi. Zəhmət olmasa yenidən yoxlayın!");
    }
  };

  if (!item) return <p>{t("loading")}...</p>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t("edit_menu")}</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        {/* Multilanguage Name Inputs */}
        <input
          type="text"
          placeholder={`${t("name")} (AZ)`}
          className="border px-3 py-2 w-full rounded"
          value={name.az}
          onChange={(e) => setName({ ...name, az: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder={`${t("name")} (TR)`}
          className="border px-3 py-2 w-full rounded"
          value={name.tr}
          onChange={(e) => setName({ ...name, tr: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder={`${t("name")} (EN)`}
          className="border px-3 py-2 w-full rounded"
          value={name.en}
          onChange={(e) => setName({ ...name, en: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder={`${t("name")} (RU)`}
          className="border px-3 py-2 w-full rounded"
          value={name.ru}
          onChange={(e) => setName({ ...name, ru: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder={`${t("name")} (FR)`}
          className="border px-3 py-2 w-full rounded"
          value={name.fr}
          onChange={(e) => setName({ ...name, fr: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder={t("price")}
          className="border px-3 py-2 w-full rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder={t("time_placeholder")}
          className="border px-3 py-2 w-full rounded"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <input
          type="number"
          step="0.1"
          placeholder={t("rating_placeholder")}
          className="border px-3 py-2 w-full rounded"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        >
          <option value="all">{t("category.all")}</option>
          <option value="breakfast">{t("category.breakfast")}</option>
          <option value="lunch">{t("category.lunch")}</option>
          <option value="treats">{t("category.treats")}</option>
          <option value="dessert">{t("category.dessert")}</option>
          <option value="drinks">{t("category.drinks")}</option>
        </select>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />

        {/* Köhnə şəkil göstərin */}
        {item.image && (
          <img
            src={`${import.meta.env.VITE_API_URL}${item.image}`}
            alt="Preview"
            className="w-32 h-32 object-cover mt-2"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {t("save")}
        </button>
      </form>
    </div>
  );
}
