var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import { addRemoveButtonClicked, allMappableMembersInWorkbench } from "../DataCatalog/DisplayGroupHelper";
import measureElement from "../HOCs/measureElement";
import SharePanel from "../Map/Panels/SharePanel/SharePanel";
import DataPreviewSections from "./DataPreviewSections";
import DataPreviewUrl from "./DataPreviewUrl";
import Styles from "./mappable-preview.scss";
import WarningBox from "./WarningBox";
/**
 * A "preview" for CatalogGroup.
 */
let GroupPreview = class GroupPreview extends React.Component {
    backToMap() {
        this.props.viewState.explorerPanelIsVisible = false;
    }
    render() {
        var _a, _b, _c, _d;
        const metadataItem = this.props.previewed.nowViewingCatalogItem || this.props.previewed;
        const { t } = this.props;
        return (_jsxs("div", { children: [_jsxs("div", { className: Styles.titleAndShareWrapper, ref: (component) => (this.refToMeasure = component), children: [_jsx("h3", { children: this.props.previewed.name }), _jsxs("div", { className: Styles.shareLinkWrapper, children: [this.props.previewed.displayGroup === true && (_jsx("button", { type: "button", onClick: (event) => {
                                        addRemoveButtonClicked(this.props.previewed, this.props.viewState, this.props.terria, event.shiftKey || event.ctrlKey);
                                    }, className: Styles.btnAddAll, children: allMappableMembersInWorkbench(this.props.previewed.members, this.props.terria)
                                        ? t("models.catalog.removeAll")
                                        : t("models.catalog.addAll") })), _jsx(SharePanel, { catalogShare: true, modalWidth: this.props.widthFromMeasureElementHOC, terria: this.props.terria, viewState: this.props.viewState })] })] }), ((_a = this.props.previewed.loadMetadataResult) === null || _a === void 0 ? void 0 : _a.error) && (_jsx(WarningBox, { error: (_b = this.props.previewed.loadMetadataResult) === null || _b === void 0 ? void 0 : _b.error, viewState: this.props.viewState })), ((_c = this.props.previewed.loadMembersResult) === null || _c === void 0 ? void 0 : _c.error) && (_jsx(WarningBox, { error: (_d = this.props.previewed.loadMembersResult) === null || _d === void 0 ? void 0 : _d.error, viewState: this.props.viewState })), _jsx("div", { className: Styles.previewedInfo, children: _jsxs("div", { className: Styles.url, children: [this.props.previewed.description &&
                                this.props.previewed.description.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: Styles.h4, children: t("description.name") }), parseCustomMarkdownToReact(this.props.previewed.description, { catalogItem: this.props.previewed })] })), _jsx(DataPreviewSections, { metadataItem: metadataItem }), metadataItem.dataCustodian && (_jsxs("div", { children: [_jsx("h4", { className: Styles.h4, children: t("preview.dataCustodian") }), parseCustomMarkdownToReact(metadataItem.dataCustodian, {
                                        catalogItem: metadataItem
                                    })] })), metadataItem.url &&
                                metadataItem.url.length &&
                                !metadataItem.hideSource && (_jsx(DataPreviewUrl, { metadataItem: metadataItem }))] }) })] }));
    }
};
Object.defineProperty(GroupPreview, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        previewed: PropTypes.object.isRequired,
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        widthFromMeasureElementHOC: PropTypes.number,
        t: PropTypes.func.isRequired
    }
});
GroupPreview = __decorate([
    observer
], GroupPreview);
export default withTranslation()(measureElement(GroupPreview));
//# sourceMappingURL=GroupPreview.js.map