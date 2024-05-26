import i18next from "i18next";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import { isJsonObject } from "../Core/Json";
import loadJson from "../Core/loadJson";
import loadWithXhr from "../Core/loadWithXhr";
import TerriaError from "../Core/TerriaError";
/**
 * Interface to the terriajs-server service for creating short share links.
 * @param {*} options
 *
 * @alias ShareDataService
 * @constructor
 */
export default class ShareDataService {
    constructor(options) {
        Object.defineProperty(this, "terria", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_serverConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.terria = options.terria;
        this.url = options.url;
    }
    init(serverConfig) {
        this.url = defaultValue(this.url, defaultValue(this.terria.configParameters.shareUrl, "share"));
        this._serverConfig = serverConfig;
    }
    get isUsable() {
        return ((this.url !== undefined &&
            typeof this._serverConfig === "object" &&
            typeof this._serverConfig.newShareUrlPrefix === "string") ||
            this.url !== "share");
    }
    /**
     * Allocates a share token using Terria Server, storing the provided data there.
     * @param shareData JSON to store.
     * @return A promise for the token (which can later be resolved at /share/TOKEN).
     */
    async getShareToken(shareData) {
        if (!this.isUsable) {
            throw TerriaError.from("`ShareDataService` is not usable");
        }
        try {
            const result = await loadWithXhr({
                url: this.url,
                method: "POST",
                data: JSON.stringify(shareData),
                headers: { "Content-Type": "application/json" },
                responseType: "json"
            });
            const json = typeof result === "string" ? JSON.parse(result) : result;
            return json.id;
        }
        catch (error) {
            throw TerriaError.from(error, {
                title: i18next.t("models.shareData.generateErrorTitle"),
                message: i18next.t("models.shareData.generateErrorMessage"),
                importance: 1
            });
        }
    }
    async resolveData(token) {
        if (!this.isUsable) {
            throw TerriaError.from("`ShareDataService` is not usable");
        }
        try {
            const shareJson = await loadJson(this.url + "/" + token);
            if (!isJsonObject(shareJson, false)) {
                throw TerriaError.from(`Invalid server response for share ${this.url + "/" + token}\n\`${JSON.stringify(shareJson)}\``);
            }
            return shareJson;
        }
        catch (error) {
            throw TerriaError.from(error, {
                title: i18next.t("models.shareData.expandErrorTitle"),
                message: i18next.t("models.shareData.expandErrorMessage", {
                    appName: this.terria.appName
                }),
                importance: 1
            });
        }
    }
}
//# sourceMappingURL=ShareDataService.js.map