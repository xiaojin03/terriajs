import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { lab, rgb } from "d3-color";
import * as d3Scale from "d3-scale-chromatic";
import StandardCssColors from "../../Core/StandardCssColors";
const Invalid = () => {
    const { t } = useTranslation();
    return _jsx("span", { children: t("selectableDimensions.invalid") });
};
/* The ramp and swatches functions are adapted from https://observablehq.com/@d3/color-schemes?collection=@d3/d3-scale-chromatic
 *
 * Copyright 2018–2020 Observable, Inc.
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 *
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
const interpolateWidth = 300;
const height = 20;
function ramp(name, n) {
    if (!name)
        return _jsx(Invalid, {});
    let colors;
    /** This could be used to draw text on top of swatches/ramps */
    let dark;
    if (n &&
        d3Scale[`scheme${name}`] &&
        d3Scale[`scheme${name}`][n]) {
        colors = d3Scale[`scheme${name}`][n];
        dark = lab(colors[0]).l < 50;
    }
    else {
        const interpolate = d3Scale[`interpolate${name}`];
        if (!interpolate) {
            return _jsx(Invalid, {});
        }
        colors = [];
        dark = lab(interpolate(0)).l < 50;
        for (let i = 0; i < interpolateWidth; ++i) {
            colors.push(rgb(interpolate(i / (interpolateWidth - 1))).hex());
        }
    }
    if (n && n < 14) {
        return (_jsx("svg", { viewBox: `0 0 ${n} 1`, preserveAspectRatio: "none", style: {
                display: "block",
                shapeRendering: "crispEdges",
                height: `${height}px`,
                maxWidth: "100%"
            }, children: colors.map((c, i) => (_jsx("rect", { x: i, width: 1, height: 1, fill: c }, i))) }));
    }
    else {
        const canvas = document.createElement("canvas");
        canvas.width = interpolateWidth;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        if (!context)
            return _jsx(Invalid, {});
        canvas.style.width = `${interpolateWidth}px`;
        canvas.style.height = `${height}px`;
        for (let i = 0; i < interpolateWidth; ++i) {
            context.fillStyle = colors[i];
            context.fillRect(i, 0, 1, 1);
        }
        return (_jsx("div", { style: { marginTop: "5px" }, children: _jsx("img", { style: {
                    height: `${height}px`,
                    width: "100%",
                    imageRendering: "crisp-edges"
                }, src: canvas.toDataURL("image/jpeg", 1.0) }) }));
    }
}
function swatches(name) {
    if (!name)
        return _jsx(Invalid, {});
    let colors = d3Scale[`scheme${name}`];
    // Handle custom HighContrast style
    if (!colors && name === "HighContrast") {
        colors = StandardCssColors.highContrast;
    }
    if (!colors)
        return _jsx(Invalid, {});
    const n = colors.length;
    const dark = lab(colors[0]).l < 50;
    return (_jsx("svg", { viewBox: `0 0 ${n} 1`, preserveAspectRatio: "none", style: {
            display: "block",
            shapeRendering: "crispEdges",
            height: `${height}px`,
            maxWidth: "100%"
        }, children: colors.map((c, i) => (_jsx("rect", { x: i, width: 1, height: 1, fill: c }, i))) }));
}
/** numBins = undefined - indicates continuous color scheme */
export const QuantitativeColorSchemeOptionRenderer = (numBins) => (option) => ramp(option.value, numBins);
export const QualitativeColorSchemeOptionRenderer = (option) => swatches(option.value);
//# sourceMappingURL=ColorSchemeOptionRenderer.js.map