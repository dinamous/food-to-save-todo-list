import { createI18n } from "vue-i18n";

import * as en from "@/locales/en.json";
import * as pt from "@/locales/pt.json";

const i18n = createI18n({
  legacy: false, // Desativa modo legacy para Composition API
  locale: "pt",
  messages: {
    pt,
    en,
  },
});

export default i18n;
