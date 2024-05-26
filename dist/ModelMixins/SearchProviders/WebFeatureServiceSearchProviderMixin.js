import { makeObservable, runInAction } from "mobx";
import Resource from "terriajs-cesium/Source/Core/Resource";
import URI from "urijs";
import zoomRectangleFromPoint from "../../Map/Vector/zoomRectangleFromPoint";
import xml2json from "../../ThirdParty/xml2json";
import LocationSearchProviderMixin from "./LocationSearchProviderMixin";
function WebFeatureServiceSearchProviderMixin(Base) {
    class WebFeatureServiceSearchProviderMixin extends LocationSearchProviderMixin(Base) {
        constructor(...args) {
            super(...args);
            Object.defineProperty(this, "cancelRequest", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "_waitingForResults", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: false
            });
            makeObservable(this);
        }
        getXml(url) {
            const resource = new Resource({ url });
            this._waitingForResults = true;
            const xmlPromise = resource.fetchXML();
            this.cancelRequest = resource.request.cancelFunction;
            return xmlPromise.finally(() => {
                this._waitingForResults = false;
            });
        }
        doSearch(searchText, results) {
            results.results.length = 0;
            results.message = undefined;
            if (this._waitingForResults) {
                // There's been a new search! Cancel the previous one.
                if (this.cancelRequest !== undefined) {
                    this.cancelRequest();
                    this.cancelRequest = undefined;
                }
                this._waitingForResults = false;
            }
            const originalSearchText = searchText;
            searchText = searchText.trim();
            if (this.transformSearchText !== undefined) {
                searchText = this.transformSearchText(searchText);
            }
            if (searchText.length < 2) {
                return Promise.resolve();
            }
            // Support for matchCase="false" is patchy, but we try anyway
            const filter = `<ogc:Filter><ogc:PropertyIsLike wildCard="*" matchCase="false">
          <ogc:ValueReference>${this.searchPropertyName}</ogc:ValueReference>
          <ogc:Literal>*${searchText}*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter>`;
            const _wfsServiceUrl = new URI(this.url);
            _wfsServiceUrl.setSearch({
                service: "WFS",
                request: "GetFeature",
                typeName: this.searchPropertyTypeName,
                version: "1.1.0",
                srsName: "urn:ogc:def:crs:EPSG::4326",
                filter: filter
            });
            return this.getXml(_wfsServiceUrl.toString())
                .then((xml) => {
                const json = xml2json(xml);
                let features;
                if (json === undefined) {
                    results.message = {
                        content: "translate#viewModels.searchErrorOccurred"
                    };
                    return;
                }
                if (json.member !== undefined) {
                    features = json.member;
                }
                else if (json.featureMember !== undefined) {
                    features = json.featureMember;
                }
                else {
                    results.message = {
                        content: "translate#viewModels.searchNoPlaceNames"
                    };
                    return;
                }
                // if there's only one feature, make it an array
                if (!Array.isArray(features)) {
                    features = [features];
                }
                const resultSet = new Set();
                runInAction(() => {
                    if (this.searchResultFilterFunction !== undefined) {
                        features = features.filter(this.searchResultFilterFunction);
                    }
                    if (features.length === 0) {
                        results.message = {
                            content: "translate#viewModels.searchNoPlaceNames"
                        };
                        return;
                    }
                    if (this.searchResultScoreFunction !== undefined) {
                        features = features.sort((featureA, featureB) => this.searchResultScoreFunction(featureB, originalSearchText) -
                            this.searchResultScoreFunction(featureA, originalSearchText));
                    }
                    let searchResults = features
                        .map(this.featureToSearchResultFunction)
                        .map((result) => {
                        result.clickAction = createZoomToFunction(this, result.location);
                        return result;
                    });
                    // If we don't have a scoring function, sort the search results now
                    // We can't do this earlier because we don't know what the schema of the unprocessed feature looks like
                    if (this.searchResultScoreFunction === undefined) {
                        // Put shorter results first
                        // They have a larger percentage of letters that the user actually typed in them
                        searchResults = searchResults.sort((featureA, featureB) => featureA.name.length - featureB.name.length);
                    }
                    // Remove results that have the same name and are close to each other
                    searchResults = searchResults.filter((result) => {
                        var _a, _b;
                        const hash = `${result.name},${(_a = result.location) === null || _a === void 0 ? void 0 : _a.latitude.toFixed(1)},${(_b = result.location) === null || _b === void 0 ? void 0 : _b.longitude.toFixed(1)}`;
                        if (resultSet.has(hash)) {
                            return false;
                        }
                        resultSet.add(hash);
                        return true;
                    });
                    // append new results to all results
                    results.results.push(...searchResults);
                });
            })
                .catch((e) => {
                if (results.isCanceled) {
                    // A new search has superseded this one, so ignore the result.
                    return;
                }
                results.message = {
                    content: "translate#viewModels.searchErrorOccurred"
                };
            });
        }
        get isWebFeatureServiceSearchProviderMixin() {
            return true;
        }
    }
    return WebFeatureServiceSearchProviderMixin;
}
(function (WebFeatureServiceSearchProviderMixin) {
    function isMixedInto(model) {
        return model && model.isWebFeatureServiceSearchProviderMixin;
    }
    WebFeatureServiceSearchProviderMixin.isMixedInto = isMixedInto;
})(WebFeatureServiceSearchProviderMixin || (WebFeatureServiceSearchProviderMixin = {}));
export default WebFeatureServiceSearchProviderMixin;
function createZoomToFunction(model, location) {
    // Server does not return information of a bounding box, just a location.
    // bboxSize is used to expand a point
    const bboxSize = 0.2;
    const rectangle = zoomRectangleFromPoint(location.latitude, location.longitude, bboxSize);
    const flightDurationSeconds = model.flightDurationSeconds ||
        model.terria.searchBarModel.flightDurationSeconds;
    return function () {
        model.terria.currentViewer.zoomTo(rectangle, flightDurationSeconds);
    };
}
//# sourceMappingURL=WebFeatureServiceSearchProviderMixin.js.map