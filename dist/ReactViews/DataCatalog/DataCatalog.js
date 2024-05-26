var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import defined from "terriajs-cesium/Source/Core/defined";
import SearchHeader from "../Search/SearchHeader";
import Styles from "./data-catalog.scss";
import DataCatalogMember from "./DataCatalogMember";
// Displays the data catalog.
let DataCatalog = class DataCatalog extends React.Component {
    render() {
        var _a;
        const searchState = this.props.viewState.searchState;
        const isSearching = searchState.catalogSearchText.length > 0;
        const catalogSearchProvider = searchState.catalogSearchProvider;
        const unfilteredItems = isSearching &&
            catalogSearchProvider &&
            ((_a = searchState.catalogSearchResults) === null || _a === void 0 ? void 0 : _a.results)
            ? searchState.catalogSearchResults.results.map((result) => result.catalogItem)
            : this.props.items;
        const items = (unfilteredItems || []).filter(defined);
        const { t } = this.props;
        return (_jsxs("ul", { className: Styles.dataCatalog, children: [isSearching && catalogSearchProvider && (_jsxs(_Fragment, { children: [_jsx("label", { className: Styles.label, children: t("search.resultsLabel") }), _jsx(SearchHeader, { searchResults: searchState.catalogSearchResults, isWaitingForSearchToStart: searchState.isWaitingToStartCatalogSearch })] })), items.map((item) => item !== this.props.terria.catalog.userAddedDataGroup && (_jsx(DataCatalogMember, { viewState: this.props.viewState, member: item, 
                    // manage group `isOpen` flag locally if searching through models dynamically (i.e. not using catalog index)
                    // This must be false if resultsAreReferences - so group references open correctly in the search
                    manageIsOpenLocally: isSearching && !catalogSearchProvider.resultsAreReferences, onActionButtonClicked: this.props.onActionButtonClicked, removable: this.props.removable, terria: this.props.terria, isTopLevel: true }, item.uniqueId)))] }));
    }
};
Object.defineProperty(DataCatalog, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object,
        viewState: PropTypes.object,
        items: PropTypes.array,
        onActionButtonClicked: PropTypes.func,
        removable: PropTypes.bool,
        t: PropTypes.func.isRequired
    }
});
DataCatalog = __decorate([
    observer
], DataCatalog);
export default withTranslation()(DataCatalog);
//# sourceMappingURL=DataCatalog.js.map