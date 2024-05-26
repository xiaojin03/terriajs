import PointSizeMap from "./PointSizeMap";
export default class ConstantPointSizeMap extends PointSizeMap {
    constructor(pointSize) {
        super();
        Object.defineProperty(this, "pointSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: pointSize
        });
    }
    mapValueToPointSize(value) {
        return this.pointSize;
    }
}
//# sourceMappingURL=ConstantPointSizeMap.js.map