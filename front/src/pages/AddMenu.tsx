import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMenuItem } from "../service/menuService";
import { useTranslation } from "react-i18next";

export default function AddMenu() {
  const { t } = useTranslation();

  const [name, setName] = useState({ az: "", tr: "", en: "", ru: "" });
  const [price, setPrice] = useState("");
  const [time, setTime] = useState("");
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("all");
  const [image, setImage] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMenuItem({
      name,
      price,
      time,
      rating: Number(rating),
      category,
      image: image || undefined,
    });

    navigate("/menu");
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">➕ {t("add_new_menu")}</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        {/* Multilanguage name inputs */}
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

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {t("save")}
        </button>
      </form>
    </div>
  );
}
