var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class ShadowTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "shadows", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "NONE"
        });
        Object.defineProperty(this, "showShadowUi", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Shadows",
        description: "Determines whether the tileset casts or receives shadows from each light source."
    })
], ShadowTraits.prototype, "shadows", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Show Shadow UI",
        description: "Determines whether the shadow UI component will be shown on the workbench item"
    })
], ShadowTraits.prototype, "showShadowUi", void 0);
//# sourceMappingURL=ShadowTraits.js.map