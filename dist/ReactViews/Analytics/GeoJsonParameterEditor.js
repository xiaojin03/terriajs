"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
import defined from "terriajs-cesium/Source/Core/defined";
import Styles from "./parameter-editors.scss";
import { selectOnMap as selectPointOnMap, getDisplayValue as getPointParameterDisplayValue } from "./PointParameterEditor";
import { selectOnMap as selectPolygonOnMap, getDisplayValue as getPolygonParameterDisplayValue } from "./PolygonParameterEditor";
import { selectOnMap as selectExistingPolygonOnMap, getDisplayValue as getExistingPolygonParameterDisplayValue } from "./SelectAPolygonParameterEditor";
import { getDisplayValue as getRegionPickerDisplayValue } from "./RegionPicker";
import GeoJsonParameter from "../../Models/FunctionParameters/GeoJsonParameter";
import { withTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { runInAction } from "mobx";
import CommonStrata from "../../Models/Definition/CommonStrata";
let GeoJsonParameterEditor = class GeoJsonParameterEditor extends React.Component {
    onCleanUp() {
        this.props.viewState.openAddData();
    }
    selectPointOnMap() {
        runInAction(() => {
            this.props.parameter.setValue(CommonStrata.user, undefined);
            selectPointOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter, this.props.t("analytics.selectLocation"));
            this.props.parameter.subtype = GeoJsonParameter.PointType;
        });
    }
    selectPolygonOnMap() {
        runInAction(() => {
            this.props.parameter.setValue(CommonStrata.user, undefined);
            selectPolygonOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter);
            this.props.parameter.subtype = GeoJsonParameter.PolygonType;
        });
    }
    selectExistingPolygonOnMap() {
        runInAction(() => {
            this.props.parameter.setValue(CommonStrata.user, undefined);
            selectExistingPolygonOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter);
            this.props.parameter.subtype = GeoJsonParameter.SelectAPolygonType;
        });
    }
    render() {
        const { t } = this.props;
        return (_jsxs("div", { children: [_jsx("div", { children: _jsx("strong", { children: t("analytics.selectLocation") }) }), _jsxs("div", { className: "container", style: {
                        marginTop: "10px",
                        marginBottom: "10px",
                        display: "table",
                        width: "100%"
                    }, children: [_jsx("button", { type: "button", onClick: () => this.selectPointOnMap(), className: Styles.btnLocationSelector, children: _jsx("strong", { children: t("analytics.point") }) }), _jsx("button", { type: "button", style: { marginLeft: "2%", marginRight: "2%" }, onClick: () => this.selectPolygonOnMap(), className: Styles.btnLocationSelector, children: _jsx("strong", { children: t("analytics.polygon") }) }), _jsx("button", { type: "button", onClick: () => this.selectExistingPolygonOnMap(), className: Styles.btnLocationSelector, children: _jsx("strong", { children: t("analytics.existingPolygon") }) })] }), _jsx("input", { className: Styles.field, type: "text", readOnly: true, value: getDisplayValue(this.props.parameter.value, this.props.parameter) }), getDisplayValue(this.props.parameter.value, this.props.parameter) ===
                    "" && _jsx("div", { children: t("analytics.nothingSelected") })] }));
    }
};
Object.defineProperty(GeoJsonParameterEditor, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        previewed: PropTypes.object,
        parameter: PropTypes.object,
        viewState: PropTypes.object,
        t: PropTypes.func.isRequired
    }
});
GeoJsonParameterEditor = __decorate([
    observer
], GeoJsonParameterEditor);
function getDisplayValue(value, parameter) {
    if (!defined(parameter.subtype)) {
        return "";
    }
    if (parameter.subtype === GeoJsonParameter.PointType) {
        return getPointParameterDisplayValue(value);
    }
    if (parameter.subtype === GeoJsonParameter.SelectAPolygonType) {
        return getExistingPolygonParameterDisplayValue(value);
    }
    if (parameter.subtype === GeoJsonParameter.PolygonType) {
        return getPolygonParameterDisplayValue(value);
    }
    return getRegionPickerDisplayValue(value, parameter);
}
module.exports = withTranslation()(GeoJsonParameterEditor);
//# sourceMappingURL=GeoJsonParameterEditor.js.map