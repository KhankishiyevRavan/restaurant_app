import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {t("notfound_title")}
      </h2>
      <p className="text-gray-600 mb-6">{t("notfound_subtitle")}</p>
      <a
        href="/"
        className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
      >
        {t("go_home")}
      </a>
    </div>
  );
}
