var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../../Decorators/objectArrayTrait";
import objectTrait from "../../Decorators/objectTrait";
import primitiveTrait from "../../Decorators/primitiveTrait";
import mixTraits from "../../mixTraits";
import { BinStyleTraits, EnumStyleTraits, TableStyleMapSymbolTraits, TableStyleMapTraits } from "./StyleMapTraits";
export class OutlineSymbolTraits extends mixTraits(TableStyleMapSymbolTraits) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
    }
}
__decorate([
    primitiveTrait({
        name: "Color",
        description: "Outline color.",
        type: "string"
    })
], OutlineSymbolTraits.prototype, "color", void 0);
__decorate([
    primitiveTrait({
        name: "Width",
        description: "Outline width (in pixels).",
        type: "number"
    })
], OutlineSymbolTraits.prototype, "width", void 0);
export class EnumOutlineSymbolTraits extends mixTraits(OutlineSymbolTraits, EnumStyleTraits) {
}
Object.defineProperty(EnumOutlineSymbolTraits, "isRemoval", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: EnumStyleTraits.isRemoval
});
export class BinOutlineSymbolTraits extends mixTraits(OutlineSymbolTraits, BinStyleTraits) {
}
Object.defineProperty(BinOutlineSymbolTraits, "isRemoval", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: BinStyleTraits.isRemoval
});
export default class TableOutlineStyleTraits extends mixTraits(TableStyleMapTraits) {
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
            value: new OutlineSymbolTraits()
        });
    }
}
__decorate([
    objectArrayTrait({
        name: "Enum Colors",
        description: "The outline style to use for enumerated values.",
        type: EnumOutlineSymbolTraits,
        idProperty: "value"
    })
], TableOutlineStyleTraits.prototype, "enum", void 0);
__decorate([
    objectArrayTrait({
        name: "Enum Colors",
        description: "The outline style to use for bin values.",
        type: BinOutlineSymbolTraits,
        idProperty: "index"
    })
], TableOutlineStyleTraits.prototype, "bin", void 0);
__decorate([
    objectTrait({
        name: "Enum Colors",
        description: "The default outline style.",
        type: OutlineSymbolTraits
    })
], TableOutlineStyleTraits.prototype, "null", void 0);
//# sourceMappingURL=OutlineStyleTraits.js.map