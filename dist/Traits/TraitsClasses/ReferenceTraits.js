var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import { ItemPropertiesTraits } from "./ItemPropertiesTraits";
export default class ReferenceTraits extends mixTraits(ItemPropertiesTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "isOpenInWorkbench", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is catalog item open in workbench",
        description: "Whether the item in the workbench open or collapsed."
    })
], ReferenceTraits.prototype, "isOpenInWorkbench", void 0);
//# sourceMappingURL=ReferenceTraits.js.map