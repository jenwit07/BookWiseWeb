import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";

import "dayjs/locale/th";
import "dayjs/locale/en";

const Locales = {
  en: require("antd/es/locale/en_US").default,
  th: require("antd/es/locale/th_TH").default,
};
// const lang = process.env.DEFAULT_LANGUAGE || "th";
const lang = localStorage.getItem("i18nextLng") || process.env.DEFAULT_LANGUAGE || "th";

i18n
  /*
   * Load translation using xhr -> see /public/locales
   * learn more: https://github.com/i18next/i18next-xhr-backend
   */
  .use(Backend)
  /*
   *  Detect user language
   *  learn more: https://github.com/i18next/i18next-browser-languageDetector
   * .use(LanguageDetector)
   *  pass the i18n instance to react-i18next.
   */
  .use(initReactI18next)
  // Own Plugin to load antd locales
  .use({
    type: "3rdParty",
    init(instance) {
      instance.Locales = Locales;
    },
  })
  /*
   * Init i18next
   * for all options read: https://www.i18next.com/overview/configuration-options
   */
  .init({
    load: "languageOnly",
    react: {
      useSuspense: false
    },
    lng: lang,
    debug: process.env.DEBUG === true,
    ns: [
      "translation",
      "store"
    ],
    defaultNS: "translation",
    interpolation: {
      escapeValue: false, // Not needed for react as it escapes by default
    },
    Locales,
    backend: {
      loadPath: "/public/locales/{{lng}}/{{ns}}.json",
      allowMultiLoading: true,
    },
  });

export default i18n;
