var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { makeObservable, override, runInAction } from "mobx";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import { Category, SearchAction } from "../../Core/AnalyticEvents/analyticEvents";
import loadJson from "../../Core/loadJson";
import { applyTranslationIfExists } from "../../Language/languageHelpers";
import LocationSearchProviderMixin from "../../ModelMixins/SearchProviders/LocationSearchProviderMixin";
import CesiumIonSearchProviderTraits from "../../Traits/SearchProviders/CesiumIonSearchProviderTraits";
import CreateModel from "../Definition/CreateModel";
import SearchResult from "./SearchResult";
import CommonStrata from "../Definition/CommonStrata";
class CesiumIonSearchProvider extends LocationSearchProviderMixin(CreateModel(CesiumIonSearchProviderTraits)) {
    get type() {
        return CesiumIonSearchProvider.type;
    }
    constructor(uniqueId, terria) {
        super(uniqueId, terria);
        makeObservable(this);
        runInAction(() => {
            if (this.terria.configParameters.cesiumIonAccessToken) {
                this.setTrait(CommonStrata.defaults, "key", this.terria.configParameters.cesiumIonAccessToken);
            }
        });
    }
    showWarning() {
        if (!this.key || this.key === "") {
            console.warn(`The ${applyTranslationIfExists(this.name, i18next)}(${this.type}) geocoder will always return no results because a CesiumIon key has not been provided. Please get a CesiumIon key from ion.cesium.com, ensure it has geocoding permission and add it to searchProvider.key or parameters.cesiumIonAccessToken in config.json.`);
        }
    }
    logEvent(searchText) {
        var _a;
        (_a = this.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.search, SearchAction.cesium, searchText);
    }
    async doSearch(searchText, searchResults) {
        searchResults.results.length = 0;
        searchResults.message = undefined;
        let response;
        try {
            response = await loadJson(`${this.url}?text=${searchText}&access_token=${this.key}`);
        }
        catch (e) {
            searchResults.message = {
                content: "translate#viewModels.searchErrorOccurred"
            };
            return;
        }
        runInAction(() => {
            if (!response.features || response.features.length === 0) {
                searchResults.message = {
                    content: "translate#viewModels.searchNoLocations"
                };
                return;
            }
            searchResults.results = response.features.map((feature) => {
                const [w, s, e, n] = feature.bbox;
                const rectangle = Rectangle.fromDegrees(w, s, e, n);
                return new SearchResult({
                    name: feature.properties.label,
                    clickAction: createZoomToFunction(this, rectangle),
                    location: {
                        latitude: (s + n) / 2,
                        longitude: (e + w) / 2
                    }
                });
            });
        });
    }
}
Object.defineProperty(CesiumIonSearchProvider, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "cesium-ion-search-provider"
});
export default CesiumIonSearchProvider;
__decorate([
    override
], CesiumIonSearchProvider.prototype, "showWarning", null);
function createZoomToFunction(model, rectangle) {
    return function () {
        const terria = model.terria;
        terria.currentViewer.zoomTo(rectangle, model.flightDurationSeconds);
    };
}
//# sourceMappingURL=CesiumIonSearchProvider.js.map