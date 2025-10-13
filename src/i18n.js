import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en.json";
import amTranslation from "./locales/am.json";
import omTranslation from "./locales/om.json";

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      am: { translation: amTranslation },
      om: { translation: omTranslation },
    },
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language if translation is missing
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;