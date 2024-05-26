var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import TimeFilterTraits from "./TimeFilterTraits";
export default class DiffableTraits extends mixTraits(TimeFilterTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "availableDiffStyles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "isShowingDiff", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "firstDiffDate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "secondDiffDate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "diffStyleId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
__decorate([
    primitiveArrayTrait({
        type: "string",
        name: "Available diff styles",
        description: "List of styles that can be used for computing difference image"
    })
], DiffableTraits.prototype, "availableDiffStyles", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Show diff image",
        description: "True if currently showing diff image"
    })
], DiffableTraits.prototype, "isShowingDiff", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "First diff date",
        description: "The first date to use to compute the difference image"
    })
], DiffableTraits.prototype, "firstDiffDate", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Second diff date",
        description: "The second date to use to compute the difference image"
    })
], DiffableTraits.prototype, "secondDiffDate", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Diff style ID",
        description: "The ID of the style used to compute the difference image"
    })
], DiffableTraits.prototype, "diffStyleId", void 0);
//# sourceMappingURL=DiffableTraits.js.map