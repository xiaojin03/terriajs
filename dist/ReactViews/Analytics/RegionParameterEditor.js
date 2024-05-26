"use strict";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import Styles from "./parameter-editors.scss";
import RegionPicker, { getDisplayValue } from "./RegionPicker";
import MapInteractionMode from "../../Models/MapInteractionMode";
const RegionParameterEditor = createReactClass({
    displayName: "RegionParameterEditor",
    propTypes: {
        previewed: PropTypes.object,
        viewState: PropTypes.object,
        parameter: PropTypes.object
    },
    selectRegionOnMap() {
        RegionParameterEditor.selectOnMap(this.props.viewState, this.props.parameter, this.props.previewed);
    },
    render() {
        return (_jsxs("div", { children: [_jsx("input", { className: Styles.field, type: "text", readOnly: true, value: getDisplayValue(this.props.parameter.value, this.props.parameter) }), _jsx("button", { type: "button", onClick: this.selectRegionOnMap, className: Styles.btnSelector, children: "Select region" })] }));
    }
});
/**
 * Prompt user to select/draw on map in order to define parameter.
 * @param {Object} viewState ViewState.
 * @param {FunctionParameter} parameter Parameter.
 * @param {Object} previewed Previewed.
 */
RegionParameterEditor.selectOnMap = function (viewState, parameter, previewed) {
    const terria = previewed.terria;
    // Cancel any feature picking already in progress.
    terria.pickedFeatures = undefined;
    const pickPointMode = new MapInteractionMode({
        message: "Select a region on the map",
        onCancel: function () {
            terria.mapInteractionModeStack.pop();
            viewState.openAddData();
        },
        buttonText: "Done",
        customUi: function Done() {
            return (_jsx(RegionPicker, { className: Styles.parameterEditor, previewed: previewed, parameter: parameter }));
        }
    });
    terria.mapInteractionModeStack.push(pickPointMode);
    viewState.explorerPanelIsVisible = false;
};
module.exports = RegionParameterEditor;
//# sourceMappingURL=RegionParameterEditor.js.map