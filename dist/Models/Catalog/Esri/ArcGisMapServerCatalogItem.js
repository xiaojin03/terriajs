var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import uniqWith from "lodash-es/uniqWith";
import { computed, makeObservable, override, runInAction } from "mobx";
import { fromPromise } from "mobx-utils";
import moment from "moment";
import WebMercatorTilingScheme from "terriajs-cesium/Source/Core/WebMercatorTilingScheme";
import ArcGisMapServerImageryProvider from "terriajs-cesium/Source/Scene/ArcGisMapServerImageryProvider";
import URI from "urijs";
import createDiscreteTimesFromIsoSegments from "../../../Core/createDiscreteTimes";
import createTransformerAllowUndefined from "../../../Core/createTransformerAllowUndefined";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import loadJson from "../../../Core/loadJson";
import replaceUnderscores from "../../../Core/replaceUnderscores";
import { scaleDenominatorToLevel } from "../../../Core/scaleToDenominator";
import { setsAreEqual } from "../../../Core/setsAreEqual";
import TerriaError, { networkRequestError } from "../../../Core/TerriaError";
import Proj4Definitions from "../../../Map/Vector/Proj4Definitions";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import DiscretelyTimeVaryingMixin from "../../../ModelMixins/DiscretelyTimeVaryingMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import ArcGisMapServerCatalogItemTraits from "../../../Traits/TraitsClasses/ArcGisMapServerCatalogItemTraits";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import LegendTraits, { LegendItemTraits } from "../../../Traits/TraitsClasses/LegendTraits";
import { RectangleTraits } from "../../../Traits/TraitsClasses/MappableTraits";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import getToken from "../../getToken";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import MinMaxLevelMixin from "./../../../ModelMixins/MinMaxLevelMixin";
const proj4 = require("proj4").default;
class MapServerStratum extends LoadableStratum(ArcGisMapServerCatalogItemTraits) {
    constructor(_item, mapServer, allLayers, _legends, token) {
        super();
        Object.defineProperty(this, "_item", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: _item
        });
        Object.defineProperty(this, "mapServer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: mapServer
        });
        Object.defineProperty(this, "allLayers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: allLayers
        });
        Object.defineProperty(this, "_legends", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: _legends
        });
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: token
        });
        makeObservable(this);
    }
    duplicateLoadableStratum(newModel) {
        return new MapServerStratum(newModel, this.mapServer, this.allLayers, this._legends, this.token);
    }
    static async load(item) {
        var _a;
        if (!isDefined(item.uri)) {
            throw new TerriaError({
                title: i18next.t("models.arcGisMapServerCatalogItem.invalidUrlTitle"),
                message: i18next.t("models.arcGisMapServerCatalogItem.invalidUrlMessage")
            });
        }
        let token;
        if (isDefined(item.tokenUrl)) {
            token = await getToken(item.terria, item.tokenUrl, item.url);
        }
        let serviceUri = getBaseURI(item);
        let layersUri = getBaseURI(item).segment("layers");
        let legendUri = getBaseURI(item).segment("legend");
        if (isDefined(token)) {
            serviceUri = serviceUri.addQuery("token", token);
            layersUri = layersUri.addQuery("token", token);
            legendUri = legendUri.addQuery("token", token);
        }
        // TODO: if tokenUrl, fetch and pass token as parameter
        const serviceMetadata = await getJson(item, serviceUri);
        if (!isDefined(serviceMetadata)) {
            throw networkRequestError({
                title: i18next.t("models.arcGisService.invalidServerTitle"),
                message: i18next.t("models.arcGisService.invalidServerMessage")
            });
        }
        const legendMetadata = await getJson(item, legendUri);
        let layers = [];
        // If this MapServer is a single fused map cache - we can't request individual layers
        // If it is not - we request layer metadata
        if (!(serviceMetadata.singleFusedMapCache &&
            ((_a = serviceMetadata.capabilities) === null || _a === void 0 ? void 0 : _a.includes("TilesOnly")))) {
            const layersMetadataResponse = await getJson(item, layersUri);
            // Use the slightly more basic layer metadata
            if (isDefined(serviceMetadata.layers)) {
                layers = serviceMetadata.layers;
            }
            if (isDefined(layersMetadataResponse === null || layersMetadataResponse === void 0 ? void 0 : layersMetadataResponse.layers)) {
                layers = layersMetadataResponse.layers;
            }
            if (!isDefined(layers) || layers.length === 0) {
                throw networkRequestError({
                    title: i18next.t("models.arcGisMapServerCatalogItem.noLayersFoundTitle"),
                    message: i18next.t("models.arcGisMapServerCatalogItem.noLayersFoundMessage", item)
                });
            }
        }
        const stratum = new MapServerStratum(item, serviceMetadata, layers, legendMetadata, token);
        return stratum;
    }
    get maximumScale() {
        if (this._item.layersArray.length === 0) {
            return this.mapServer.maxScale;
        }
        return Math.min(...filterOutUndefined(this._item.layersArray.map(({ maxScale }) => maxScale)));
    }
    get layers() {
        /** Try to pull out MapServer layer from URL
         * eg https://exmaple.com/arcgis/rest/services/MapServer/{layer}
         */
        if (isDefined(this._item.uri)) {
            const lastSegment = this._item.uri.segment(-1);
            if (isDefined(lastSegment) && lastSegment.match(/\d+/)) {
                return lastSegment;
            }
        }
    }
    get name() {
        // single layer
        if (this._item.layersArray.length === 1 &&
            this._item.layersArray[0].name &&
            this._item.layersArray[0].name.length > 0) {
            return replaceUnderscores(this._item.layersArray[0].name);
        }
        // group of layers (or single fused map cache)
        else if (this.mapServer.documentInfo &&
            this.mapServer.documentInfo.Title &&
            this.mapServer.documentInfo.Title.length > 0) {
            return replaceUnderscores(this.mapServer.documentInfo.Title);
        }
        else if (this.mapServer.mapName && this.mapServer.mapName.length > 0) {
            return replaceUnderscores(this.mapServer.mapName);
        }
    }
    get dataCustodian() {
        if (this.mapServer.documentInfo &&
            this.mapServer.documentInfo.Author &&
            this.mapServer.documentInfo.Author.length > 0) {
            return this.mapServer.documentInfo.Author;
        }
    }
    get rectangle() {
        const rectangle = {
            west: Infinity,
            south: Infinity,
            east: -Infinity,
            north: -Infinity
        };
        // If we only have the summary layer info
        if (this._item.layersArray.length === 0 ||
            !("extent" in this._item.layersArray[0])) {
            getRectangleFromLayer(this.mapServer.fullExtent, rectangle);
        }
        else {
            getRectangleFromLayers(rectangle, this._item.layersArray);
        }
        if (rectangle.west === Infinity)
            return;
        return createStratumInstance(RectangleTraits, rectangle);
    }
    get info() {
        var _a;
        // If we are requesting a single layer, use it to populate InfoSections
        // If we are requesting multiple layers - we only show MapServer metadata (not metadata per layer)
        const singleLayer = this._item.layersArray.length === 1
            ? this._item.layersArray[0]
            : undefined;
        return filterOutUndefined([
            singleLayer
                ? createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.arcGisMapServerCatalogItem.dataDescription"),
                    content: singleLayer.description
                })
                : undefined,
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogItem.serviceDescription"),
                content: this.mapServer.description
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogItem.copyrightText"),
                content: (_a = singleLayer === null || singleLayer === void 0 ? void 0 : singleLayer.copyrightText) !== null && _a !== void 0 ? _a : this.mapServer.copyrightText
            })
        ]);
    }
    get legends() {
        var _a;
        const layers = this._item.layersArray;
        const noDataRegex = /^No[\s_-]?Data$/i;
        const labelsRegex = /_Labels$/;
        let items = [];
        (((_a = this._legends) === null || _a === void 0 ? void 0 : _a.layers) || []).forEach((l) => {
            var _a;
            if (noDataRegex.test(l.layerName) || labelsRegex.test(l.layerName)) {
                return;
            }
            if (layers.length > 0 &&
                !layers.find((layer) => layer.id === l.layerId) &&
                !layers.find((layer) => layer.name === l.layerName)) {
                // layer not selected
                return;
            }
            (_a = l.legend) === null || _a === void 0 ? void 0 : _a.forEach((leg) => {
                const title = replaceUnderscores(leg.label !== "" ? leg.label : l.layerName);
                const dataUrl = "data:" + leg.contentType + ";base64," + leg.imageData;
                items.push(createStratumInstance(LegendItemTraits, {
                    title,
                    imageUrl: dataUrl,
                    imageWidth: leg.width,
                    imageHeight: leg.height
                }));
            });
        });
        items = uniqWith(items, (a, b) => a.imageUrl === b.imageUrl);
        return [createStratumInstance(LegendTraits, { items })];
    }
}
Object.defineProperty(MapServerStratum, "stratumName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "mapServer"
});
__decorate([
    computed
], MapServerStratum.prototype, "maximumScale", null);
__decorate([
    computed
], MapServerStratum.prototype, "layers", null);
__decorate([
    computed
], MapServerStratum.prototype, "name", null);
__decorate([
    computed
], MapServerStratum.prototype, "dataCustodian", null);
__decorate([
    computed
], MapServerStratum.prototype, "rectangle", null);
__decorate([
    computed
], MapServerStratum.prototype, "info", null);
__decorate([
    computed
], MapServerStratum.prototype, "legends", null);
StratumOrder.addLoadStratum(MapServerStratum.stratumName);
class ArcGisMapServerCatalogItem extends UrlMixin(DiscretelyTimeVaryingMixin(MinMaxLevelMixin(CatalogMemberMixin(MappableMixin(CreateModel(ArcGisMapServerCatalogItemTraits)))))) {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "_createImageryProvider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createTransformerAllowUndefined((timeParams) => {
                const stratum = this.strata.get(MapServerStratum.stratumName);
                if (!isDefined(this.url) || !isDefined(stratum)) {
                    return fromPromise(Promise.resolve(undefined));
                }
                const params = Object.assign({}, this.parameters);
                const currentTime = timeParams === null || timeParams === void 0 ? void 0 : timeParams.currentTime;
                if (currentTime !== undefined) {
                    const windowDuration = this.windowDurationInMs(timeParams === null || timeParams === void 0 ? void 0 : timeParams.timeWindowDuration, timeParams === null || timeParams === void 0 ? void 0 : timeParams.timeWindowUnit);
                    if (windowDuration !== undefined) {
                        params.time = this.getTimeWindowQueryString(currentTime, windowDuration, timeParams === null || timeParams === void 0 ? void 0 : timeParams.isForwardTimeWindow);
                    }
                    else {
                        params.time = currentTime;
                    }
                }
                const maximumLevel = scaleDenominatorToLevel(this.maximumScale, true, false);
                const imageryProviderPromise = ArcGisMapServerImageryProvider.fromUrl(cleanAndProxyUrl(this, getBaseURI(this).toString()), {
                    layers: this.layersArray.map((l) => l.id).join(","),
                    tilingScheme: new WebMercatorTilingScheme(),
                    maximumLevel: maximumLevel,
                    tileHeight: this.tileHeight,
                    tileWidth: this.tileWidth,
                    parameters: params,
                    enablePickFeatures: this.allowFeaturePicking,
                    /** Only used "pre-cached" tiles if we aren't requesting any specific layers
                     * If the `layersArray` property is specified, we request individual dynamic layers and ignore the fused map cache.
                     */
                    usePreCachedTilesIfAvailable: this.layersArray.length === 0 ||
                        !this.layers ||
                        setsAreEqual(this.layersArray.map((l) => l.id), stratum.allLayers.map((l) => l.id)),
                    mapServerData: stratum.mapServer,
                    token: stratum.token,
                    credit: this.attribution
                });
                return fromPromise(this.updateRequestImageAsync(imageryProviderPromise, false));
            })
        });
        makeObservable(this);
    }
    get typeName() {
        return i18next.t("models.arcGisMapServerCatalogItem.name");
    }
    get type() {
        return ArcGisMapServerCatalogItem.type;
    }
    async forceLoadMetadata() {
        const stratum = await MapServerStratum.load(this);
        runInAction(() => {
            this.strata.set(MapServerStratum.stratumName, stratum);
        });
    }
    forceLoadMapItems() {
        return Promise.all([
            this._currentImageryPromise,
            this._nextImageryPromise
        ]).then(() => { });
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    get discreteTimes() {
        const mapServerStratum = this.strata.get(MapServerStratum.stratumName);
        if ((mapServerStratum === null || mapServerStratum === void 0 ? void 0 : mapServerStratum.mapServer.timeInfo) === undefined)
            return undefined;
        // Add union type - as `time` is always defined
        const result = [];
        createDiscreteTimesFromIsoSegments(result, new Date(mapServerStratum.mapServer.timeInfo.timeExtent[0]).toISOString(), new Date(mapServerStratum.mapServer.timeInfo.timeExtent[1]).toISOString(), undefined, this.maxRefreshIntervals);
        return result;
    }
    getCurrentTime() {
        const dateAsUnix = this.currentDiscreteTimeTag === undefined
            ? undefined
            : new Date(this.currentDiscreteTimeTag).getTime();
        return dateAsUnix;
    }
    get timeParams() {
        const currentTime = this.getCurrentTime();
        const timeWindowDuration = this.timeWindowDuration;
        const timeWindowUnit = this.timeWindowUnit;
        const isForwardTimeWindow = this.isForwardTimeWindow;
        const timeParams = {
            currentTime,
            timeWindowDuration,
            timeWindowUnit,
            isForwardTimeWindow
        };
        return timeParams;
    }
    get _currentImageryPromise() {
        const timeParams = this.timeParams;
        return this._createImageryProvider(timeParams);
    }
    get _currentImageryParts() {
        const imageryProviderObservablePromise = this._currentImageryPromise;
        // Return an ImageryPart when the the promise is fulfilled with a valid imageryProvider
        const imageryPart = imageryProviderObservablePromise.value instanceof
            ArcGisMapServerImageryProvider
            ? {
                imageryProvider: imageryProviderObservablePromise.value,
                alpha: this.opacity,
                show: this.show,
                clippingRectangle: this.clipToRectangle
                    ? this.cesiumRectangle
                    : undefined
            }
            : undefined;
        return imageryPart;
    }
    get _nextImageryPromise() {
        if (this.terria.timelineStack.contains(this) &&
            !this.isPaused &&
            this.nextDiscreteTimeTag) {
            const timeParams = this.timeParams;
            return this._createImageryProvider(timeParams);
        }
        else {
            return undefined;
        }
    }
    get _nextImageryParts() {
        const imageryProviderObservablePromise = this._nextImageryPromise;
        if (isDefined(imageryProviderObservablePromise)) {
            imageryProviderObservablePromise.case({
                fulfilled: (imageryProvider) => {
                    // Disable feature picking for the next imagery layer
                    if (imageryProvider instanceof ArcGisMapServerImageryProvider)
                        imageryProvider.enablePickFeatures = false;
                }
            });
            // Return an ImageryPart when the the promise is fulfilled with a valid imageryProvider
            const imageryPart = imageryProviderObservablePromise.value instanceof
                ArcGisMapServerImageryProvider
                ? {
                    imageryProvider: imageryProviderObservablePromise.value,
                    alpha: 0.0,
                    show: true,
                    clippingRectangle: this.clipToRectangle
                        ? this.cesiumRectangle
                        : undefined
                }
                : undefined;
            return imageryPart;
        }
        else {
            return undefined;
        }
    }
    windowDurationInMs(rawTimeWindowDuration, timeWindowUnit) {
        if (rawTimeWindowDuration === undefined ||
            rawTimeWindowDuration === 0 ||
            timeWindowUnit === undefined) {
            return undefined;
        }
        const rawTimeWindowData = {};
        rawTimeWindowData[timeWindowUnit] = rawTimeWindowDuration;
        const duration = moment.duration(rawTimeWindowData).asMilliseconds();
        if (duration === 0) {
            return undefined;
        }
        else {
            return duration;
        }
    }
    getTimeWindowQueryString(currentTime, duration, isForward = true) {
        if (isForward) {
            const toTime = Number(currentTime) + duration;
            return currentTime + "," + toTime;
        }
        else {
            const fromTime = Number(currentTime) - duration;
            return "" + fromTime + "," + currentTime;
        }
    }
    get mapItems() {
        const result = [];
        const current = this._currentImageryParts;
        if (current) {
            result.push(current);
        }
        const next = this._nextImageryParts;
        if (next) {
            result.push(next);
        }
        return result;
    }
    /** Return array of MapServer layers from `layers` trait (which is CSV of layer IDs) - this will only return **valid** MapServer layers.*/
    get layersArray() {
        const stratum = this.strata.get(MapServerStratum.stratumName);
        if (!stratum)
            return [];
        return filterOutUndefined(findLayers(stratum.allLayers, this.layers));
    }
}
Object.defineProperty(ArcGisMapServerCatalogItem, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "esri-mapServer"
});
export default ArcGisMapServerCatalogItem;
__decorate([
    override
], ArcGisMapServerCatalogItem.prototype, "cacheDuration", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "discreteTimes", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "timeParams", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "_currentImageryPromise", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "_nextImageryPromise", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "_nextImageryParts", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "mapItems", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "layersArray", null);
function getBaseURI(item) {
    const uri = new URI(item.url);
    const lastSegment = uri.segment(-1);
    if (lastSegment && lastSegment.match(/\d+/)) {
        uri.segment(-1, "");
    }
    return uri;
}
async function getJson(item, uri) {
    try {
        const response = await loadJson(proxyCatalogItemUrl(item, uri.addQuery("f", "json").toString()));
        return response;
    }
    catch (err) {
        console.log(err);
        return undefined;
    }
}
/* Given a comma-separated string of layer names, returns the layer objects corresponding to them. */
function findLayers(layers, names) {
    function findLayer(layers, id) {
        const idLowerCase = id.toLowerCase();
        let foundByName;
        for (let i = 0; i < layers.length; ++i) {
            const layer = layers[i];
            if (layer.id.toString() === id) {
                return layer;
            }
            else if (isDefined(layer.name) &&
                layer.name.toLowerCase() === idLowerCase) {
                foundByName = layer;
            }
        }
        return foundByName;
    }
    if (!isDefined(names)) {
        // If a list of layers is not specified, we're using all layers.
        return layers;
    }
    return names.split(",").map(function (id) {
        return findLayer(layers, id);
    });
}
function updateBbox(extent, rectangle) {
    if (extent.xmin < rectangle.west)
        rectangle.west = extent.xmin;
    if (extent.ymin < rectangle.south)
        rectangle.south = extent.ymin;
    if (extent.xmax > rectangle.east)
        rectangle.east = extent.xmax;
    if (extent.ymax > rectangle.north)
        rectangle.north = extent.ymax;
}
function getRectangleFromLayer(extent, rectangle) {
    var _a, _b, _c;
    const wkidCode = (_b = (_a = extent === null || extent === void 0 ? void 0 : extent.spatialReference) === null || _a === void 0 ? void 0 : _a.latestWkid) !== null && _b !== void 0 ? _b : (_c = extent === null || extent === void 0 ? void 0 : extent.spatialReference) === null || _c === void 0 ? void 0 : _c.wkid;
    if (isDefined(extent) && isDefined(wkidCode)) {
        if (wkidCode === 4326) {
            return updateBbox(extent, rectangle);
        }
        const wkid = "EPSG:" + wkidCode;
        if (!isDefined(Proj4Definitions[wkid])) {
            return;
        }
        const source = new proj4.Proj(Proj4Definitions[wkid]);
        const dest = new proj4.Proj("EPSG:4326");
        let p = proj4(source, dest, [extent.xmin, extent.ymin]);
        const west = p[0];
        const south = p[1];
        p = proj4(source, dest, [extent.xmax, extent.ymax]);
        const east = p[0];
        const north = p[1];
        return updateBbox({ xmin: west, ymin: south, xmax: east, ymax: north }, rectangle);
    }
}
function getRectangleFromLayers(rectangle, layers) {
    layers.forEach(function (item) {
        item.extent && getRectangleFromLayer(item.extent, rectangle);
    });
}
function cleanAndProxyUrl(catalogItem, url) {
    return proxyCatalogItemUrl(catalogItem, cleanUrl(url));
}
function cleanUrl(url) {
    // Strip off the search portion of the URL
    const uri = new URI(url);
    uri.search("");
    return uri.toString();
}
//# sourceMappingURL=ArcGisMapServerCatalogItem.js.map