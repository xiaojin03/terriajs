var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import FeatureInfoUrlTemplateTraits from "./FeatureInfoTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import StyleTraits from "./StyleTraits";
import TableTraits from "./Table/TableTraits";
import UrlTraits from "./UrlTraits";
export class PerPropertyGeoJsonStyleTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "properties", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "style", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "caseSensitive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
}
__decorate([
    anyTrait({
        name: "Properties",
        description: "If the properties of a feature match these properties, then apply the style to that feature"
    })
], PerPropertyGeoJsonStyleTraits.prototype, "properties", void 0);
__decorate([
    objectTrait({
        name: "Style",
        type: StyleTraits,
        description: "Styling rules to apply, following [simplestyle-spec](https://github.com/mapbox/simplestyle-spec)"
    })
], PerPropertyGeoJsonStyleTraits.prototype, "style", void 0);
__decorate([
    primitiveTrait({
        name: "Case sensitive",
        type: "boolean",
        description: "True if properties should be matched in a case sensitive fashion"
    })
], PerPropertyGeoJsonStyleTraits.prototype, "caseSensitive", void 0);
export class GeoJsonTraits extends mixTraits(FeatureInfoUrlTemplateTraits, LegendOwnerTraits, TableTraits, UrlTraits) {
    constructor() {
        super(...arguments);
        /** Override TableTraits which aren't applicable to GeoJsonTraits */
        Object.defineProperty(this, "enableManualRegionMapping", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "useOutlineColorForLineFeatures", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "style", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clampToGround", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "forceCesiumPrimitives", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "filterByProperties", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "perPropertyStyles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "timeProperty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "heightProperty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "czmlTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "explodeMultiPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
}
__decorate([
    primitiveTrait({
        name: "Enable manual region mapping (Disabled for GeoJsonTraits)",
        description: "If enabled, there will be controls to set region column and region type.",
        type: "boolean"
    })
], GeoJsonTraits.prototype, "enableManualRegionMapping", void 0);
__decorate([
    primitiveTrait({
        name: "Use outline color for line features",
        description: "If enabled, TableOutlineStyleTraits will be used to color Line Features, otherwise TableColorStyleTraits will be used.",
        type: "boolean"
    })
], GeoJsonTraits.prototype, "useOutlineColorForLineFeatures", void 0);
__decorate([
    objectTrait({
        type: StyleTraits,
        name: "Style",
        description: "Styling rules that follow [simplestyle-spec](https://github.com/mapbox/simplestyle-spec). If defined, then `forceCesiumPrimitives` will be true. For styling MVT/protomaps - see `TableStyleTraits`"
    })
], GeoJsonTraits.prototype, "style", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Clamp to Ground",
        description: "Whether the features in this GeoJSON should be clamped to the terrain surface. If `forceCesiumPrimitives` is false, this will be `true`"
    })
], GeoJsonTraits.prototype, "clampToGround", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Force cesium primitives",
        description: "Force rendering GeoJSON features as Cesium primitives. This will be true if you are using `style`, `perPropertyStyles`, `timeProperty`, `heightProperty` or `czmlTemplate`. If undefined, geojson-vt/protomaps will be used. This will be set to true if simplestyle-spec properties are detected in over 50% of GeoJSON features, or if any MultiPoint features are found "
    })
], GeoJsonTraits.prototype, "forceCesiumPrimitives", void 0);
__decorate([
    anyTrait({
        name: "Feature filter (by properties)",
        description: "Filter GeoJSON features by properties. If the properties of a feature match `filterByProperties`, then show that feature. All other features are hidden"
    })
], GeoJsonTraits.prototype, "filterByProperties", void 0);
__decorate([
    objectArrayTrait({
        name: "Per property styles",
        type: PerPropertyGeoJsonStyleTraits,
        description: "Override feature styles according to their properties. This is only supported for cesium primitives (see `forceCesiumPrimitives`)",
        idProperty: "index"
    })
], GeoJsonTraits.prototype, "perPropertyStyles", void 0);
__decorate([
    primitiveTrait({
        name: "Time property",
        type: "string",
        description: "The property of each GeoJSON feature that specifies which point in time that feature is associated with. If not specified, it is assumed that the dataset is constant throughout time. This is only supported for cesium primitives (see `forceCesiumPrimitives`). If using geojson-vt styling, use TableTraits instead (see `TableStyleTraits` and `TableTimeStyleTraits`)"
    })
], GeoJsonTraits.prototype, "timeProperty", void 0);
__decorate([
    primitiveTrait({
        name: "Height property",
        type: "string",
        description: "The property of each GeoJSON feature that specifies the height. If defined, polygons will be extruded to this property (in meters) above terrain. This is only supported for cesium primitives (see `forceCesiumPrimitives`)"
    })
], GeoJsonTraits.prototype, "heightProperty", void 0);
__decorate([
    anyTrait({
        name: "CZML template",
        description: `CZML template to be used to replace each GeoJSON **Point** and **Polygon/MultiPolygon** feature. Feature coordinates and properties will automatically be applied to CZML packet, so they can be used as references.

    Polygon/MultiPolygon features only support the \`polygon\` CZML packet.

    Point features support all packets except ones which require a \`PositionsList\` (eg \`polygon\`, \`polyline\`, ...)

    If this is defined, \`clampToGround\`, \`style\`, \`perPropertyStyles\`, \`timeProperty\` and \`heightProperty\` will be ignored.

    For example - this will render a cylinder for every point (and use the length and radius feature properties)
      \`\`\`json
      {
        cylinder: {
          length: {
            reference: "#properties.length"
          },
          topRadius: {
            reference: "#properties.radius"
          },
          bottomRadius: {
            reference: "#properties.radius"
          },
          material: {
            solidColor: {
              color: {
                rgba: [0, 200, 0, 20]
              }
            }
          }
        }
      }
      \`\`\`

    For more info see Cesium's CZML docs https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Guide

    The following custom properties are supported:
    - \`heightOffset: number\` to offset height values (in m)`
    })
], GeoJsonTraits.prototype, "czmlTemplate", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Explode MultiPoints",
        description: "Replaces `MultiPoint` features with its equivalent `Point` features when `true`. This is useful for example when using Table mode which does not support `MultiPoint` features currently."
    })
], GeoJsonTraits.prototype, "explodeMultiPoints", void 0);
//# sourceMappingURL=GeoJsonTraits.js.map