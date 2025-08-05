import { useTranslation } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl font-bold mb-4">🍽 {t("welcome_title")}</h1>
      <p className="text-lg text-gray-600 mb-6">{t("welcome_subtitle")}</p>

      {/* Dil dəyişdirici düymələr - ortada */}
      <div className="flex justify-center space-x-4 mt-6">
        {["az", "tr", "en", "ru"].map((lng) => (
          <button
            key={lng}
            onClick={() => changeLanguage(lng)}
            className={`px-4 py-2 border rounded transition ${
              i18n.language === lng
                ? "bg-yellow-400 text-white border-yellow-500"
                : "text-gray-700 hover:bg-yellow-400 hover:text-white"
            }`}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
