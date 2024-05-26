var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ArcGisPortalSharedTraits from "./ArcGisPortalSharedTraits";
import CatalogMemberReferenceTraits from "./CatalogMemberReferenceTraits";
import MappableTraits from "./MappableTraits";
import mixTraits from "../mixTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import UrlTraits from "./UrlTraits";
import { traitClass } from "../Trait";
let ArcGisPortalItemTraits = class ArcGisPortalItemTraits extends mixTraits(UrlTraits, MappableTraits, CatalogMemberReferenceTraits, ArcGisPortalSharedTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "itemId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    primitiveTrait({
        name: "Item ID",
        description: "The ID of the portal item.",
        type: "string"
    })
], ArcGisPortalItemTraits.prototype, "itemId", void 0);
ArcGisPortalItemTraits = __decorate([
    traitClass({
        description: `Creates an item or group that referehces an item in ArcGIS portal.
  <strong>Note:</strong> 
  <li>The <code>itemId</code> in the example is the referenced item's ID in the portal.</li>
  <li>Not all referenced items can be added to the map. E.g., some types need conversions.</li>`,
        example: {
            type: "arcgis-portal-item",
            itemId: "084c61c6dd404517bc2db69079ddec38",
            name: "NSW Administrative Theme",
            url: "https://portal.spatial.nsw.gov.au/portal",
            id: "some id"
        }
    })
], ArcGisPortalItemTraits);
export default ArcGisPortalItemTraits;
//# sourceMappingURL=ArcGisPortalItemTraits.js.map