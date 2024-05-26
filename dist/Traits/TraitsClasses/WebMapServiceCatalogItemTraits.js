var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import { traitClass } from "../Trait";
import CatalogMemberTraits from "./CatalogMemberTraits";
import DiffableTraits from "./DiffableTraits";
import ExportWebCoverageServiceTraits from "./ExportWebCoverageServiceTraits";
import GetCapabilitiesTraits from "./GetCapabilitiesTraits";
import ImageryProviderTraits from "./ImageryProviderTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import LegendTraits from "./LegendTraits";
import MappableTraits from "./MappableTraits";
import { MinMaxLevelTraits } from "./MinMaxLevelTraits";
import UrlTraits from "./UrlTraits";
export const SUPPORTED_CRS_3857 = ["EPSG:3857", "EPSG:900913"];
export const SUPPORTED_CRS_4326 = ["EPSG:4326", "CRS:84", "EPSG:4283"];
export class WebMapServiceAvailableStyleTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "abstract", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "legend", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Style Name",
        description: "The name of the style."
    })
], WebMapServiceAvailableStyleTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Title",
        description: "The title of the style."
    })
], WebMapServiceAvailableStyleTraits.prototype, "title", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Abstract",
        description: "The abstract describing the style."
    })
], WebMapServiceAvailableStyleTraits.prototype, "abstract", void 0);
__decorate([
    objectTrait({
        type: LegendTraits,
        name: "Style Name",
        description: "The name of the style."
    })
], WebMapServiceAvailableStyleTraits.prototype, "legend", void 0);
export class WebMapServiceAvailableLayerStylesTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "layerName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "styles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Layer Name",
        description: "The name of the layer for which styles are available."
    })
], WebMapServiceAvailableLayerStylesTraits.prototype, "layerName", void 0);
__decorate([
    objectArrayTrait({
        type: WebMapServiceAvailableStyleTraits,
        name: "Styles",
        description: "The styles available for this layer.",
        idProperty: "name"
    })
], WebMapServiceAvailableLayerStylesTraits.prototype, "styles", void 0);
export class WebMapServiceAvailableDimensionTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "values", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "units", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "unitSymbol", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "default", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "multipleValues", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nearestValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Dimension Name",
        description: "The name of the dimension."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "name", void 0);
