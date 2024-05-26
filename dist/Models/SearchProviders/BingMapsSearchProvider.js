var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { makeObservable, override, runInAction } from "mobx";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import Resource from "terriajs-cesium/Source/Core/Resource";
import defined from "terriajs-cesium/Source/Core/defined";
import { Category, SearchAction } from "../../Core/AnalyticEvents/analyticEvents";
import { loadJsonp } from "../../Core/loadJsonp";
import { applyTranslationIfExists } from "../../Language/languageHelpers";
import LocationSearchProviderMixin, { getMapCenter } from "../../ModelMixins/SearchProviders/LocationSearchProviderMixin";
import BingMapsSearchProviderTraits from "../../Traits/SearchProviders/BingMapsSearchProviderTraits";
import CreateModel from "../Definition/CreateModel";
import CommonStrata from "./../Definition/CommonStrata";
import SearchResult from "./SearchResult";
class BingMapsSearchProvider extends LocationSearchProviderMixin(CreateModel(BingMapsSearchProviderTraits)) {
    get type() {
        return BingMapsSearchProvider.type;
    }
    constructor(uniqueId, terria) {
        super(uniqueId, terria);
        makeObservable(this);
        runInAction(() => {
            if (this.terria.configParameters.bingMapsKey) {
                this.setTrait(CommonStrata.defaults, "key", this.terria.configParameters.bingMapsKey);
            }
        });
    }
    showWarning() {
        if (!this.key || this.key === "") {
            console.warn(`The ${applyTranslationIfExists(this.name, i18next)}(${this.type}) geocoder will always return no results because a Bing Maps key has not been provided. Please get a Bing Maps key from bingmapsportal.com and add it to parameters.bingMapsKey in config.json.`);
        }
    }
    logEvent(searchText) {
        var _a;
        (_a = this.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.search, SearchAction.gazetteer, searchText);
    }
    doSearch(searchText, searchResults) {
        searchResults.results.length = 0;
        searchResults.message = undefined;
        const searchQuery = new Resource({
            url: this.url + "REST/v1/Locations",
            queryParameters: {
                culture: this.culture,
                query: searchText,
                key: this.key,
                maxResults: this.maxResults
            }
        });
        if (this.mapCenter) {
            const mapCenter = getMapCenter(this.terria);
            searchQuery.appendQueryParameters({
                userLocation: `${mapCenter.latitude}, ${mapCenter.longitude}`
            });
        }
        const promise = loadJsonp(searchQuery, "jsonp");
        return promise
            .then((result) => {
            if (searchResults.isCanceled) {
                // A new search has superseded this one, so ignore the result.
                return;
            }
            if (result.resourceSets.length === 0) {
                searchResults.message = {
                    content: "translate#viewModels.searchNoLocations"
                };
                return;
            }
            const resourceSet = result.resourceSets[0];
            if (resourceSet.resources.length === 0) {
                searchResults.message = {
                    content: "translate#viewModels.searchNoLocations"
                };
                return;
            }
            runInAction(() => {
                const locations = this.sortByPriority(resourceSet.resources);
                searchResults.results.push(...locations.primaryCountry);
                searchResults.results.push(...locations.other);
            });
            if (searchResults.results.length === 0) {
                searchResults.message = {
                    content: "translate#viewModels.searchNoLocations"
                };
            }
        })
            .catch(() => {
            if (searchResults.isCanceled) {
                // A new search has superseded this one, so ignore the result.
                return;
            }
            searchResults.message = {
                content: "translate#viewModels.searchErrorOccurred"
            };
        });
    }
    sortByPriority(resources) {
        const primaryCountryLocations = [];
        const otherLocations = [];
        // Locations in the primary country go on top, locations elsewhere go undernearth and we add
        // the country name to them.
        for (let i = 0; i < resources.length; ++i) {
            const resource = resources[i];
            let name = resource.name;
            if (!defined(name)) {
                continue;
            }
            let list = primaryCountryLocations;
            let isImportant = true;
            const country = resource.address
                ? resource.address.countryRegion
                : undefined;
            if (defined(this.primaryCountry) && country !== this.primaryCountry) {
                // Add this location to the list of other locations.
                list = otherLocations;
                isImportant = false;
                // Add the country to the name, if it's not already there.
                if (defined(country) &&
                    name.lastIndexOf(country) !== name.length - country.length) {
                    name += ", " + country;
                }
            }
            list.push(new SearchResult({
                name: name,
                isImportant: isImportant,
                clickAction: createZoomToFunction(this, resource),
                location: {
                    latitude: resource.point.coordinates[0],
                    longitude: resource.point.coordinates[1]
                }
            }));
        }
        return {
            primaryCountry: primaryCountryLocations,
            other: otherLocations
        };
    }
}
Object.defineProperty(BingMapsSearchProvider, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "bing-maps-search-provider"
});
export default BingMapsSearchProvider;
__decorate([
    override
], BingMapsSearchProvider.prototype, "showWarning", null);
function createZoomToFunction(model, resource) {
    const [south, west, north, east] = resource.bbox;
    const rectangle = Rectangle.fromDegrees(west, south, east, north);
    return function () {
        const terria = model.terria;
        terria.currentViewer.zoomTo(rectangle, model.flightDurationSeconds);
    };
}
//# sourceMappingURL=BingMapsSearchProvider.js.map