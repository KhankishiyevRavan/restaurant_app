import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string | undefined) => {
    i18n.changeLanguage(lng);
  };

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
        </div>

        {/* Dil dəyişdirici */}
        <div className="flex space-x-3">
          <button
            onClick={() => changeLanguage("az")}
            className="text-white hover:text-yellow-400"
          >
            AZ
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className="text-white hover:text-yellow-400"
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage("ru")}
            className="text-white hover:text-yellow-400"
          >
            RU
          </button>
        </div>
      </div>
    </nav>
  );
}
