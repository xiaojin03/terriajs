import { maxBy, minBy } from "lodash-es";
import { getMax, getMin } from "../Core/math";
export function calculateDomain(points) {
    var _a, _b, _c, _d;
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const asNum = (x) => (x instanceof Date ? x.getTime() : x);
    return {
        x: [(_a = minBy(xs, asNum)) !== null && _a !== void 0 ? _a : 0, (_b = maxBy(xs, asNum)) !== null && _b !== void 0 ? _b : 0],
        y: [(_c = getMin(ys)) !== null && _c !== void 0 ? _c : 0, (_d = getMax(ys)) !== null && _d !== void 0 ? _d : 0]
    };
}
export function axesMatch(a1, a2) {
    // ignore unit label if both scales are time
    if (a1.scale === "time" && a2.scale === "time")
        return true;
    else
        return a1.scale === a2.scale && a1.units === a2.units;
}
function ChartableMixin(Base) {
    class ChartableMixin extends Base {
        get isChartable() {
            return true;
        }
    }
    return ChartableMixin;
}
(function (ChartableMixin) {
    function isMixedInto(model) {
        return model && model.isChartable;
    }
    ChartableMixin.isMixedInto = isMixedInto;
})(ChartableMixin || (ChartableMixin = {}));
export default ChartableMixin;
//# sourceMappingURL=ChartableMixin.js.map