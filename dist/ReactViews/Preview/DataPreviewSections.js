var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx } from "react/jsx-runtime";
import naturalSort from "javascript-natural-sort";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import Mustache from "mustache";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import isDefined from "../../Core/isDefined";
import CommonStrata from "../../Models/Definition/CommonStrata";
import Box from "../../Styled/Box";
import Collapsible from "../Custom/Collapsible/Collapsible";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import MetadataTable from "./MetadataTable";
naturalSort.insensitive = true;
Mustache.escape = function (string) {
    return string;
};
/**
 * CatalogItem-defined sections that sit within the preview description. These are ordered according to the catalog item's
 * order if available.
 */
let DataPreviewSections = class DataPreviewSections extends React.Component {
    sortInfoSections(items) {
        const infoSectionOrder = this.props.metadataItem.infoSectionOrder;
        items.sort(function (a, b) {
            const aIndex = infoSectionOrder.indexOf(a.name);
            const bIndex = infoSectionOrder.indexOf(b.name);
            if (aIndex >= 0 && bIndex < 0) {
                return -1;
            }
            else if (aIndex < 0 && bIndex >= 0) {
                return 1;
            }
            else if (aIndex < 0 && bIndex < 0) {
                return naturalSort(a.name, b.name);
            }
            return aIndex - bIndex;
        });
        return items.filter((item) => {
            var _a, _b;
            return isDefined((_a = item.content) !== null && _a !== void 0 ? _a : item.contentAsObject) &&
                ((_b = item.content) !== null && _b !== void 0 ? _b : item.contentAsObject) !== null &&
                item.content !== "";
        });
    }
    clickInfoSection(reportName, isOpen) {
        const info = this.props.metadataItem.info;
        const clickedInfo = info.find((report) => report.name === reportName);
        if (isDefined(clickedInfo)) {
            runInAction(() => {
                clickedInfo.setTrait(CommonStrata.user, "show", isOpen);
            });
        }
        return false;
    }
    render() {
        const metadataItem = this.props.metadataItem;
        const items = metadataItem.hideSource
            ? metadataItem.infoWithoutSources
            : metadataItem.info.slice();
        const renderSection = (item) => {
            let content = item.content;
            try {
                content = Mustache.render(content, metadataItem);
            }
            catch (error) {
                console.log(`FAILED to parse info section ${item.name} for ${metadataItem.name}`);
                console.log(error);
            }
            return parseCustomMarkdownToReact(content, {
                catalogItem: metadataItem
            });
        };
        return (_jsx("div", { children: this.sortInfoSections(items).map((item, i) => {
                var _a;
                return (_jsx(Box, { paddedVertically: true, displayInlineBlock: true, fullWidth: true, children: _jsx(Collapsible, { light: false, title: item.name, isOpen: item.show, onToggle: (show) => this.clickInfoSection.bind(this, item.name, show)(), bodyTextProps: { medium: true }, children: ((_a = item.content) === null || _a === void 0 ? void 0 : _a.length) > 0
                            ? renderSection(item)
                            : item.contentAsObject !== undefined && (_jsx(Box, { paddedVertically: 3, fullWidth: true, children: _jsx(MetadataTable, { metadataItem: item.contentAsObject }) })) }, i) }, i));
            }) }));
    }
};
Object.defineProperty(DataPreviewSections, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        metadataItem: PropTypes.object.isRequired,
        t: PropTypes.func.isRequired
    }
});
DataPreviewSections = __decorate([
    observer
], DataPreviewSections);
export default withTranslation()(DataPreviewSections);
//# sourceMappingURL=DataPreviewSections.js.map