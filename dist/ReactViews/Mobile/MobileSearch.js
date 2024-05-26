var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import { addMarker } from "../../Models/LocationMarkerUtils";
import LocationSearchResults from "../Search/LocationSearchResults";
import SearchResult from "../Search/SearchResult";
import { withTranslation } from "react-i18next";
import Styles from "./mobile-search.scss";
// A Location item when doing Bing map searvh or Gazetter search
let MobileSearch = class MobileSearch extends React.Component {
    onLocationClick(result) {
        runInAction(() => {
            result.clickAction();
            addMarker(this.props.terria, result);
            // Close modal window
            this.props.viewState.switchMobileView(null);
            this.props.viewState.searchState.showMobileLocationSearch = false;
        });
    }
    searchInDataCatalog() {
        const { searchState } = this.props.viewState;
        runInAction(() => {
            // Set text here so that it doesn't get batched up and the catalog
            // search text has a chance to set isWaitingToStartCatalogSearch
            searchState.catalogSearchText = searchState.locationSearchText;
        });
        this.props.viewState.searchInCatalog(searchState.locationSearchText);
    }
    render() {
        const theme = "light";
        return (_jsxs("div", { className: Styles.mobileSearch, children: [_jsx("div", { children: this.renderSearchInCatalogLink(theme) }), _jsx("div", { className: Styles.location, children: this.renderLocationResult(theme) })] }));
    }
    renderSearchInCatalogLink(theme) {
        const { t } = this.props;
        const searchState = this.props.viewState.searchState;
        if (searchState.locationSearchText.length === 0) {
            return null;
        }
        return (_jsx("div", { className: Styles.providerResult, children: _jsx("ul", { className: Styles.btnList, children: searchState.catalogSearchProvider && (_jsx(SearchResult, { clickAction: () => this.searchInDataCatalog(), icon: null, locationSearchText: searchState.locationSearchText, name: t("search.search", {
                        searchText: searchState.locationSearchText
                    }), searchResultTheme: theme })) }) }));
    }
    renderLocationResult(theme) {
        const searchState = this.props.viewState.searchState;
        return searchState.locationSearchResults.map((search) => (_jsx(LocationSearchResults, { terria: this.props.terria, viewState: this.props.viewState, search: search, locationSearchText: searchState.locationSearchText, onLocationClick: this.onLocationClick.bind(this), isWaitingForSearchToStart: searchState.isWaitingToStartLocationSearch, theme: theme }, search.searchProvider.name)));
    }
};
Object.defineProperty(MobileSearch, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        viewState: PropTypes.object,
        terria: PropTypes.object,
        t: PropTypes.func.isRequired
    }
});
MobileSearch = __decorate([
    observer
], MobileSearch);
module.exports = withTranslation()(MobileSearch);
//# sourceMappingURL=MobileSearch.js.map