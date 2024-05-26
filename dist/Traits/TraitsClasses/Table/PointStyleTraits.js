var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../../Decorators/objectArrayTrait";
import objectTrait from "../../Decorators/objectTrait";
import primitiveArrayTrait from "../../Decorators/primitiveArrayTrait";
import primitiveTrait from "../../Decorators/primitiveTrait";
import mixTraits from "../../mixTraits";
import ScaleByDistanceTraits from "../ScaleByDistanceTraits";
import { BinStyleTraits, EnumStyleTraits, TableStyleMapSymbolTraits, TableStyleMapTraits } from "./StyleMapTraits";
export class PointSymbolTraits extends mixTraits(TableStyleMapSymbolTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "marker", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "point"
        });
        Object.defineProperty(this, "rotation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "pixelOffset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 16
        });
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 16
        });
        Object.defineProperty(this, "scaleByDistance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "disableDepthTestDistance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
__decorate([
    primitiveTrait({
        name: "Marker (icon)",
        description: 'Marker used to symbolize points. Default is "point"/"circle". This can be data URI or one of the supported [Maki icons](https://labs.mapbox.com/maki-icons/) (eg "hospital")',
        type: "string"
    })
], PointSymbolTraits.prototype, "marker", void 0);
__decorate([
    primitiveTrait({
        name: "Rotation",
        description: "Rotation of marker in degrees (clockwise).",
        type: "number"
    })
], PointSymbolTraits.prototype, "rotation", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Pixel offset",
        description: "Pixel offset in screen space from the origin. [x, y] format",
        type: "number"
    })
], PointSymbolTraits.prototype, "pixelOffset", void 0);
__decorate([
    primitiveTrait({
        name: "Height",
        description: "Height of the marker (in pixels).",
        type: "number"
    })
], PointSymbolTraits.prototype, "height", void 0);
__decorate([
    primitiveTrait({
        name: "Width",
        description: "Width of the marker (in pixels).",
        type: "number"
    })
], PointSymbolTraits.prototype, "width", void 0);
__decorate([
    objectTrait({
        name: "Scale by distance",
        description: "Scales a point, billboard or label feature by its distance from the camera.",
        type: ScaleByDistanceTraits,
        isNullable: true
    })
], PointSymbolTraits.prototype, "scaleByDistance", void 0);
__decorate([
    primitiveTrait({
        name: "Disable depth test distance",
        description: "The distance from camera at which to disable depth testing, for example to prevent clipping of features againts terrain. Set to a very large value like 99999999 to disable depth testing altogether. When not defined or set to 0, depth testing is always applied.",
        type: "number"
    })
], PointSymbolTraits.prototype, "disableDepthTestDistance", void 0);
export class EnumPointSymbolTraits extends mixTraits(PointSymbolTraits, EnumStyleTraits) {
}
Object.defineProperty(EnumPointSymbolTraits, "isRemoval", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: EnumStyleTraits.isRemoval
});
export class BinPointSymbolTraits extends mixTraits(PointSymbolTraits, BinStyleTraits) {
}
Object.defineProperty(BinPointSymbolTraits, "isRemoval", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: BinStyleTraits.isRemoval
});
export default class TablePointStyleTraits extends mixTraits(TableStyleMapTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "enum", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "bin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "null", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new PointSymbolTraits()
        });
    }
}
__decorate([
    objectArrayTrait({
        name: "Enum point styles",
        description: "The point style to use for enumerated values.",
        type: EnumPointSymbolTraits,
        idProperty: "index"
    })
], TablePointStyleTraits.prototype, "enum", void 0);
__decorate([
    objectArrayTrait({
        name: "Bin point styles",
        description: "The point style to use for bin values.",
        type: BinPointSymbolTraits,
        idProperty: "index"
    })
], TablePointStyleTraits.prototype, "bin", void 0);
__decorate([
    objectTrait({
        name: "Enum Colors",
        description: "The default point style.",
        type: PointSymbolTraits
    })
], TablePointStyleTraits.prototype, "null", void 0);
//# sourceMappingURL=PointStyleTraits.js.map