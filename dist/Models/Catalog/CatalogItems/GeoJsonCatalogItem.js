var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { get as _get, set as _set } from "lodash";
import { computed, toJS, makeObservable } from "mobx";
import isDefined from "../../../Core/isDefined";
import { isJsonObject } from "../../../Core/Json";
import loadBlob, { isZip, parseZipJsonBlob } from "../../../Core/loadBlob";
import loadJson from "../../../Core/loadJson";
import readJson from "../../../Core/readJson";
import TerriaError from "../../../Core/TerriaError";
import GeoJsonMixin, { reprojectToGeographic, toFeatureCollection } from "../../../ModelMixins/GeojsonMixin";
import GeoJsonCatalogItemTraits from "../../../Traits/TraitsClasses/GeoJsonCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import { featureCollection } from "@turf/helpers";
class GeoJsonCatalogItem extends GeoJsonMixin(CreateModel(GeoJsonCatalogItemTraits)) {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "_file", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        makeObservable(this);
    }
    get type() {
        return GeoJsonCatalogItem.type;
    }
    get typeName() {
        return i18next.t("models.geoJson.name");
    }
    setFileInput(file) {
        this._file = file;
    }
    get hasLocalData() {
        return isDefined(this._file);
    }
    /**
     * Tries to build a FeatureCollection from partial geojson data
     */
    featureCollectionFromPartialData(jsonData) {
        if (Array.isArray(jsonData)) {
            // Array that isn't a feature collection
            const fc = toFeatureCollection(jsonData.map((item) => {
                let geojson = item;
                if (this.responseGeoJsonPath !== undefined) {
                    geojson = _get(item, this.responseGeoJsonPath);
                    // Clear geojson so that it doesn't appear again in its own properties
                    _set(item, this.responseGeoJsonPath, undefined);
                }
                if (typeof geojson === "string") {
                    geojson = JSON.parse(geojson);
                }
                // add extra properties back to geojson so they appear in feature info
                geojson.properties = item;
                return geojson;
            }));
            if (fc)
                return fc;
        }
        else if (isJsonObject(jsonData, false) &&
            typeof jsonData.type === "string") {
            // Actual geojson
            const fc = toFeatureCollection(jsonData);
            if (fc)
                return fc;
        }
        return undefined;
    }
    async forceLoadGeojsonData() {
        let jsonData = undefined;
        // GeoJsonCatalogItemTraits.geoJsonData
        if (isDefined(this.geoJsonData)) {
            jsonData = toJS(this.geoJsonData);
        }
        // GeoJsonCatalogItemTraits.geoJsonData
        else if (isDefined(this.geoJsonString)) {
            jsonData = JSON.parse(this.geoJsonString);
            // GeojsonCatalogItem._file
        }
        // Zipped file
        else if (this._file) {
            if (isDefined(this._file.name) && isZip(this._file.name)) {
                const asAb = await this._file.arrayBuffer();
                jsonData = await parseZipJsonBlob(new Blob([asAb]));
            }
            else {
                jsonData = await readJson(this._file);
            }
        }
        // We have multiple sources.
        else if (this.urls.length > 0) {
            // Map each source to a FeatureCollection and then merge them to build a
            // single FeatureCollection
            const promises = this.urls.map(async (source) => {
                const json = await this.fetchSource(source);
                const fc = this.featureCollectionFromPartialData(json);
                // We need to reproject the FeatureCollection here as we will loose
                // specific CRS information when merging the multiple FCs.
                const geojson = await (fc
                    ? reprojectToGeographic(fc, this.terria.configParameters.proj4ServiceBaseUrl)
                    : undefined);
                return geojson;
            });
            const featureCollections = filterOutUndefined(await Promise.all(promises));
            // Forced type casting required as TS not happy with assigning
            // FeatureCollection to JsonValue
            jsonData = mergeFeatureCollections(featureCollections);
        }
        // GeojsonTraits.url
        else if (this.url) {
            jsonData = await this.fetchSource(this);
        }
        if (jsonData === undefined) {
            throw TerriaError.from("Failed to load geojson");
        }
        const fc = this.featureCollectionFromPartialData(jsonData);
        if (fc) {
            return fc;
        }
        throw TerriaError.from("Invalid geojson data - only FeatureCollection and Feature are supported");
    }
    async fetchSource(source) {
        const url = source.url;
        if (!url) {
            return;
        }
        let jsonData;
        // URL to zipped fle
        if (isZip(url)) {
            if (typeof FileReader === "undefined") {
                throw fileApiNotSupportedError(this.terria);
            }
            const body = source.requestData ? toJS(source.requestData) : undefined;
            const blob = await loadBlob(proxyCatalogItemUrl(this, url), undefined, body);
            jsonData = await parseZipJsonBlob(blob);
        }
        else {
            jsonData = await loadJson(proxyCatalogItemUrl(this, url), undefined, source.requestData ? toJS(source.requestData) : undefined, source.postRequestDataAsFormData);
            if (source.responseDataPath) {
                jsonData = _get(jsonData, source.responseDataPath);
            }
        }
        return jsonData;
    }
}
Object.defineProperty(GeoJsonCatalogItem, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "geojson"
});
__decorate([
    computed
], GeoJsonCatalogItem.prototype, "hasLocalData", null);
/**
 * Reduce an array of FeatureCollection into a single FeatureCollection.
 *
 * Note that this only accumulates the features and ignores any properties set
 * on the individual FeatureCollection.
 */
function mergeFeatureCollections(featureCollections) {
    return featureCollection(featureCollections.map((fc) => fc.features).flat());
}
export function fileApiNotSupportedError(terria) {
    return new TerriaError({
        title: i18next.t("models.userData.fileApiNotSupportedTitle"),
        message: i18next.t("models.userData.fileApiNotSupportedTitle", {
            appName: terria.appName,
            chrome: '<a href="http://www.google.com/chrome" target="_blank">' +
                i18next.t("browsers.chrome") +
                "</a>",
            firefox: '<a href="http://www.mozilla.org/firefox" target="_blank">' +
                i18next.t("browsers.firefox") +
                "</a>",
            edge: '<a href="http://www.microsoft.com/edge" target="_blank">' +
                i18next.t("browsers.edge") +
                "</a>"
        })
    });
}
export default GeoJsonCatalogItem;
//# sourceMappingURL=GeoJsonCatalogItem.js.map