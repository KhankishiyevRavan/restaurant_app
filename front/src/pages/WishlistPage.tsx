import { useWishlist, type LangKey } from "../context/wishlistContext";
import { useTranslation } from "react-i18next";

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const { i18n, t } = useTranslation();

  const currentLang: LangKey = i18n.language as LangKey;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{t("wishlist_title") || "Sevilən məhsullar"}</h2>

      {wishlist.length === 0 ? (
        <p>{t("wishlist_empty") || "Heç bir məhsul əlavə olunmayıb."}</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {wishlist.map((item, index) => (
            <div key={index} className="border p-4 rounded-xl shadow-md bg-white">
              <img
                src={`${import.meta.env.VITE_API_URL}${item.image}`}
                alt={item.name?.[currentLang] || "No name"}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="mt-2 text-lg font-semibold text-gray-800">
                {item.name?.[currentLang] || t("no_name")}
              </h3>
              <p className="text-red-600 font-bold">{item.price} ₼</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
