var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, makeObservable } from "mobx";
import MapboxStyleImageryProvider from "terriajs-cesium/Source/Scene/MapboxStyleImageryProvider";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import MapboxStyleCatalogItemTraits from "../../../Traits/TraitsClasses/MapboxStyleCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
/**
 *  A raster catalog item for rendering styled mapbox layers.
 */
class MapboxStyleCatalogItem extends MappableMixin(CatalogMemberMixin(CreateModel(MapboxStyleCatalogItemTraits))) {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: MapboxStyleCatalogItem.type
        });
        makeObservable(this);
    }
    forceLoadMapItems() {
        return Promise.resolve();
    }
    get imageryProvider() {
        const styleId = this.styleId;
        const accessToken = this.accessToken;
        if (styleId === undefined || accessToken === undefined) {
            return;
        }
        const imageryProvider = new MapboxStyleImageryProvider({
            url: this.url,
            username: this.username,
            styleId,
            accessToken,
            tilesize: this.tilesize,
            scaleFactor: this.scaleFactor,
            minimumLevel: this.minimumLevel,
            maximumLevel: this.maximumLevel,
            credit: this.attribution
        });
        return imageryProvider;
    }
    get mapItems() {
        const imageryProvider = this.imageryProvider;
        if (imageryProvider === undefined) {
            return [];
        }
        const imageryPart = {
            imageryProvider,
            show: this.show,
            alpha: this.opacity,
            clippingRectangle: this.clipToRectangle ? this.cesiumRectangle : undefined
        };
        return [imageryPart];
    }
}
Object.defineProperty(MapboxStyleCatalogItem, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "mapbox-style"
});
export default MapboxStyleCatalogItem;
__decorate([
    computed
], MapboxStyleCatalogItem.prototype, "imageryProvider", null);
__decorate([
    computed
], MapboxStyleCatalogItem.prototype, "mapItems", null);
//# sourceMappingURL=MapboxStyleCatalogItem.js.map