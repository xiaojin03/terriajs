var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { observer } from "mobx-react";
import { action, computed, observable, makeObservable } from "mobx";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { RectClipPath } from "@visx/clip-path";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { withParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { Line } from "@visx/shape";
import PropTypes from "prop-types";
import React from "react";
import groupBy from "lodash-es/groupBy";
import minBy from "lodash-es/minBy";
import Legends from "./Legends";
import LineChart from "./LineChart";
import MomentLinesChart from "./MomentLinesChart";
import MomentPointsChart from "./MomentPointsChart";
import Tooltip from "./Tooltip";
import ZoomX from "./ZoomX";
import Styles from "./bottom-dock-chart.scss";
import LineAndPointChart from "./LineAndPointChart";
import PointOnMap from "./PointOnMap";
const chartMinWidth = 110;
const defaultGridColor = "#efefef";
const labelColor = "#efefef";
let BottomDockChart = class BottomDockChart extends React.Component {
    render() {
        return (_jsx(Chart, { ...this.props, width: Math.max(chartMinWidth, this.props.width || this.props.parentWidth) }));
    }
};
Object.defineProperty(BottomDockChart, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object.isRequired,
        parentWidth: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        chartItems: PropTypes.array.isRequired,
        xAxis: PropTypes.object.isRequired,
        margin: PropTypes.object
    }
});
Object.defineProperty(BottomDockChart, "defaultProps", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        parentWidth: 0
    }
});
BottomDockChart = __decorate([
    observer
], BottomDockChart);
export default withParentSize(BottomDockChart);
let Chart = class Chart extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "zoomedXScale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mouseCoords", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        makeObservable(this);
    }
    get chartItems() {
        return sortChartItemsByType(this.props.chartItems)
            .map((chartItem) => {
            return {
                ...chartItem,
                points: chartItem.points.sort((p1, p2) => p1.x - p2.x)
            };
        })
            .filter((chartItem) => chartItem.points.length > 0);
    }
    get plotHeight() {
        const { height, margin } = this.props;
        return height - margin.top - margin.bottom - Legends.maxHeightPx;
    }
    get plotWidth() {
        const { width, margin } = this.props;
        return width - margin.left - margin.right - this.estimatedYAxesWidth;
    }
    get adjustedMargin() {
        const margin = this.props.margin;
        return {
            ...margin,
            left: margin.left + this.estimatedYAxesWidth
        };
    }
    get initialXScale() {
        const xAxis = this.props.xAxis;
        const domain = calculateDomain(this.chartItems);
        const params = {
            domain: domain.x,
            range: [0, this.plotWidth]
        };
        if (xAxis.scale === "linear")
            return scaleLinear(params);
        else
            return scaleTime(params);
    }
    get xScale() {
        return this.zoomedXScale || this.initialXScale;
    }
    get yAxes() {
        const range = [this.plotHeight, 0];
        const chartItemsByUnit = groupBy(this.chartItems, "units");
        return Object.entries(chartItemsByUnit).map(([units, chartItems]) => {
            return {
                units: units === "undefined" ? undefined : units,
                scale: scaleLinear({ domain: calculateDomain(chartItems).y, range }),
                color: chartItems[0].getColor()
            };
        });
    }
    get initialScales() {
        return this.chartItems.map((c) => ({
            x: this.initialXScale,
            y: this.yAxes.find((y) => y.units === c.units).scale
        }));
    }
    get zoomedScales() {
        return this.chartItems.map((c) => ({
            x: this.xScale,
            y: this.yAxes.find((y) => y.units === c.units).scale
        }));
    }
    get cursorX() {
        if (this.pointsNearMouse.length > 0)
            return this.xScale(this.pointsNearMouse[0].point.x);
        return this.mouseCoords && this.mouseCoords.x;
    }
    get pointsNearMouse() {
        if (!this.mouseCoords)
            return [];
        return this.chartItems
            .map((chartItem) => ({
            chartItem,
            point: findNearestPoint(chartItem.points, this.mouseCoords, this.xScale, 7)
        }))
            .filter(({ point }) => point !== undefined);
    }
    get tooltip() {
        const margin = this.adjustedMargin;
        const tooltip = {
            items: this.pointsNearMouse
        };
        if (!this.mouseCoords || this.mouseCoords.x < this.plotWidth * 0.5) {
            tooltip.right = this.props.width - (this.plotWidth + margin.right);
        }
        else {
            tooltip.left = margin.left;
        }
        tooltip.bottom = this.props.height - (margin.top + this.plotHeight);
        return tooltip;
    }
    get estimatedYAxesWidth() {
        const numTicks = 4;
        const tickLabelFontSize = 10;
        // We need to consider only the left most Y-axis as its label values appear
        // outside the chart plot area. The labels of inner y-axes appear inside
        // the plot area.
        const leftmostYAxis = this.yAxes[0];
        const maxLabelDigits = Math.max(0, ...leftmostYAxis.scale.ticks(numTicks).map((n) => n.toString().length));
        return maxLabelDigits * tickLabelFontSize;
    }
    setZoomedXScale(scale) {
        this.zoomedXScale = scale;
    }
    setMouseCoords(coords) {
        this.mouseCoords = coords;
    }
    setMouseCoordsFromEvent(event) {
        const coords = localPoint(event.target.ownerSVGElement || event.target, event);
        if (!coords)
            return;
        this.setMouseCoords({
            x: coords.x - this.adjustedMargin.left,
            y: coords.y - this.adjustedMargin.top
        });
    }
    componentDidUpdate(prevProps) {
        // Unset zoom scale if any chartItems are added or removed
        if (prevProps.chartItems.length !== this.props.chartItems.length) {
            this.setZoomedXScale(undefined);
        }
    }
    render() {
        const { height, xAxis, terria } = this.props;
        if (this.chartItems.length === 0)
            return _jsx("div", { className: Styles.empty, children: "No data available" });
        return (_jsxs(ZoomX, { surface: "#zoomSurface", initialScale: this.initialXScale, scaleExtent: [1, Infinity], translateExtent: [
                [0, 0],
                [Infinity, Infinity]
            ], onZoom: (zoomedScale) => this.setZoomedXScale(zoomedScale), children: [_jsx(Legends, { width: this.plotWidth, chartItems: this.chartItems }), _jsxs("div", { style: { position: "relative" }, children: [_jsx("svg", { width: "100%", height: height, onMouseMove: this.setMouseCoordsFromEvent.bind(this), onMouseLeave: () => this.setMouseCoords(undefined), children: _jsxs(Group, { left: this.adjustedMargin.left, top: this.adjustedMargin.top, children: [_jsx(RectClipPath, { id: "plotClip", width: this.plotWidth, height: this.plotHeight }), _jsx(XAxis, { top: this.plotHeight + 1, scale: this.xScale, label: xAxis.units || (xAxis.scale === "time" && "Date") }), this.yAxes.map((y, i) => (_createElement(YAxis, { ...y, key: `y-axis-${y.units}`, color: this.yAxes.length > 1 ? y.color : defaultGridColor, offset: i * 50 }))), this.yAxes.map((y, i) => (_jsx(GridRows, { width: this.plotWidth, height: this.plotHeight, scale: y.scale, numTicks: 4, stroke: this.yAxes.length > 1 ? y.color : defaultGridColor, lineStyle: { opacity: 0.3 } }, `grid-${y.units}`))), _jsxs("svg", { id: "zoomSurface", clipPath: "url(#plotClip)", pointerEvents: "all", children: [_jsx("rect", { width: this.plotWidth, height: this.plotHeight, fill: "transparent" }), this.cursorX && (_jsx(Cursor, { x: this.cursorX, stroke: defaultGridColor })), _jsx(Plot, { chartItems: this.chartItems, initialScales: this.initialScales, zoomedScales: this.zoomedScales })] })] }) }), _jsx(Tooltip, { ...this.tooltip }), _jsx(PointsOnMap, { terria: terria, chartItems: this.chartItems })] })] }));
    }
};
Object.defineProperty(Chart, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object.isRequired,
        width: PropTypes.number,
        height: PropTypes.number,
        chartItems: PropTypes.array.isRequired,
        xAxis: PropTypes.object.isRequired,
        margin: PropTypes.object
    }
});
Object.defineProperty(Chart, "defaultProps", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        margin: { left: 20, right: 30, top: 10, bottom: 50 }
    }
});
__decorate([
    observable.ref
], Chart.prototype, "zoomedXScale", void 0);
__decorate([
    observable
], Chart.prototype, "mouseCoords", void 0);
__decorate([
    computed
], Chart.prototype, "chartItems", null);
__decorate([
    computed
], Chart.prototype, "plotHeight", null);
__decorate([
    computed
], Chart.prototype, "plotWidth", null);
__decorate([
    computed
], Chart.prototype, "adjustedMargin", null);
__decorate([
    computed
], Chart.prototype, "initialXScale", null);
__decorate([
    computed
], Chart.prototype, "xScale", null);
__decorate([
    computed
], Chart.prototype, "yAxes", null);
__decorate([
    computed
], Chart.prototype, "initialScales", null);
__decorate([
    computed
], Chart.prototype, "zoomedScales", null);
__decorate([
    computed
], Chart.prototype, "cursorX", null);
__decorate([
    computed
], Chart.prototype, "pointsNearMouse", null);
__decorate([
    computed
], Chart.prototype, "tooltip", null);
__decorate([
    computed
], Chart.prototype, "estimatedYAxesWidth", null);
__decorate([
    action
], Chart.prototype, "setZoomedXScale", null);
__decorate([
    action
], Chart.prototype, "setMouseCoords", null);
Chart = __decorate([
    observer
], Chart);
let Plot = class Plot extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this);
    }
    get chartRefs() {
        return this.props.chartItems.map((_) => React.createRef());
    }
    componentDidUpdate() {
        Object.values(this.chartRefs).forEach(({ current: ref }, i) => {
            if (typeof ref.doZoom === "function") {
                ref.doZoom(this.props.zoomedScales[i]);
            }
        });
    }
    render() {
        const { chartItems, initialScales } = this.props;
        return chartItems.map((chartItem, i) => {
            switch (chartItem.type) {
                case "line":
                    return (_jsx(LineChart, { ref: this.chartRefs[i], id: sanitizeIdString(chartItem.key), chartItem: chartItem, scales: initialScales[i] }, chartItem.key));
                case "momentPoints": {
                    // Find a basis item to stick the points on, if we can't find one, we
                    // vertically center the points
                    const basisItemIndex = chartItems.findIndex((item) => (item.type === "line" || item.type === "lineAndPoint") &&
                        item.xAxis.scale === "time");
                    return (_jsx(MomentPointsChart, { ref: this.chartRefs[i], id: sanitizeIdString(chartItem.key), chartItem: chartItem, scales: initialScales[i], basisItem: chartItems[basisItemIndex], basisItemScales: initialScales[basisItemIndex], glyph: chartItem.glyphStyle }, chartItem.key));
                }
                case "momentLines": {
                    return (_jsx(MomentLinesChart, { ref: this.chartRefs[i], id: sanitizeIdString(chartItem.key), chartItem: chartItem, scales: initialScales[i] }, chartItem.key));
                }
                case "lineAndPoint": {
                    return (_jsx(LineAndPointChart, { ref: this.chartRefs[i], id: sanitizeIdString(chartItem.key), chartItem: chartItem, scales: initialScales[i], glyph: chartItem.glyphStyle }, chartItem.key));
                }
            }
        });
    }
};
Object.defineProperty(Plot, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        chartItems: PropTypes.array.isRequired,
        initialScales: PropTypes.array.isRequired,
        zoomedScales: PropTypes.array.isRequired
    }
});
__decorate([
    computed
], Plot.prototype, "chartRefs", null);
Plot = __decorate([
    observer
], Plot);
class XAxis extends React.PureComponent {
    render() {
        const { scale, ...restProps } = this.props;
        return (_jsx(AxisBottom, { stroke: "#efefef", tickStroke: "#efefef", tickLabelProps: () => ({
                fill: "#efefef",
                textAnchor: "middle",
                fontSize: 12,
                fontFamily: "Arial"
            }), labelProps: {
                fill: labelColor,
                fontSize: 12,
                textAnchor: "middle",
                fontFamily: "Arial"
            }, 
            // .nice() rounds the scale so that the aprox beginning and
            // aprox end labels are shown
            // See: https://stackoverflow.com/questions/21753126/d3-js-starting-and-ending-tick
            scale: scale.nice(), ...restProps }));
    }
}
Object.defineProperty(XAxis, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        top: PropTypes.number.isRequired,
        scale: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired
    }
});
class YAxis extends React.PureComponent {
    render() {
        const { scale, color, units, offset } = this.props;
        return (_jsx(AxisLeft, { left: offset, scale: scale, numTicks: 4, stroke: color, tickStroke: color, label: units || "", labelOffset: 10, labelProps: {
                fill: color,
                textAnchor: "middle",
                fontSize: 12,
                fontFamily: "Arial"
            }, tickLabelProps: () => ({
                fill: color,
                textAnchor: "end",
                fontSize: 10,
                fontFamily: "Arial"
            }) }, `y-axis-${units}`));
    }
}
Object.defineProperty(YAxis, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        scale: PropTypes.func.isRequired,
        color: PropTypes.string.isRequired,
        units: PropTypes.string,
        offset: PropTypes.number.isRequired
    }
});
class Cursor extends React.PureComponent {
    render() {
        const { x, ...rest } = this.props;
        return _jsx(Line, { from: { x, y: 0 }, to: { x, y: 1000 }, ...rest });
    }
}
Object.defineProperty(Cursor, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        x: PropTypes.number.isRequired
    }
});
function PointsOnMap({ chartItems, terria }) {
    return chartItems.map((chartItem) => chartItem.pointOnMap && (_jsx(PointOnMap, { terria: terria, color: chartItem.getColor(), point: chartItem.pointOnMap }, `point-on-map-${chartItem.key}`)));
}
/**
 * Calculates a combined domain of all chartItems.
 */
