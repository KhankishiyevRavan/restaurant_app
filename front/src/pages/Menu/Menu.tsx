import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Product } from "../../types/product";
import { getMenuItems } from "../../services/menuService";
import ProductCard from "../../components/ProductCard";

const categories = ["all", "breakfast", "lunch", "treats", "dessert", "drinks"];

export default function Menu() {
  const { t, i18n } = useTranslation();
  type LangKey = "az" | "tr" | "en" | "ru" | "fr";
  const currentLang: LangKey = (i18n.language as LangKey) || "az";

  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMenuItems();
      console.log(data);

      setMenuItems(data);
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
        {/* <button className="bg-green-600 p-3 rounded-xl text-white">🛒</button> */}
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
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredItems.map((item, index) => (
            <ProductCard product={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
