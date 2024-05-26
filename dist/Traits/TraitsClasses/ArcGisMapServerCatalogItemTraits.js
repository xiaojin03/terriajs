var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import { traitClass } from "../Trait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import DiscretelyTimeVaryingTraits from "./DiscretelyTimeVaryingTraits";
import ImageryProviderTraits from "./ImageryProviderTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import { MinMaxLevelTraits } from "./MinMaxLevelTraits";
import UrlTraits from "./UrlTraits";
let ArcGisMapServerCatalogItemTraits = class ArcGisMapServerCatalogItemTraits extends mixTraits(ImageryProviderTraits, LayerOrderingTraits, UrlTraits, CatalogMemberTraits, LegendOwnerTraits, DiscretelyTimeVaryingTraits, MinMaxLevelTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "layers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maximumScale", {
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
        Object.defineProperty(this, "tokenUrl", {
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
        Object.defineProperty(this, "timeWindowDuration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timeWindowUnit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isForwardTimeWindow", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
};
__decorate([
    primitiveTrait({
        type: "string",
        name: "Layer(s)",
        description: "The layer or layers to display. This can be a comma separated string of layer IDs or names."
    })
], ArcGisMapServerCatalogItemTraits.prototype, "layers", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum scale",
        description: "Gets or sets the denominator of the largest scale (smallest denominator) for which tiles should be requested.  For example, if this value is 1000, then tiles representing a scale larger than 1:1000 (i.e. numerically smaller denominator, when zooming in closer) will not be requested.  Instead, tiles of the largest-available scale, as specified by this property, will be used and will simply get blurier as the user zooms in closer."
    })
], ArcGisMapServerCatalogItemTraits.prototype, "maximumScale", void 0);
__decorate([
    anyTrait({
        name: "Parameters",
        description: "Additional parameters to pass to the MapServer when requesting images."
    })
], ArcGisMapServerCatalogItemTraits.prototype, "parameters", void 0);
__decorate([
    primitiveTrait({
        name: "Token URL",
        description: "URL to use for fetching request tokens",
        type: "string"
    })
], ArcGisMapServerCatalogItemTraits.prototype, "tokenUrl", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum Refresh Intervals",
        description: "The maximum number of discrete times that can be created by a single " +
            "date range when layer in time-enabled."
    })
], ArcGisMapServerCatalogItemTraits.prototype, "maxRefreshIntervals", void 0);
__decorate([
    primitiveTrait({
        name: "Time Window Duration",
        description: "Specify a time window duration when querying a time-enabled layer. Will not query with time window for non-positive value",
        type: "number"
    })
], ArcGisMapServerCatalogItemTraits.prototype, "timeWindowDuration", void 0);
__decorate([
    primitiveTrait({
        name: "Time Window Unit",
        description: "The time window unit for the `Time Window Duration`. Any units supported by `moment` module are valid, such as, `year`, `month`, `week`, `day`, `hour`, etc. Will not query time with window if the unit is invalid or undefined.",
        type: "string"
    })
], ArcGisMapServerCatalogItemTraits.prototype, "timeWindowUnit", void 0);
__decorate([
    primitiveTrait({
        name: "Is Forward Time Window",
        description: "If true, the time window is forward from the current time. Otherwise backward. Default to forward window.",
        type: "boolean"
    })
], ArcGisMapServerCatalogItemTraits.prototype, "isForwardTimeWindow", void 0);
ArcGisMapServerCatalogItemTraits = __decorate([
    traitClass({
        description: `Creates a single item in the catalog from one or many ESRI WMS layers.

  <strong>Note:</strong> <i>The following example does not specify <b>layers</b> property therefore will present all layers in the given URL as single catalog item. To present specific layers only, add them in <b>layers</b> property, e.g. <code>"layers": "AUS_GA_2500k_MiscLines,AUS_GA_2500k_Faults"</code>.</i>`,
        example: {
            url: "https://services.ga.gov.au/gis/rest/services/GA_Surface_Geology/MapServer",
            type: "esri-mapServer",
            name: "Surface Geology"
        }
    })
], ArcGisMapServerCatalogItemTraits);
export default ArcGisMapServerCatalogItemTraits;
//# sourceMappingURL=ArcGisMapServerCatalogItemTraits.js.map