__decorate([
    primitiveArrayTrait({
        type: "string",
        name: "Dimension values",
        description: "Possible dimension values."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "values", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Units",
        description: "The units of the dimension."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "units", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Unit Symbol",
        description: "The unitSymbol of the dimension."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "unitSymbol", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Default",
        description: "The default value for the dimension."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "default", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Multiple Values",
        description: "Can the dimension support multiple values."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "multipleValues", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Nearest Value",
        description: "The nearest value of the dimension."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "nearestValue", void 0);
export class WebMapServiceAvailableLayerDimensionsTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "layerName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dimensions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Layer Name",
        description: "The name of the layer for which dimensions are available."
    })
], WebMapServiceAvailableLayerDimensionsTraits.prototype, "layerName", void 0);
__decorate([
    objectArrayTrait({
        type: WebMapServiceAvailableDimensionTraits,
        name: "Dimensions",
        description: "The dimensions available for this layer.",
        idProperty: "name"
    })
], WebMapServiceAvailableLayerDimensionsTraits.prototype, "dimensions", void 0);
export class GetFeatureInfoFormat extends ModelTraits {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "format", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Type",
        description: "The type of response to expect from a GetFeatureInfo request.  Valid values are 'json', 'xml', 'html', 'text' or 'csv'. If type is 'csv', then featureInfoContext will contain timeSeries object (see \"Customizing the Feature Info Template\" in documentation)"
    })
], GetFeatureInfoFormat.prototype, "type", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Format",
        description: "The info format to request from the WMS server.  This is usually a MIME type such as 'application/json' or text/xml'.  If this parameter is not specified, the provider will request 'json' using 'application/json', 'xml' using 'text/xml', 'html' using 'text/html', and 'text' using 'text/plain'."
    })
], GetFeatureInfoFormat.prototype, "format", void 0);
let WebMapServiceCatalogItemTraits = class WebMapServiceCatalogItemTraits extends mixTraits(ExportWebCoverageServiceTraits, DiffableTraits, LayerOrderingTraits, GetCapabilitiesTraits, ImageryProviderTraits, UrlTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits, MinMaxLevelTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "layers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "styles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "crs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dimensions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "availableStyles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "availableDimensions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "parameters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxRefreshIntervals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
        Object.defineProperty(this, "disableDimensionSelectors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "isGeoServer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "isEsri", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "isThredds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "isNcWMS", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "supportsColorScaleRange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "supportsGetLegendGraphic", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "supportsGetTimeseries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "colorScaleMinimum", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -50
        });
        Object.defineProperty(this, "colorScaleMaximum", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 50
        });
        Object.defineProperty(this, "useWmsVersion130", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "getFeatureInfoFormat", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "getFeatureInfoUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "getFeatureInfoParameters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    primitiveTrait({
        type: "string",
        name: "Layer(s)",
        description: "The layer or layers to display (comma separated values)."
    })
], WebMapServiceCatalogItemTraits.prototype, "layers", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Style(s)",
        description: "The styles to use with each of the `Layer(s)` (comma separated values). This maps one-to-one with `Layer(s)`"
    })
], WebMapServiceCatalogItemTraits.prototype, "styles", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Style(s)",
        description: `CRS to use with WMS layers. We support Web Mercator (${SUPPORTED_CRS_3857.join(", ")}) and WGS 84 (${SUPPORTED_CRS_4326.join(", ")})`
    })
], WebMapServiceCatalogItemTraits.prototype, "crs", void 0);
__decorate([
    anyTrait({
        name: "Dimensions",
        description: "Dimension parameters used to request a particular layer along one or more dimensional axes (including elevation, excluding time). Do not include `_dim` prefx for parameter keys. These dimensions will be applied to all layers (if applicable)"
    })
], WebMapServiceCatalogItemTraits.prototype, "dimensions", void 0);
__decorate([
    objectArrayTrait({
        type: WebMapServiceAvailableLayerStylesTraits,
        name: "Available Styles",
        description: "The available styles.",
        idProperty: "layerName"
    })
], WebMapServiceCatalogItemTraits.prototype, "availableStyles", void 0);
__decorate([
    objectArrayTrait({
        type: WebMapServiceAvailableLayerDimensionsTraits,
        name: "Available Dimensions",
        description: "The available dimensions.",
        idProperty: "layerName"
    })
], WebMapServiceCatalogItemTraits.prototype, "availableDimensions", void 0);
__decorate([
    anyTrait({
        name: "Parameters",
        description: "Additional parameters to pass WMS `GetMap` and `GetFeatureInfo` requests. Style parameters are stored as CSV in `styles`, dimension parameters are stored in `dimensions`."
    })
], WebMapServiceCatalogItemTraits.prototype, "parameters", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum Refresh Intervals",
        description: "The maximum number of discrete times that can be created by a single " +
            "date range, when specified in the format time/time/periodicity. E.g. " +
            "`2015-04-27T16:15:00/2015-04-27T18:45:00/PT15M` has 11 times."
    })
], WebMapServiceCatalogItemTraits.prototype, "maxRefreshIntervals", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Disable dimension selectors",
        description: "When true, disables the dimension selectors in the workbench."
    })
], WebMapServiceCatalogItemTraits.prototype, "disableDimensionSelectors", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is GeoServer",
        description: "True if this WMS is a GeoServer; otherwise, false."
    })
], WebMapServiceCatalogItemTraits.prototype, "isGeoServer", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is Esri",
        description: "True if this WMS is from Esri; otherwise, false."
    })
], WebMapServiceCatalogItemTraits.prototype, "isEsri", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is Thredds",
        description: "True if this WMS is from a THREDDS server; otherwise, false."
    })
], WebMapServiceCatalogItemTraits.prototype, "isThredds", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is NcWMS",
        description: "True if this WMS supports NcWMS."
    })
], WebMapServiceCatalogItemTraits.prototype, "isNcWMS", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Supports color scale range",
        description: "Gets or sets whether this WMS server has been identified as supporting the COLORSCALERANGE parameter."
    })
], WebMapServiceCatalogItemTraits.prototype, "supportsColorScaleRange", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Supports GetLegendGraphic requests",
        description: "Gets or sets whether this WMS server supports GetLegendGraphic requests."
    })
], WebMapServiceCatalogItemTraits.prototype, "supportsGetLegendGraphic", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Supports GetTimeseries requests",
        description: 'Gets or sets whether this WMS server supports GetTimeseries requests. If true, then GetTimeseries will be used instead of GetFeatureInfo. This will also set default value of `getFeatureInfoFormat` to `{ format: "text/csv", type: "text" }`'
    })
], WebMapServiceCatalogItemTraits.prototype, "supportsGetTimeseries", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Color scale minimum",
        description: "The minimum of the color scale range. Because COLORSCALERANGE is a non-standard property supported by ncWMS servers, this property is ignored unless WebMapServiceCatalogItem's supportsColorScaleRange is true. WebMapServiceCatalogItem's colorScaleMaximum must be set as well."
    })
], WebMapServiceCatalogItemTraits.prototype, "colorScaleMinimum", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Color scale maximum",
        description: "The maximum of the color scale range. Because COLORSCALERANGE is a non-standard property supported by ncWMS servers, this property is ignored unless WebMapServiceCatalogItem's supportsColorScaleRange is true. WebMapServiceCatalogItem's colorScaleMinimum must be set as well."
    })
], WebMapServiceCatalogItemTraits.prototype, "colorScaleMaximum", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Use WMS version 1.3.0",
        description: 'Use WMS version 1.3.0. True by default (unless `url` has `"version=1.1.1"` or `"version=1.1.0"`), if false, then WMS version 1.1.1 will be used.'
    })
], WebMapServiceCatalogItemTraits.prototype, "useWmsVersion130", void 0);
__decorate([
    objectTrait({
        type: GetFeatureInfoFormat,
        name: "GetFeatureInfo format",
        description: 'Format parameter to pass to GetFeatureInfo requests. Defaults to "application/json", "application/vnd.ogc.gml", "text/html" or "text/plain" - depending on GetCapabilities response'
    })
], WebMapServiceCatalogItemTraits.prototype, "getFeatureInfoFormat", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "GetFeatureInfo URL",
        description: "If defined, this URL will be used for `GetFeatureInfo` requests instead of `url`."
    })
], WebMapServiceCatalogItemTraits.prototype, "getFeatureInfoUrl", void 0);
__decorate([
    anyTrait({
        name: "Parameters",
        description: "Additional parameters to pass WMS `GetFeatureInfo` requests. If `parameters` trait is also defined, this is applied on top. Dimension parameters are stored in `dimensions`."
    })
], WebMapServiceCatalogItemTraits.prototype, "getFeatureInfoParameters", void 0);
WebMapServiceCatalogItemTraits = __decorate([
    traitClass({
        description: `Creates a single item in the catalog from one or many WMS layers.

<strong>Note:</strong> <i>To present all layers in an available WMS as individual items in the catalog use the \`WebMapServiceCatalogGroup\`.</i>`,
        example: {
            type: "wms",
            name: "Mangrove Cover",
            url: "https://ows.services.dea.ga.gov.au",
            layers: "mangrove_cover_v2_0_2"
        }
    })
], WebMapServiceCatalogItemTraits);
export default WebMapServiceCatalogItemTraits;
//# sourceMappingURL=WebMapServiceCatalogItemTraits.js.map