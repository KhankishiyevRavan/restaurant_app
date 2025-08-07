import { CheckCircle, Star, Heart } from "lucide-react";
import { useWishlist } from "../context/wishlistContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// 🔹 Dəstəklənən dillər
type LangKey = "az" | "tr" | "en" | "ru" | "fr";

// 🔹 Məhsul interfeysi
export interface Product {
  _id: string;
  name: Record<LangKey, string>;
  image: string;
  price: number;
  rating?: number;
  time?: string;
  [key: string]: any;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToWishlist } = useWishlist();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLang: LangKey = i18n.language as LangKey;

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Kart kliklənməsini blokla
    addToWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="rounded-2xl overflow-hidden shadow-lg border bg-white hover:shadow-xl transition cursor-pointer"
    >
      {/* Şəkil */}
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={`${import.meta.env.VITE_API_URL}${product.image || ""}`}
          alt={product.name?.[currentLang] || "No name"}
        />
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
        >
          <Heart className="text-red-500 w-5 h-5" />
        </button>
      </div>

      {/* Kontent */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-red-600 font-bold text-xl">
            {product.price || "0"}$
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Star className="text-yellow-500 w-4 h-4" />
            <span className="font-semibold">{product.rating || 0}</span>
          </div>
        </div>

        <h3 className="font-bold text-lg text-gray-800">
          {product.name?.[currentLang] || t("no_name")}
        </h3>

        <ul className="mt-2 space-y-1 text-gray-600 text-sm">
          <li className="flex items-center gap-2">
            <CheckCircle className="text-orange-500 w-4 h-4" />
            {product.time || "-"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductCard;
