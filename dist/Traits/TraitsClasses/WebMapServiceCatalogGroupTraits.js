var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import ExportWebCoverageServiceTraits from "./ExportWebCoverageServiceTraits";
import GetCapabilitiesTraits from "./GetCapabilitiesTraits";
import GroupTraits from "./GroupTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import UrlTraits from "./UrlTraits";
export default class WebMapServiceCatalogGroupTraits extends mixTraits(GetCapabilitiesTraits, GroupTraits, UrlTraits, CatalogMemberTraits, LegendOwnerTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "flatten", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "perLayerLinkedWcs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Flatten",
        description: "True to flatten the layers into a single list; false to use the layer hierarchy."
    })
], WebMapServiceCatalogGroupTraits.prototype, "flatten", void 0);
__decorate([
    objectTrait({
        name: "Per layer WebCoverageService",
        description: "To enable Export/WebCoverageService for **all** WMS layers in this group, set `perLayerLinkedWcs.linkedWcsUrl`. `linkedWcsCoverage` will be set to the WMS layer `Name` if it is defined, layer `Title` otherwise.",
        type: ExportWebCoverageServiceTraits
    })
], WebMapServiceCatalogGroupTraits.prototype, "perLayerLinkedWcs", void 0);
//# sourceMappingURL=WebMapServiceCatalogGroupTraits.js.map