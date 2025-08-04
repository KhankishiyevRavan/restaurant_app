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
        <button
          onClick={() => changeLanguage("az")}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-yellow-400 hover:text-white"
        >
          AZ
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-yellow-400 hover:text-white"
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage("ru")}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-yellow-400 hover:text-white"
        >
          RU
        </button>
      </div>
    </div>
  );
}
