var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectTrait from "../../Decorators/objectTrait";
import primitiveTrait from "../../Decorators/primitiveTrait";
import ModelTraits from "../../ModelTraits";
import TableChartStyleTraits from "./ChartStyleTraits";
import TableColorStyleTraits from "./ColorStyleTraits";
import TableLabelStyleTraits from "./LabelStyleTraits";
import TableOutlineStyleTraits from "./OutlineStyleTraits";
import TablePointSizeStyleTraits from "./PointSizeStyleTraits";
import TablePointStyleTraits from "./PointStyleTraits";
import TableTrailStyleTraits from "./TrailStyleTraits";
import TableTimeStyleTraits from "./TimeStyleTraits";
export default class TableStyleTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "regionColumn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "latitudeColumn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "longitudeColumn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "point", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new TablePointStyleTraits()
        });
        Object.defineProperty(this, "outline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new TableOutlineStyleTraits()
        });
        Object.defineProperty(this, "trail", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new TableTrailStyleTraits()
        });
        Object.defineProperty(this, "label", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new TableLabelStyleTraits()
        });
        Object.defineProperty(this, "pointSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "chart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "time", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hidden", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    static isRemoval(style) {
        return style.title === null;
    }
}
__decorate([
    primitiveTrait({
        name: "ID",
        description: "The ID of the style.",
        type: "string"
    })
], TableStyleTraits.prototype, "id", void 0);
__decorate([
    primitiveTrait({
        name: "Title",
        description: "The human-readable title of the style. Set this to null to remove the style entirely.",
        type: "string",
        isNullable: true
    })
], TableStyleTraits.prototype, "title", void 0);
__decorate([
    primitiveTrait({
        name: "Region Column",
        description: "The column to use for region mapping.",
        type: "string",
        isNullable: true
    })
], TableStyleTraits.prototype, "regionColumn", void 0);
__decorate([
    primitiveTrait({
        name: "Latitude Column",
        description: "The column to use for the latitude of points. If `Region Column` is specified, this property is ignored.",
        type: "string"
    })
], TableStyleTraits.prototype, "latitudeColumn", void 0);
__decorate([
    primitiveTrait({
        name: "Longitude Column",
        description: "The column to use for the longitude of points. If `Region Column` is specified, this property is ignored.",
        type: "string"
    })
], TableStyleTraits.prototype, "longitudeColumn", void 0);
__decorate([
    objectTrait({
        name: "Color",
        description: "Options for controlling the color of points or regions.",
        type: TableColorStyleTraits
    })
], TableStyleTraits.prototype, "color", void 0);
__decorate([
    objectTrait({
        name: "Color",
        description: "Options for controlling the symbolization. This excludes color (see TableColorStyleTraits) and pointSize (see TablePointSizeStyleTraits).",
        type: TablePointStyleTraits
    })
], TableStyleTraits.prototype, "point", void 0);
__decorate([
    objectTrait({
        name: "Color",
        description: "Options for controlling the symbolization. This excludes color (see TableColorStyleTraits) and pointSize (see TablePointSizeStyleTraits).",
        type: TableOutlineStyleTraits
    })
], TableStyleTraits.prototype, "outline", void 0);
__decorate([
    objectTrait({
        name: "Point trail",
        description: "Options for controlling the trail or path behind a time-series point.",
        type: TableTrailStyleTraits
    })
], TableStyleTraits.prototype, "trail", void 0);
__decorate([
    objectTrait({
        name: "Label",
        description: "Options for controlling the labels.",
        type: TableLabelStyleTraits
    })
], TableStyleTraits.prototype, "label", void 0);
__decorate([
    objectTrait({
        name: "Point Size",
        description: "Options for controlling the size of points. This property is ignored for regions. This will override TablePointStyleTraits marker width/height if `pointSize.column` can be resolved to scalar column",
        type: TablePointSizeStyleTraits
    })
], TableStyleTraits.prototype, "pointSize", void 0);
__decorate([
    objectTrait({
        name: "Chart",
        description: "Options for controlling the chart created from this CSV.",
        type: TableChartStyleTraits
    })
], TableStyleTraits.prototype, "chart", void 0);
__decorate([
    objectTrait({
        name: "Time",
        description: "Options for controlling how the visualization changes with time.",
        type: TableTimeStyleTraits
    })
], TableStyleTraits.prototype, "time", void 0);
__decorate([
    primitiveTrait({
        name: "Hide style",
        description: `Hide style from "Display Variable" drop-down in workbench. It is hidden by default if number of colors (enumColors or numberOfBins) is less than 2 - as a ColorMap with a single color isn't super useful`,
        type: "boolean"
    })
], TableStyleTraits.prototype, "hidden", void 0);
//# sourceMappingURL=StyleTraits.js.map