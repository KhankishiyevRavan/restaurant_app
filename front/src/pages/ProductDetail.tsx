import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../components/ProductCard";
import { useTranslation } from "react-i18next";
import { getMenuItemById } from "../service/menuService";

type LangKey = "az" | "tr" | "en" | "ru" | "fr";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { i18n, t } = useTranslation();
  const currentLang: LangKey = i18n.language as LangKey;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await getMenuItemById(id);
        setProduct(data);
      } catch (error) {
        console.error("Məhsul yüklənərkən xəta baş verdi:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>{t("loading") || "Yüklənir..."}</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <img
        src={`${import.meta.env.VITE_API_URL}${product.image}`}
        alt={product.name?.[currentLang] || "No name"}
        className="w-full h-96 object-cover rounded-lg"
      />
      <h1 className="text-3xl font-bold mt-6 mb-2">
        {product.name?.[currentLang] || t("no_name")}
      </h1>
      <p className="text-xl text-red-600 font-semibold mb-2">
        {product.price} ₼
      </p>
      <p className="text-gray-700">
        {product.description?.[currentLang] || "-"}
      </p>
    </div>
  );
};

export default ProductDetail;
