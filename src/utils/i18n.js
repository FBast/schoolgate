import { createI18n } from "vue-i18n";
import fr from "@/lang/fr.json";

const messages = {
    fr
};

const i18n = createI18n({
    locale: "fr",
    fallbackLocale: "fr",
    messages,
    globalInjection: true
});

export default i18n;