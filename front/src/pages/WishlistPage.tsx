// ✅ 4. WishlistPage.tsx

import { getWishlist } from "../service/wishlistService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Product } from "../types/product";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(getWishlist());
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language as keyof Product["name"];

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{t("wishlist_title")}</h2>
      {wishlist.length === 0 ? (
        <p>{t("wishlist_empty")}</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <ProductCard product={item} />
            // <div key={item._id} className="border p-4 rounded-lg">
            //   <img
            //     src={`${import.meta.env.VITE_API_URL}${item.image}`}
            //     alt={item.name?.[currentLang] || "No name"}
            //     className="h-40 object-cover"
            //   />
            //   <h3>{item.name?.[currentLang] || t("no_name")}</h3>
            //   <p>{item.price} ₼</p>
            // </div>
          ))}
        </div>
      )}
    </div>
  );
}
