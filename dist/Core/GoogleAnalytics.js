"use strict";
import i18next from "i18next";
import ReactGA from "react-ga4";
import isDefined from "./isDefined";
export default class GoogleAnalytics {
    constructor() {
        Object.defineProperty(this, "key", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
    }
    start(configParameters) {
        this.key = configParameters.googleAnalyticsKey;
        this.options = configParameters.googleAnalyticsOptions;
        if (process.env.NODE_ENV === "development") {
            console.log(i18next.t("core.googleAnalytics.logEnabledOnDevelopment"));
        }
        initializeGoogleAnalytics(this);
    }
    logEvent(category, action, label, value) {
        const fieldObject = {
            hitType: "event",
            eventCategory: category,
            eventAction: action
        };
        if (label) {
            fieldObject.eventLabel = label;
        }
        if (isDefined(value)) {
            fieldObject.value = value;
        }
        ReactGA.send(fieldObject);
    }
}
function initializeGoogleAnalytics(that) {
    var _a;
    if (!isDefined(that.key)) {
        console.log(i18next.t("core.googleAnalytics.log"));
        return;
    }
    ReactGA.initialize(that.key, {
        gaOptions: { anonymizeIp: true, ...((_a = that.options) !== null && _a !== void 0 ? _a : {}) },
        gtagOptions: {
            send_page_view: false
        }
    });
    ReactGA.send({ hitType: "pageview" });
}
//# sourceMappingURL=GoogleAnalytics.js.map