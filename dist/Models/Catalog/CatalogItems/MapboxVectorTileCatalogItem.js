var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import bbox from "@turf/bbox";
import i18next from "i18next";
import { computed, runInAction, makeObservable, override } from "mobx";
import { GeomType, json_style, LineSymbolizer, PolygonSymbolizer } from "protomaps";
import loadJson from "../../../Core/loadJson";
import TerriaError from "../../../Core/TerriaError";
import ProtomapsImageryProvider, { GeojsonSource } from "../../../Map/ImageryProvider/ProtomapsImageryProvider";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import LegendTraits, { LegendItemTraits } from "../../../Traits/TraitsClasses/LegendTraits";
import MapboxVectorTileCatalogItemTraits from "../../../Traits/TraitsClasses/MapboxVectorTileCatalogItemTraits";
import { RectangleTraits } from "../../../Traits/TraitsClasses/MappableTraits";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
class MapboxVectorTileLoadableStratum extends LoadableStratum(MapboxVectorTileCatalogItemTraits) {
    constructor(item, styleJson) {
        super();
        Object.defineProperty(this, "item", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: item
        });
        Object.defineProperty(this, "styleJson", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: styleJson
        });
        makeObservable(this);
    }
    duplicateLoadableStratum(newModel) {
        return new MapboxVectorTileLoadableStratum(newModel, this.styleJson);
    }
    static async load(item) {
        let styleJson;
        if (item.styleUrl) {
            try {
                styleJson = await loadJson(proxyCatalogItemUrl(item, item.styleUrl));
            }
            catch (e) {
                throw TerriaError.from(e, `Failed to load style JSON from url ${item.styleUrl}`);
            }
        }
        return new MapboxVectorTileLoadableStratum(item, styleJson);
    }
    get style() {
        return this.styleJson;
    }
    get opacity() {
        return 1;
    }
    get legends() {
        if (!this.item.fillColor && !this.item.lineColor)
            return [];
        return [
            createStratumInstance(LegendTraits, {
                items: [
                    createStratumInstance(LegendItemTraits, {
                        color: this.item.fillColor,
                        outlineColor: this.item.lineColor,
                        outlineWidth: this.item.lineColor ? 1 : undefined,
                        title: this.item.name
                    })
                ]
            })
        ];
    }
    get rectangle() {
        var _a;
        if (((_a = this.item.imageryProvider) === null || _a === void 0 ? void 0 : _a.source) instanceof GeojsonSource &&
            this.item.imageryProvider.source.geojsonObject) {
            const geojsonBbox = bbox(this.item.imageryProvider.source.geojsonObject);
            return createStratumInstance(RectangleTraits, {
                west: geojsonBbox[0],
                south: geojsonBbox[1],
                east: geojsonBbox[2],
                north: geojsonBbox[3]
            });
        }
    }
}
Object.defineProperty(MapboxVectorTileLoadableStratum, "stratumName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "MapboxVectorTileLoadable"
});
__decorate([
    computed
], MapboxVectorTileLoadableStratum.prototype, "legends", null);
__decorate([
    computed
], MapboxVectorTileLoadableStratum.prototype, "rectangle", null);
StratumOrder.addLoadStratum(MapboxVectorTileLoadableStratum.stratumName);
class MapboxVectorTileCatalogItem extends MappableMixin(UrlMixin(CatalogMemberMixin(CreateModel(MapboxVectorTileCatalogItemTraits)))) {
    constructor(...args) {
        super(...args);
        makeObservable(this);
    }
    get type() {
        return MapboxVectorTileCatalogItem.type;
    }
    get typeName() {
        return i18next.t("models.mapboxVectorTile.name");
    }
    get forceProxy() {
        return true;
    }
    async forceLoadMetadata() {
        const stratum = await MapboxVectorTileLoadableStratum.load(this);
        runInAction(() => {
            this.strata.set(MapboxVectorTileLoadableStratum.stratumName, stratum);
        });
    }
    get parsedJsonStyle() {
        if (this.style) {
            return json_style(this.style, new Map());
        }
    }
    get paintRules() {
        const rules = [];
        if (this.layer) {
            if (this.fillColor) {
                rules.push({
                    dataLayer: this.layer,
                    symbolizer: new PolygonSymbolizer({ fill: this.fillColor }),
                    minzoom: this.minimumZoom,
                    maxzoom: this.maximumZoom,
                    // Only apply polygon/fill symbolizer to polygon features (otherwise it will also apply to line features)
                    filter: (z, f) => f.geomType === GeomType.Polygon
                });
            }
            if (this.lineColor) {
                rules.push({
                    dataLayer: this.layer,
                    symbolizer: new LineSymbolizer({ color: this.lineColor }),
                    minzoom: this.minimumZoom,
                    maxzoom: this.maximumZoom
                });
            }
        }
        if (this.parsedJsonStyle) {
            rules.push(...this.parsedJsonStyle.paint_rules);
        }
        return rules;
    }
    get labelRules() {
        if (this.parsedJsonStyle) {
            return this.parsedJsonStyle.label_rules;
        }
        return [];
    }
    get imageryProvider() {
        if (this.url === undefined) {
            return;
        }
        return new ProtomapsImageryProvider({
            terria: this.terria,
            id: this.uniqueId,
            data: this.url,
            minimumZoom: this.minimumZoom,
            maximumNativeZoom: this.maximumNativeZoom,
            maximumZoom: this.maximumZoom,
            credit: this.attribution,
            paintRules: this.paintRules,
            labelRules: this.labelRules,
            idProperty: this.idProperty
        });
    }
    forceLoadMapItems() {
        return Promise.resolve();
    }
    get mapItems() {
        if (this.isLoadingMapItems || this.imageryProvider === undefined) {
            return [];
        }
        return [
            {
                imageryProvider: this.imageryProvider,
                show: this.show,
                alpha: this.opacity,
                clippingRectangle: this.clipToRectangle
                    ? this.cesiumRectangle
                    : undefined
            }
        ];
    }
}
Object.defineProperty(MapboxVectorTileCatalogItem, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "mvt"
});
__decorate([
    override
], MapboxVectorTileCatalogItem.prototype, "forceProxy", null);
__decorate([
    computed
], MapboxVectorTileCatalogItem.prototype, "parsedJsonStyle", null);
__decorate([
    computed
    /** Convert traits into paint rules:
     * - `layer` and `fillColor`/`lineColor` into simple rules
     * - `parsedJsonStyle`
     */
], MapboxVectorTileCatalogItem.prototype, "paintRules", null);
__decorate([
    computed
], MapboxVectorTileCatalogItem.prototype, "labelRules", null);
__decorate([
    computed
], MapboxVectorTileCatalogItem.prototype, "imageryProvider", null);
__decorate([
    computed
], MapboxVectorTileCatalogItem.prototype, "mapItems", null);
export default MapboxVectorTileCatalogItem;
//# sourceMappingURL=MapboxVectorTileCatalogItem.js.map