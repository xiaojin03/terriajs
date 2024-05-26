var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { makeObservable } from "mobx";
import SearchProviderMixin from "../../ModelMixins/SearchProviders/SearchProviderMixin";
import primitiveTrait from "../../Traits/Decorators/primitiveTrait";
import LocationSearchProviderTraits from "../../Traits/SearchProviders/LocationSearchProviderTraits";
import CreateModel from "../Definition/CreateModel";
export class StubSearchProviderTraits extends LocationSearchProviderTraits {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "isExperiencingIssues", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is experiencing issues",
        description: "Whether the search provider is experiencing issues which may cause search results to be unavailable"
    })
], StubSearchProviderTraits.prototype, "isExperiencingIssues", void 0);
class StubSearchProvider extends SearchProviderMixin(CreateModel(StubSearchProviderTraits)) {
    constructor(...args) {
        super(...args);
        makeObservable(this);
    }
    get type() {
        return StubSearchProvider.type;
    }
    logEvent(searchText) {
        return;
    }
    doSearch(searchText, results) {
        return Promise.resolve();
    }
}
Object.defineProperty(StubSearchProvider, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "stub-search-provider"
});
export default StubSearchProvider;
//# sourceMappingURL=StubSearchProvider.js.map