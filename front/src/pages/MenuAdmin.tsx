import { useEffect, useState } from "react";
import { deleteMenuItem, getMenuItems } from "../service/menuService";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type MenuItem = {
  _id: string;
  name: {
    az: string;
    en: string;
    ru: string;
  };
  price: string;
  time?: string;
  rating?: number;
  category?: string;
  image?: string;
};

export default function MenuAdmin() {
  const { i18n, t } = useTranslation();
  type LangKey = keyof MenuItem["name"]; // "az" | "en" | "ru"
  const currentLang: LangKey = (i18n.language as LangKey) || "az";

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const navigate = useNavigate();

  // Bütün yeməkləri yüklə
  const fetchData = async () => {
    const data = await getMenuItems();
    setMenuItems(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Silmə
  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirm_delete"))) return;

    await deleteMenuItem(id); // 🔥 service istifadə olunur
    fetchData(); // siyahını yenilə
  };

  // Edit
  const handleEdit = (id: string) => {
    navigate(`/admin/menu/edit/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t("menu_list")}</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">{t("name")}</th>
            <th className="border p-2">{t("price")}</th>
            <th className="border p-2">{t("category")}</th>
            <th className="border p-2">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item, index) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{item.name[currentLang]}</td>
              <td className="border p-2">{item.price} $</td>
              <td className="border p-2">{item.category}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(item._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  {t("edit")}
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  {t("delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
