var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import React from "react";
import { scaleOrdinal } from "@visx/scale";
import { LegendOrdinal } from "@visx/legend";
import Glyphs from "./Glyphs";
import { GlyphCircle } from "@visx/glyph";
import { TextSpan } from "../../../Styled/Text";
import styled from "styled-components";
import { observer } from "mobx-react";
let Legends = class Legends extends React.PureComponent {
    render() {
        const chartItems = this.props.chartItems;
        const colorScale = scaleOrdinal({
            domain: chartItems.map((c) => `${c.categoryName} ${c.name}`),
            range: chartItems.map((c) => c.getColor())
        });
        return (_jsx(LegendsContainer, { style: { maxWidth: this.props.width }, children: _jsx(LegendOrdinal, { scale: colorScale, children: (labels) => labels.map((label, i) => {
                    var _a, _b;
                    return (_jsx(Legend, { label: label, glyph: (_b = (_a = chartItems[i]) === null || _a === void 0 ? void 0 : _a.glyphStyle) !== null && _b !== void 0 ? _b : "circle" }, `legend-${label.text}`));
                }) }) }));
    }
};
Object.defineProperty(Legends, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        chartItems: PropTypes.array.isRequired,
        width: PropTypes.number.isRequired
    }
});
Object.defineProperty(Legends, "maxHeightPx", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 33
});
Legends = __decorate([
    observer
], Legends);
export default Legends;
class Legend extends React.PureComponent {
    render() {
        var _a;
        const label = this.props.label;
        const squareSize = 20;
        const Glyph = (_a = Glyphs[this.props.glyph]) !== null && _a !== void 0 ? _a : GlyphCircle;
        return (_jsxs(LegendWrapper, { title: label.text, ariaLabel: label.text, children: [_jsx("svg", { width: `${squareSize}px`, height: `${squareSize}px`, style: { flexShrink: 0 }, children: _jsx(Glyph, { top: 10, left: 10, fill: label.value, size: 100 }) }), _jsx(LegendText, { children: label.text })] }));
    }
}
Object.defineProperty(Legend, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        label: PropTypes.object.isRequired,
        glyph: PropTypes.string
    }
});
const LegendsContainer = styled.div `
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto;
  padding: 7px;
  font-size: 0.8em;
`;
const LegendWrapper = styled.div `
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-width: 0px;
`;
const LegendText = styled(TextSpan).attrs({
    noWrap: true,
    overflowEllipsis: true,
    overflowHide: true,
    medium: true
}) `
  margin-left: 4px;
`;
//# sourceMappingURL=Legends.js.map