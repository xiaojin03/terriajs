var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import ModelTraits from "../ModelTraits";
export default class OpacityTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "opacity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.8
        });
        Object.defineProperty(this, "disableOpacityControl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Opacity",
        description: "The opacity of the item."
    })
], OpacityTraits.prototype, "opacity", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Disable opacity control",
        description: "When true, the user will be unable to change the opacity of the item"
    })
], OpacityTraits.prototype, "disableOpacityControl", void 0);
//# sourceMappingURL=OpacityTraits.js.map