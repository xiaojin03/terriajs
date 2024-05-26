"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// import Chart from "../Custom/Chart/Chart";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { Trans, withTranslation } from "react-i18next";
import CatalogFunctionMixin from "../../ModelMixins/CatalogFunctionMixin";
import ReferenceMixin from "../../ModelMixins/ReferenceMixin";
import { Icon } from "../../Styled/Icon";
import InvokeFunction from "../Analytics/InvokeFunction";
import Loader from "../Loader";
import Description from "./Description";
import GroupPreview from "./GroupPreview";
import MappablePreview from "./MappablePreview";
import WarningBox from "./WarningBox";
import Styles from "./data-preview.scss";
/**
 * Data preview section, for the preview map see DataPreviewMap
 */
let DataPreview = class DataPreview extends React.Component {
    backToMap() {
        runInAction(() => {
            this.props.viewState.explorerPanelIsVisible = false;
        });
    }
    renderInner() {
        const { t } = this.props;
        let previewed = this.props.previewed;
        if (previewed !== undefined && ReferenceMixin.isMixedInto(previewed)) {
            // We are loading the nested target because we could be dealing with a nested reference here
            if (previewed.nestedTarget === undefined) {
                // Reference is not available yet.
                return this.renderUnloadedReference();
            }
            previewed = previewed.nestedTarget;
        }
        let chartData;
        if (previewed && !previewed.isMappable && previewed.tableStructure) {
            chartData = previewed.chartData();
        }
        if (previewed && previewed.isLoadingMetadata) {
            return (_jsxs("div", { className: Styles.previewInner, children: [_jsx("h3", { className: Styles.h3, children: previewed.name }), _jsx(Loader, {})] }));
        }
        else if (previewed && previewed.isMappable) {
            return (_jsx("div", { className: Styles.previewInner, children: _jsx(MappablePreview, { previewed: previewed, terria: this.props.terria, viewState: this.props.viewState }) }));
        }
        else if (chartData) {
            return (_jsxs("div", { className: Styles.previewInner, children: [_jsx("h3", { className: Styles.h3, children: previewed.name }), _jsx("p", { children: t("preview.doesNotContainGeospatialData") }), _jsx("div", { className: Styles.previewChart }), _jsx(Description, { item: previewed })] }));
        }
        else if (previewed && CatalogFunctionMixin.isMixedInto(previewed)) {
            return (_jsx(InvokeFunction, { previewed: previewed, terria: this.props.terria, viewState: this.props.viewState }));
        }
        else if (previewed && previewed.isGroup) {
            return (_jsx("div", { className: Styles.previewInner, children: _jsx(GroupPreview, { previewed: previewed, terria: this.props.terria, viewState: this.props.viewState }) }));
        }
        else {
            return (_jsxs("div", { className: Styles.placeholder, children: [_jsx("p", { children: t("preview.selectToPreviewDataset") }), _jsx("p", { children: _jsxs(Trans, { i18nKey: "preview.selectMultipleDatasets", children: [_jsxs("span", { children: ["Press ", _jsx("strong", { children: "Shift" }), " and click"] }), _jsx(Icon, { glyph: Icon.GLYPHS.add, css: {
                                        height: "20px",
                                        width: "20px",
                                        margin: "0px 5px",
                                        verticalAlign: "middle",
                                        fill: `${(p) => p.theme.charcoalGrey}`
                                    } }), _jsx("span", { children: "to add multiple datasets" })] }) }), _jsxs("p", { children: ["- ", t("preview.selectToPreviewSeparator"), " -"] }), _jsx("button", { className: Styles.btnBackToMap, onClick: () => this.backToMap(), children: t("preview.goToTheMap") })] }));
        }
    }
    render() {
        return _jsx("div", { className: Styles.preview, children: this.renderInner() });
    }
    renderUnloadedReference() {
        var _a, _b, _c;
        const isLoading = this.props.previewed.isLoadingReference;
        const hasTarget = this.props.previewed.target !== undefined;
        return (_jsx("div", { className: Styles.preview, children: _jsxs("div", { className: Styles.previewInner, children: [isLoading && _jsx(Loader, {}), !isLoading && !hasTarget && (_jsxs(_Fragment, { children: [_jsxs("div", { className: Styles.placeholder, children: [_jsx("h2", { children: "Unable to resolve reference" }), !((_a = this.props.previewed.loadReferenceResult) === null || _a === void 0 ? void 0 : _a.error) ? (_jsx("p", { children: "This reference could not be resolved because it is invalid or because it points to something that cannot be visualised." })) : null] }), ((_b = this.props.previewed.loadReferenceResult) === null || _b === void 0 ? void 0 : _b.error) ? (_jsx(WarningBox, { error: (_c = this.props.previewed.loadReferenceResult) === null || _c === void 0 ? void 0 : _c.error, viewState: this.props.viewState })) : null] }))] }) }));
    }
};
Object.defineProperty(DataPreview, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object,
        previewed: PropTypes.object,
        t: PropTypes.func.isRequired
    }
});
DataPreview = __decorate([
    observer
], DataPreview);
module.exports = withTranslation()(DataPreview);
//# sourceMappingURL=DataPreview.js.map