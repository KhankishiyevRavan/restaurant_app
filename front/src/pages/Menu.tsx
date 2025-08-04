import { useState, useEffect } from "react";
import { Search, Star, ShoppingCart, Heart, CheckCircle } from "lucide-react";
import { getMenuItems } from "../service/menuService";
import { useTranslation } from "react-i18next";

type MenuItem = {
  _id: string;
  name?: {
    az?: string;
    en?: string;
    ru?: string;
  };
  price?: string;
  time?: string;
  rating?: number;
  image?: string;
  category?: string;
};

const categories = ["all", "breakfast", "lunch", "treats", "dessert", "drinks"];

export default function Menu() {
  const { t, i18n } = useTranslation();
  type LangKey = "az" | "en" | "ru";
  const currentLang: LangKey = (i18n.language as LangKey) || "az";

  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMenuItems();
      setMenuItems(data);
      console.log(data);
      
    };
    fetchData();
  }, []);

  // Filter (category + search)
  const filteredItems = menuItems.filter((item) => {
    const itemName = item.name?.[currentLang]?.toLowerCase() || "";
    return (
      (activeCategory === "all" || item.category === activeCategory) &&
      itemName.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-white mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-5 pt-6">
        <h1 className="text-2xl font-bold">{t("menu")}</h1>
        <button className="bg-green-600 p-3 rounded-xl text-white">🛒</button>
      </div>

      {/* Search */}
      <div className="relative mt-4 px-5 max-w-2xl mx-auto">
        <Search className="absolute left-8 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={t("search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Categories */}
      <div className="bg-teal-100 mt-6 rounded-t-3xl p-4">
        <div className="flex gap-3 overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t(`category.${cat}`)}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl overflow-hidden shadow-lg border bg-white hover:shadow-xl transition"
            >
              {/* Image */}
              <div className="relative">
                <img
                  className="w-full h-48 object-cover"
                  src={`http://localhost:5002${item.image || ""}`}
                  alt={item.name?.[currentLang] || "No name"}
                />
                <button className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition">
                  <Heart className="text-red-500 w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-red-600 font-bold text-xl">
                    {item.price || "0"}$
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="text-yellow-500 w-4 h-4" />
                    <span className="font-semibold">{item.rating || 0}</span>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-800">
                  {item.name?.[currentLang] || t("no_name")}
                </h3>

                <ul className="mt-2 space-y-1 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-orange-500 w-4 h-4" />
                    {item.time || "-"}
                  </li>
                </ul>

                <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 border rounded-xl text-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition">
                  <ShoppingCart className="w-5 h-5" />
                  {t("add_to_cart")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
