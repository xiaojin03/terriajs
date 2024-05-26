import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import isDefined from "../Core/isDefined";
const defaultLanguageConfiguration = {
    enabled: false,
    debug: false,
    react: {
        useSuspense: false
    },
    languages: {
        en: "english"
    },
    fallbackLanguage: "en",
    changeLanguageOnStartWhen: [
        "querystring",
        "localStorage",
        "navigator",
        "htmlTag"
    ]
};
class Internationalization {
    static initLanguage(languageConfiguration, 
    /**
     * i18nOptions is explicitly a separate option from `languageConfiguration`,
     * as `languageConfiguration` can be serialised, but `i18nOptions` may have
     * some functions that are passed in from a TerriaMap
     */
    i18StartOptions, terriajsResourcesBaseUrl) {
        const languageConfig = Object.assign(defaultLanguageConfiguration, languageConfiguration);
        /**
         * initialization of the language with i18next
         *
         * @param {Object} languageConfiguration configuration read from config.json
         * @param {Boolean} languageConfiguration.enabled is GUI language switching enabled
         * @param {Object} languageConfiguration.languages the languages to be used, example `{en: "english"}
         * @param {String} languageConfiguration.fallbackLanguage the language to be used on startup
         * @param {Array} languageConfiguration.changeLanguageOnStartWhen
         */
        return i18next
            .use(HttpApi)
            .use(LanguageDetector)
            .use(initReactI18next)
            .init({
            // use i18next-json-v3 as weblate still doesn't support v4
            compatibilityJSON: "v3",
            debug: languageConfig.debug,
            react: languageConfig.react,
            fallbackLng: languageConfig.fallbackLanguage,
            // whitelist: Object.keys(languageConfig.languages),
            // deprecated
            supportedLngs: Object.keys(languageConfig.languages),
            // to allow en-US when only en is on the whitelist - nonExplicitWhitelist must be set to true
            /**
             * for anyone else confused as I was, `nonExplicitSupportedLngs` &&
             * `load: "languageOnly"` seems functionally equivalent but perhaps this
             * will change in the future
             *
             * > also in my mind I conflated the config surrounding this a little
             * > bit with `load: "languageOnly"` - but upon looking at the source in
             * > i18next this confirms that they both intend to do similar things:
             *
             * https://github.com/i18next/i18next/blob/80a38100d21a7e7c1f9cb2acff5f709063027b9f/src/LanguageUtils.js#L78-L80
             *
             *  */
            nonExplicitSupportedLngs: true,
            // to not look into a folder like /locals/en-US/... when en-US is detected, use load: "languageOnly" to avoid using Country-Code in path
            load: "languageOnly",
            // send not translated keys to endpoint
            saveMissing: false,
            // allow loading of internal trnaslation files and backend files
            partialBundledLanguages: true,
            /*
              This setting adds a posibility for users to override translations using their own translation json file stored in
              `TerriaMap/wwwroot/languages/{{lng}}/languageOverrides.json`
              It will first look in defaultNS for translation and then check the fallbackNS
            */
            ns: ["translation", "languageOverrides"],
            defaultNS: "languageOverrides",
            fallbackNS: "translation",
            backend: Object.assign({
                // Loads translation files from either a TerriaMap's languages assets or from TerriaJS' assets
                // Always load "translation" namespace from TerriaJS assets, and load "languageOverrides" namespace from the TerriaMap
                loadPath: function loadPath([_lng], [namespace]) {
                    if (namespace === "translation")
                        return `${terriajsResourcesBaseUrl}languages/{{lng}}/{{ns}}.json`;
                    // Apply languageConfig.overridesBaseUrl to path for "languageOverrides" namespace if defined
                    if (namespace === "languageOverrides" &&
                        isDefined(languageConfig.overridesBaseUrl)) {
                        return `${languageConfig.overridesBaseUrl}{{lng}}.json`;
                    }
                    return "languages/{{lng}}/{{ns}}.json";
                },
                crossDomain: false
            }, { ...i18StartOptions === null || i18StartOptions === void 0 ? void 0 : i18StartOptions.backend }),
            detection: {
                // order and from where user language should be detected
                order: languageConfig.changeLanguageOnStartWhen,
                // keys or params to lookup language from
                lookupQuerystring: "lng",
                lookupCookie: "i18next",
                lookupLocalStorage: "i18nextLng",
                // cache user language on
                caches: ["localStorage"],
                excludeCacheFor: ["cimode"] // languages to not persist (cookie, localStorage)
                // optional expire and domain for set cookie
                // cookieMinutes: 10,
                // cookieDomain: "myDomain",
            },
            interpolation: {
                escapeValue: false // not needed for react as it escapes by default and not needed in node
            }
        });
    }
}
export default Internationalization;
//# sourceMappingURL=Internationalization.js.map