var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import ModelTraits from "../ModelTraits";
import { RectangleTraits } from "../TraitsClasses/MappableTraits";
export class SearchBarTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "placeholder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "translate#search.placeholder"
        });
        Object.defineProperty(this, "recommendedListLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5
        });
        Object.defineProperty(this, "flightDurationSeconds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1.5
        });
        Object.defineProperty(this, "minCharacters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
        });
        Object.defineProperty(this, "boundingBoxLimit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Rectangle.MAX_VALUE
        });
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "placeholder",
        description: "Input text field placeholder shown when no input has been given yet. The string is translateable."
    })
], SearchBarTraits.prototype, "placeholder", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Recommended list length",
        description: "Maximum amount of entries in the suggestion list."
    })
], SearchBarTraits.prototype, "recommendedListLength", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Flight duration seconds",
        description: "The duration of the camera flight to an entered location, in seconds."
    })
], SearchBarTraits.prototype, "flightDurationSeconds", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Minimum characters",
        description: "Minimum number of characters required for search to start"
    })
], SearchBarTraits.prototype, "minCharacters", void 0);
__decorate([
    objectTrait({
        type: RectangleTraits,
        name: "Bounding box limit",
        description: "Bounding box limits for the search results {west, south, east, north}"
    })
], SearchBarTraits.prototype, "boundingBoxLimit", void 0);
//# sourceMappingURL=SearchBarTraits.js.map