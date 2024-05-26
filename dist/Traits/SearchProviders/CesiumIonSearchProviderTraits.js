var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import LocationSearchProviderTraits, { SearchProviderMapCenterTraits } from "./LocationSearchProviderTraits";
export default class CesiumIonSearchProviderTraits extends mixTraits(LocationSearchProviderTraits, SearchProviderMapCenterTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://api.cesium.com/v1/geocode/search"
        });
        Object.defineProperty(this, "key", {
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
        name: "Key",
        description: "The Cesium ION key. If not provided, will try to use the global cesium ion key."
    })
], CesiumIonSearchProviderTraits.prototype, "key", void 0);
//# sourceMappingURL=CesiumIonSearchProviderTraits.js.map