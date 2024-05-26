var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { Trans, withTranslation } from "react-i18next";
import defined from "terriajs-cesium/Source/Core/defined";
import Box from "../../Styled/Box";
import Button from "../../Styled/Button";
import Collapsible from "../Custom/Collapsible/Collapsible";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import DataPreviewSections from "./DataPreviewSections";
import ExportData from "./ExportData";
import Styles from "./mappable-preview.scss";
import MetadataTable from "./MetadataTable";
import WarningBox from "./WarningBox";
/**
 * CatalogItem description.
 */
let Description = class Description extends React.Component {
    renderDescription(catalogItem) {
        if (catalogItem.type === "wms") {
            return (_jsx("p", { children: _jsxs(Trans, { i18nKey: "description.wms", children: ["This is a", _jsx("a", { href: "https://en.wikipedia.org/wiki/Web_Map_Service", target: "_blank", rel: "noopener noreferrer", children: "WMS service" }), ", which generates map images on request. It can be used in GIS software with this URL:"] }) }, "wms-description"));
        }
        else if (catalogItem.type === "wfs") {
            return (_jsx("p", { children: _jsxs(Trans, { i18nKey: "description.wfs", children: ["This is a", _jsx("a", { href: "https://en.wikipedia.org/wiki/Web_Feature_Service", target: "_blank", rel: "noopener noreferrer", children: "WFS service" }), ", which transfers raw spatial data on request. It can be used in GIS software with this URL:"] }) }, "wfs-description"));
        }
        return null;
    }
    render() {
        var _a, _b;
        const { t } = this.props;
        const catalogItem = this.props.item;
        // Make sure all data and metadata URLs have `url` set
        const metadataUrls = (_a = catalogItem.metadataUrls) === null || _a === void 0 ? void 0 : _a.filter((m) => m.url);
        const dataUrls = (_b = catalogItem.dataUrls) === null || _b === void 0 ? void 0 : _b.filter((m) => m.url);
        return (_jsxs("div", { className: Styles.description, css: `
          a,
          a:visited {
            color: ${(p) => p.theme.colorPrimary};
          }
        `, children: [catalogItem.isExperiencingIssues && (_jsx(WarningBox, { children: t("preview.mayBeExperiencingIssues") })), catalogItem.description && catalogItem.description.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: Styles.h4, children: t("description.name") }), parseCustomMarkdownToReact(catalogItem.description, {
                            catalogItem: catalogItem
                        })] })), catalogItem.hasLocalData && _jsx("p", { children: t("description.dataLocal") }), !catalogItem.hasLocalData &&
                    !catalogItem.hasDescription &&
                    !catalogItem.hideDefaultDescription && (_jsx("p", { children: t("description.dataNotLocal") })), metadataUrls && metadataUrls.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h4", { className: Styles.h4, children: t("description.metadataUrls") }), metadataUrls.map((metadataUrl, i) => (_jsx(Box, { paddedVertically: true, children: _jsxs("a", { href: metadataUrl.url, target: "_blank", rel: "noopener noreferrer", className: `${Styles.link} description-metadataUrls`, css: `
                    color: ${(p) => p.theme.colorPrimary};
                  `, children: [metadataUrl.title && (_jsx(Button, { primary: true, children: metadataUrl.title })), !metadataUrl.title ? metadataUrl.url : null] }) }, metadataUrl.url)))] })), _jsx(DataPreviewSections, { metadataItem: catalogItem }), catalogItem.dataCustodian && catalogItem.dataCustodian.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: Styles.h4, children: t("description.dataCustodian") }), parseCustomMarkdownToReact(catalogItem.dataCustodian, {
                            catalogItem: catalogItem
                        })] })), !catalogItem.hideSource && (_jsxs(_Fragment, { children: [catalogItem.url && (_jsxs(_Fragment, { children: [_jsxs("h4", { className: Styles.h4, children: [catalogItem.typeName, " URL"] }), this.renderDescription(catalogItem), this.props.printView ? (_jsx("code", { children: catalogItem.url })) : (_jsx("input", { readOnly: true, className: Styles.field, type: "text", value: catalogItem.url, onClick: (e) => e.target.select() })), catalogItem.type === "wms" ||
                                    (catalogItem.type === "esri-mapServer" &&
                                        defined(catalogItem.layers) && (_jsxs("p", { children: [t("description.layerName"), (catalogItem.layers || "").split(",").length > 1
                                                ? "s"
                                                : "", ": ", catalogItem.layers] }, "wms-layers"))), catalogItem.type === "wfs" && (_jsxs("p", { children: [t("description.typeName"), (catalogItem.typeNames || "").split(",").length > 1
                                            ? "s"
                                            : "", ": ", catalogItem.typeNames] }, "wfs-typeNames"))] })), dataUrls && dataUrls.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h4", { className: Styles.h4, children: t("description.dataUrl") }), dataUrls.map((dataUrl, i) => {
                                    var _a, _b, _c, _d;
                                    return (((_a = dataUrl.type) === null || _a === void 0 ? void 0 : _a.startsWith("wfs")) ||
                                        ((_b = dataUrl.type) === null || _b === void 0 ? void 0 : _b.startsWith("wcs"))) && (_jsxs(_Fragment, { children: [((_c = dataUrl.type) === null || _c === void 0 ? void 0 : _c.startsWith("wfs")) &&
                                                parseCustomMarkdownToReact(t("description.useLinkBelow", {
                                                    link: `
                          <a
                            href="http://docs.geoserver.org/latest/en/user/services/wfs/reference.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            key="wfs"
                          >
                            Web Feature Service (WFS) documentation
                          </a>
                        `
                                                })), ((_d = dataUrl.type) === null || _d === void 0 ? void 0 : _d.startsWith("wcs")) &&
                                                parseCustomMarkdownToReact(t("description.useLinkBelow", {
                                                    link: `
                          <a
                            href="http://docs.geoserver.org/latest/en/user/services/wcs/reference.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            key="wms"
                          >
                            Web Coverage Service (WCS) documentation
                          </a>
                        `
                                                })), _jsx(Box, { paddedVertically: true, children: _jsxs("a", { href: dataUrl.url, target: "_blank", rel: "noopener noreferrer", className: `${Styles.link} description-dataUrls`, css: `
                              color: ${(p) => p.theme.colorPrimary};
                            `, children: [dataUrl.title && (_jsx(Button, { primary: true, children: dataUrl.title })), !dataUrl.title ? dataUrl.url : null] }) }, dataUrl.url), " "] }));
                                })] })), !this.props.printView && defined(catalogItem.metadata) && (_jsxs(_Fragment, { children: [defined(catalogItem.metadata.dataSourceMetadata) &&
                                    catalogItem.metadata.dataSourceMetadata.items.length > 0 && (_jsx("div", { className: Styles.metadata, children: _jsx(Collapsible, { title: t("description.dataSourceDetails"), isInverse: true, children: _jsx(MetadataTable, { metadataItem: catalogItem.metadata.dataSourceMetadata }) }) })), defined(catalogItem.metadata.dataSourceMetadata) &&
                                    catalogItem.metadata.dataSourceMetadata.items.length > 0 && (_jsx("div", { className: Styles.metadata, children: _jsx(Collapsible, { title: t("description.dataServiceDetails"), isInverse: true, children: _jsx(MetadataTable, { metadataItem: catalogItem.metadata.serviceMetadata }) }) }))] }))] })), !this.props.printView ? _jsx(ExportData, { item: catalogItem }) : null] }));
    }
};
Object.defineProperty(Description, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        item: PropTypes.object.isRequired,
        printView: PropTypes.bool,
        t: PropTypes.func.isRequired
    }
});
Description = __decorate([
    observer
], Description);
export default withTranslation()(Description);
//# sourceMappingURL=Description.js.map