import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const languages = [
  { code: "az", label: "AZ", flag: "/flags/az.png" },
  { code: "tr", label: "TR", flag: "/flags/tr.png" },
  { code: "en", label: "EN", flag: "/flags/en.png" },
  { code: "ru", label: "RU", flag: "/flags/ru.png" },
  { code: "fr", label: "FR", flag: "/flags/fr.png" },
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    navigate("/menu"); // Ana səhifəyə yönləndir
  };

  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl font-bold mb-4">🍽 {t("welcome_title")}</h1>
      <p className="text-lg text-gray-600 mb-6">{t("welcome_subtitle")}</p>

      <div className="flex justify-center flex-wrap gap-5 mt-6">
        {languages.map(({ code, label, flag }) => (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            className={`cursor-pointer px-4 py-2 border rounded w-50 h-20 text-lg font-medium transition ${
              i18n.language === code
                ? "bg-yellow-400 text-white border-yellow-500"
                : "text-gray-700 hover:bg-yellow-400 hover:text-white"
            }`}
          >
            <div className="flex gap-3 items-center justify-center">
              <img
                src={flag}
                alt={label}
                className="w-8 h-6 mb-1"
                style={{ objectFit: "cover" }}
              />
              <span>{label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
