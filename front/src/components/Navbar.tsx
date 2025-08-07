import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Menyu linkləri */}
        <div className="flex space-x-6">
          <Link to="/" className="text-white font-medium hover:text-yellow-400">
            {t("home")}
          </Link>
          <Link
            to="/menu"
            className="text-white font-medium hover:text-yellow-400"
          >
            {t("menu")}
          </Link>
          <Link
            to="/wishlist"
            className="text-white font-medium hover:text-yellow-400"
          >
            {t("wishlist_title")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
