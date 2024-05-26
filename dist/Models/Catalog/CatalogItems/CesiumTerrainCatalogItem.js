var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, makeObservable, observable, override, runInAction } from "mobx";
import CesiumTerrainProvider from "terriajs-cesium/Source/Core/CesiumTerrainProvider";
import IonResource from "terriajs-cesium/Source/Core/IonResource";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import CesiumTerrainCatalogItemTraits from "../../../Traits/TraitsClasses/CesiumTerrainCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
class CesiumTerrainCatalogItem extends UrlMixin(MappableMixin(CatalogMemberMixin(CreateModel(CesiumTerrainCatalogItemTraits)))) {
    constructor(...args) {
        super(...args);
        /**
         * An observable terrain provider instance set by forceLoadMapItems()
         */
        Object.defineProperty(this, "terrainProvider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        makeObservable(this);
    }
    get type() {
        return CesiumTerrainCatalogItem.type;
    }
    get disableZoomTo() {
        return true;
    }
    get isTerrainActive() {
        return this.terria.terrainProvider === this.terrainProvider;
    }
    get shortReport() {
        if (super.shortReport === undefined) {
            const status = this.isTerrainActive ? "In use" : "Not in use";
            return `Terrain status: ${status}`;
        }
        return super.shortReport;
    }
    /**
     * Returns a Promise to load the terrain provider
     */
    loadTerrainProvider() {
        const resource = this.ionAssetId !== undefined
            ? IonResource.fromAssetId(this.ionAssetId, {
                accessToken: this.ionAccessToken ||
                    this.terria.configParameters.cesiumIonAccessToken,
                server: this.ionServer
            })
            : this.url;
        if (resource === undefined) {
            return Promise.resolve(undefined);
        }
        return CesiumTerrainProvider.fromUrl(resource, {
            credit: this.attribution
        });
    }
    async forceLoadMapItems() {
        const terrainProvider = await this.loadTerrainProvider();
        runInAction(() => {
            this.terrainProvider = terrainProvider;
        });
    }
    get mapItems() {
        return this.show && this.terrainProvider ? [this.terrainProvider] : [];
    }
}
Object.defineProperty(CesiumTerrainCatalogItem, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "cesium-terrain"
});
export default CesiumTerrainCatalogItem;
__decorate([
    observable
], CesiumTerrainCatalogItem.prototype, "terrainProvider", void 0);
__decorate([
    override
], CesiumTerrainCatalogItem.prototype, "disableZoomTo", null);
__decorate([
    computed
], CesiumTerrainCatalogItem.prototype, "isTerrainActive", null);
__decorate([
    override
], CesiumTerrainCatalogItem.prototype, "shortReport", null);
__decorate([
    computed
], CesiumTerrainCatalogItem.prototype, "mapItems", null);
//# sourceMappingURL=CesiumTerrainCatalogItem.js.map