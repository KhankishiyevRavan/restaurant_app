import { getWishlist } from "../service/wishlistService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types/product";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { t } = useTranslation();

  // Yükləndikdə və ya yeniləmə tələb olunduqda wishlist-i götür
  const refreshWishlist = () => {
    setWishlist(getWishlist());
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{t("wishlist_title")}</h2>
      {wishlist.length === 0 ? (
        <p>{t("wishlist_empty")}</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <ProductCard
              key={item._id}
              product={item}
              onWishlistToggle={refreshWishlist} // 📌 Əlavə etdik
            />
          ))}
        </div>
      )}
    </div>
  );
}
