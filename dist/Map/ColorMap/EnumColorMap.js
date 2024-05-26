import ColorMap from "./ColorMap";
import Color from "terriajs-cesium/Source/Core/Color";
export default class EnumColorMap extends ColorMap {
    constructor(options) {
        super();
        Object.defineProperty(this, "values", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "colors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nullColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.nullColor = Color.clone(options.nullColor);
        const values = [];
        const colors = [];
        options.enumColors.forEach((bin) => {
            values.push(bin.value);
            colors.push(Color.clone(bin.color));
        });
        this.values = values;
        this.colors = colors;
    }
    mapValueToColor(value) {
        if (value === undefined || value === null) {
            return this.nullColor;
        }
        else if (typeof value !== "string") {
            value = value.toString();
        }
        const values = this.values;
        let i, len;
        for (let i = 0, len = values.length; i < len; ++i) {
            if (values[i] === value) {
                return this.colors[i];
            }
        }
        return this.nullColor;
    }
}
//# sourceMappingURL=EnumColorMap.js.map