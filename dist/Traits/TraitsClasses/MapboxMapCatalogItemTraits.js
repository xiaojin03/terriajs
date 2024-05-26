var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import ImageryProviderTraits from "./ImageryProviderTraits";
export default class MapboxMapCatalogItemTraits extends mixTraits(ImageryProviderTraits, CatalogMemberTraits, MappableTraits, LegendOwnerTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://api.mapbox.com/v4/"
        });
        Object.defineProperty(this, "mapId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "accessToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "format", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "png"
        });
    }
}
__decorate([
    primitiveTrait({
        name: "url",
        description: "The Mapbox server url.",
        type: "string"
    })
], MapboxMapCatalogItemTraits.prototype, "url", void 0);
__decorate([
    primitiveTrait({
        name: "mapId",
        description: "The Mapbox Map ID.",
        type: "string"
    })
], MapboxMapCatalogItemTraits.prototype, "mapId", void 0);
__decorate([
    primitiveTrait({
        name: "accessToken",
        description: "The public access token for the imagery.",
        type: "string"
    })
], MapboxMapCatalogItemTraits.prototype, "accessToken", void 0);
__decorate([
    primitiveTrait({
        name: "format",
        description: "The format of the image request.",
        type: "string"
    })
], MapboxMapCatalogItemTraits.prototype, "format", void 0);
//# sourceMappingURL=MapboxMapCatalogItemTraits.js.map