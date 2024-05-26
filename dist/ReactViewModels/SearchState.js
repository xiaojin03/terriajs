var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable, reaction, makeObservable, runInAction } from "mobx";
import filterOutUndefined from "../Core/filterOutUndefined";
import CatalogSearchProvider from "../Models/SearchProviders/CatalogSearchProvider";
export default class SearchState {
    constructor(options) {
        Object.defineProperty(this, "catalogSearchText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "isWaitingToStartCatalogSearch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "locationSearchText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "isWaitingToStartLocationSearch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "unifiedSearchText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "isWaitingToStartUnifiedSearch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "showLocationSearchResults", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "showMobileLocationSearch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "showMobileCatalogSearch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "locationSearchResults", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "catalogSearchResults", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "unifiedSearchResults", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_catalogSearchDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_locationSearchDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_unifiedSearchDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "terria", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        makeObservable(this);
        this.terria = options.terria;
        runInAction(() => {
            this.terria.searchBarModel.catalogSearchProvider =
                options.catalogSearchProvider ||
                    new CatalogSearchProvider("catalog-search-provider", options.terria);
        });
        const self = this;
        this._catalogSearchDisposer = reaction(() => self.catalogSearchText, () => {
            self.isWaitingToStartCatalogSearch = true;
            if (self.catalogSearchProvider) {
                self.catalogSearchResults = self.catalogSearchProvider.search("");
            }
        });
        this._locationSearchDisposer = reaction(() => self.locationSearchText, () => {
            self.isWaitingToStartLocationSearch = true;
            self.locationSearchResults = self.locationSearchProviders.map((provider) => {
                return provider.search("");
            });
        });
        this._unifiedSearchDisposer = reaction(() => this.unifiedSearchText, () => {
            this.isWaitingToStartUnifiedSearch = true;
            this.unifiedSearchResults = this.unifiedSearchProviders.map((provider) => {
                return provider.search("");
            });
        });
    }
    dispose() {
        this._catalogSearchDisposer();
        this._locationSearchDisposer();
        this._unifiedSearchDisposer();
    }
    get locationSearchProviders() {
        return this.terria.searchBarModel.locationSearchProvidersArray;
    }
    get catalogSearchProvider() {
        return this.terria.searchBarModel.catalogSearchProvider;
    }
    get unifiedSearchProviders() {
        return filterOutUndefined([
            this.catalogSearchProvider,
            ...this.locationSearchProviders
        ]);
    }
    searchCatalog() {
        if (this.isWaitingToStartCatalogSearch) {
            this.isWaitingToStartCatalogSearch = false;
            if (this.catalogSearchResults) {
                this.catalogSearchResults.isCanceled = true;
            }
            if (this.catalogSearchProvider) {
                this.catalogSearchResults = this.catalogSearchProvider.search(this.catalogSearchText);
            }
        }
    }
    setCatalogSearchText(newText) {
        this.catalogSearchText = newText;
    }
    searchLocations() {
        if (this.isWaitingToStartLocationSearch) {
            this.isWaitingToStartLocationSearch = false;
            this.locationSearchResults.forEach((results) => {
                results.isCanceled = true;
            });
            this.locationSearchResults = this.locationSearchProviders.map((searchProvider) => searchProvider.search(this.locationSearchText));
        }
    }
    searchUnified() {
        if (this.isWaitingToStartUnifiedSearch) {
            this.isWaitingToStartUnifiedSearch = false;
            this.unifiedSearchResults.forEach((results) => {
                results.isCanceled = true;
            });
            this.unifiedSearchResults = this.unifiedSearchProviders.map((searchProvider) => searchProvider.search(this.unifiedSearchText));
        }
    }
}
__decorate([
    observable
], SearchState.prototype, "catalogSearchText", void 0);
__decorate([
    observable
], SearchState.prototype, "isWaitingToStartCatalogSearch", void 0);
__decorate([
    observable
], SearchState.prototype, "locationSearchText", void 0);
__decorate([
    observable
], SearchState.prototype, "isWaitingToStartLocationSearch", void 0);
__decorate([
    observable
], SearchState.prototype, "unifiedSearchText", void 0);
__decorate([
    observable
], SearchState.prototype, "isWaitingToStartUnifiedSearch", void 0);
__decorate([
    observable
], SearchState.prototype, "showLocationSearchResults", void 0);
__decorate([
    observable
], SearchState.prototype, "showMobileLocationSearch", void 0);
__decorate([
    observable
], SearchState.prototype, "showMobileCatalogSearch", void 0);
__decorate([
    observable
], SearchState.prototype, "locationSearchResults", void 0);
__decorate([
    observable
], SearchState.prototype, "catalogSearchResults", void 0);
__decorate([
    observable
], SearchState.prototype, "unifiedSearchResults", void 0);
__decorate([
    computed
], SearchState.prototype, "locationSearchProviders", null);
__decorate([
    computed
], SearchState.prototype, "catalogSearchProvider", null);
__decorate([
    computed
], SearchState.prototype, "unifiedSearchProviders", null);
__decorate([
    action
], SearchState.prototype, "searchCatalog", null);
__decorate([
    action
], SearchState.prototype, "setCatalogSearchText", null);
__decorate([
    action
], SearchState.prototype, "searchLocations", null);
__decorate([
    action
], SearchState.prototype, "searchUnified", null);
//# sourceMappingURL=SearchState.js.map