function calculateDomain(chartItems) {
    const xmin = Math.min(...chartItems.map((c) => c.domain.x[0]));
    const xmax = Math.max(...chartItems.map((c) => c.domain.x[1]));
    const ymin = Math.min(...chartItems.map((c) => c.domain.y[0]));
    const ymax = Math.max(...chartItems.map((c) => c.domain.y[1]));
    return {
        x: [xmin, xmax],
        y: [ymin, ymax]
    };
}
/**
 * Sorts chartItems so that `momentPoints` are rendered on top then
 * `momentLines` and then any other types.
 * @param {ChartItem[]} chartItems array of chartItems to sort
 */
function sortChartItemsByType(chartItems) {
    return chartItems.slice().sort((a, b) => {
        if (a.type === "momentPoints")
            return 1;
        else if (b.type === "momentPoints")
            return -1;
        else if (a.type === "momentLines")
            return 1;
        else if (b.type === "momentLines")
            return -1;
        return 0;
    });
}
function findNearestPoint(points, coords, xScale, maxDistancePx) {
    function distance(coords, point) {
        return point ? coords.x - xScale(point.x) : Infinity;
    }
    let left = 0;
    let right = points.length;
    let mid = 0;
    for (;;) {
        if (left === right)
            break;
        mid = left + Math.floor((right - left) / 2);
        if (distance(coords, points[mid]) === 0)
            break;
        else if (distance(coords, points[mid]) < 0)
            right = mid;
        else
            left = mid + 1;
    }
    const leftPoint = points[mid - 1];
    const midPoint = points[mid];
    const rightPoint = points[mid + 1];
    const nearestPoint = minBy([leftPoint, midPoint, rightPoint], (p) => p ? Math.abs(distance(coords, p)) : Infinity);
    return Math.abs(distance(coords, nearestPoint)) <= maxDistancePx
        ? nearestPoint
        : undefined;
}
function sanitizeIdString(id) {
    // delete all non-alphanum chars
    return id.replace(/[^a-zA-Z0-9_-]/g, "");
}
//# sourceMappingURL=BottomDockChart.js.map