import Point from "@mapbox/point-geometry";
import { VectorTile, VectorTileFeature } from "@mapbox/vector-tile";
import i18next from "i18next";
import Protobuf from "pbf";
import BoundingRectangle from "terriajs-cesium/Source/Core/BoundingRectangle";
import Cartesian2 from "terriajs-cesium/Source/Core/Cartesian2";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import Credit from "terriajs-cesium/Source/Core/Credit";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import CesiumEvent from "terriajs-cesium/Source/Core/Event";
import Intersect from "terriajs-cesium/Source/Core/Intersect";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import WebMercatorTilingScheme from "terriajs-cesium/Source/Core/WebMercatorTilingScheme";
import WindingOrder from "terriajs-cesium/Source/Core/WindingOrder";
import URITemplate from "urijs/src/URITemplate";
import isDefined from "../../Core/isDefined";
import loadArrayBuffer from "../../Core/loadArrayBuffer";
import computeRingWindingOrder from "../Vector/computeRingWindingOrder";
/** Note this has been deprecated in favour of ProtomapsImageryProvider */
export default class MapboxVectorTileImageryProvider {
    constructor(options) {
        Object.defineProperty(this, "_uriTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_layerName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_subdomains", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_styleFunc", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tilingScheme", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tileWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tileHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_minimumLevel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_maximumLevel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_maximumNativeLevel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_rectangle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_uniqueIdProp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_featureInfoFunc", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_errorEvent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new CesiumEvent()
        });
        Object.defineProperty(this, "_ready", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "_credit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._uriTemplate = new URITemplate(options.url);
        this._layerName = options.layerName;
        this._subdomains = defaultValue(options.subdomains, []);
        this._styleFunc = options.styleFunc;
        this._tilingScheme = new WebMercatorTilingScheme();
        this._tileWidth = 256;
        this._tileHeight = 256;
        this._minimumLevel = defaultValue(options.minimumZoom, 0);
        this._maximumLevel = defaultValue(options.maximumZoom, Infinity);
        this._maximumNativeLevel = defaultValue(options.maximumNativeZoom, this._maximumLevel);
        this._rectangle = isDefined(options.rectangle)
            ? Rectangle.intersection(options.rectangle, this._tilingScheme.rectangle) || this._tilingScheme.rectangle
            : this._tilingScheme.rectangle;
        this._uniqueIdProp = options.uniqueIdProp;
        this._featureInfoFunc = options.featureInfoFunc;
        //this._featurePicking = options.featurePicking;
        // Check the number of tiles at the minimum level.  If it's more than four,
        // throw an exception, because starting at the higher minimum
        // level will cause too many tiles to be downloaded and rendered.
        const swTile = this._tilingScheme.positionToTileXY(Rectangle.southwest(this._rectangle), this._minimumLevel);
        const neTile = this._tilingScheme.positionToTileXY(Rectangle.northeast(this._rectangle), this._minimumLevel);
        const tileCount = (Math.abs(neTile.x - swTile.x) + 1) * (Math.abs(neTile.y - swTile.y) + 1);
        if (tileCount > 4) {
            throw new DeveloperError(i18next.t("map.mapboxVectorTileImageryProvider.moreThanFourTiles", {
                tileCount: tileCount
            }));
        }
        this._errorEvent = new CesiumEvent();
        this._ready = true;
        this._credit = options.credit;
    }
    get url() {
        return this._uriTemplate.expression;
    }
    get tileWidth() {
        return this._tileWidth;
    }
    get tileHeight() {
        return this._tileHeight;
    }
    get maximumLevel() {
        return this._maximumLevel;
    }
    get minimumLevel() {
        return this._minimumLevel;
    }
    get tilingScheme() {
        return this._tilingScheme;
    }
    get rectangle() {
        return this._rectangle;
    }
    get errorEvent() {
        return this._errorEvent;
    }
    get ready() {
        return this._ready;
    }
    get defaultNightAlpha() {
        return undefined;
    }
    get defaultDayAlpha() {
        return undefined;
    }
    get hasAlphaChannel() {
        return true;
    }
    get credit() {
        let credit = this._credit;
        if (credit === undefined) {
            return undefined;
        }
        else if (typeof credit === "string") {
            credit = new Credit(credit);
        }
        return credit;
    }
    get defaultAlpha() {
        return undefined;
    }
    get defaultBrightness() {
        return undefined;
    }
    get defaultContrast() {
        return undefined;
    }
    get defaultGamma() {
        return undefined;
    }
    get defaultHue() {
        return undefined;
    }
    get defaultSaturation() {
        return undefined;
    }
    get defaultMagnificationFilter() {
        return undefined;
    }
    get defaultMinificationFilter() {
        return undefined;
    }
    get proxy() {
        return undefined;
    }
    get readyPromise() {
        return Promise.resolve(true);
    }
    get tileDiscardPolicy() {
        return undefined;
    }
    getTileCredits(_x, _y, _level) {
        return [];
    }
    _getSubdomain(x, y, level) {
        if (this._subdomains.length === 0) {
            return undefined;
        }
        else {
            const index = (x + y + level) % this._subdomains.length;
            return this._subdomains[index];
        }
    }
    _buildImageUrl(x, y, level) {
        return this._uriTemplate.expand({
            z: level.toString(),
            x: x.toString(),
            y: y.toString(),
            s: this._getSubdomain(x, y, level)
        });
    }
    requestImage(x, y, level) {
        const canvas = document.createElement("canvas");
        canvas.width = this._tileWidth;
        canvas.height = this._tileHeight;
        return this.requestImageForCanvas(x, y, level, canvas);
    }
    requestImageForCanvas(x, y, level, canvas) {
        const requestedTile = {
            x: x,
            y: y,
            level: level
        };
        let nativeTile; // The level, x & y of the tile used to draw the requestedTile
        // Check whether to use a native tile or overzoom the largest native tile
        if (level > this._maximumNativeLevel) {
            // Determine which native tile to use
            const levelDelta = level - this._maximumNativeLevel;
            nativeTile = {
                x: x >> levelDelta,
                y: y >> levelDelta,
                level: this._maximumNativeLevel
            };
        }
        else {
            nativeTile = requestedTile;
        }
        const url = this._buildImageUrl(nativeTile.x, nativeTile.y, nativeTile.level);
        return loadArrayBuffer(url.toString()).then((data) => {
            return this._drawTile(requestedTile, nativeTile, new VectorTile(new Protobuf(data)), canvas);
        });
    }
    _drawTile(requestedTile, nativeTile, tile, canvas) {
        const layer = tile.layers[this._layerName];
        if (!isDefined(layer)) {
            return canvas; // return blank canvas for blank tile
        }
        const context = canvas.getContext("2d");
        if (context === null) {
            return canvas;
        }
        context.strokeStyle = "black";
        context.lineWidth = 1;
        let pos;
        let extentFactor = canvas.width / layer.extent; // Vector tile works with extent [0, 4095], but canvas is only [0,255]
        // Features
        for (let i = 0; i < layer.length; i++) {
            const feature = layer.feature(i);
            if (VectorTileFeature.types[feature.type] === "Polygon") {
                const style = this._styleFunc(feature);
                if (!style)
                    continue;
                context.fillStyle = style.fillStyle;
                context.strokeStyle = style.strokeStyle;
                context.lineWidth = style.lineWidth;
                context.lineJoin = style.lineJoin;
                context.beginPath();
                let coordinates;
                if (nativeTile.level !== requestedTile.level) {
                    // Overzoom feature
                    const bbox = feature.bbox(); // [w, s, e, n] bounding box
                    const featureRect = new BoundingRectangle(bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);
                    const levelDelta = requestedTile.level - nativeTile.level;
                    const size = layer.extent >> levelDelta;
                    if (size < 16) {
                        // Tile has less less detail than 16x16
                        throw new DeveloperError(i18next.t("map.mapboxVectorTileImageryProvider.maxLevelError"));
                    }
                    const x1 = size * (requestedTile.x - (nativeTile.x << levelDelta)); //
                    const y1 = size * (requestedTile.y - (nativeTile.y << levelDelta));
                    const tileRect = new BoundingRectangle(x1, y1, size, size);
                    if (BoundingRectangle.intersect(featureRect, tileRect) ===
                        Intersect.OUTSIDE) {
                        continue;
                    }
                    extentFactor = canvas.width / size;
                    coordinates = overzoomGeometry(feature.loadGeometry(), nativeTile, size, requestedTile);
                }
                else {
                    coordinates = feature.loadGeometry();
                }
                // Polygon rings
                for (let i2 = 0; i2 < coordinates.length; i2++) {
                    pos = coordinates[i2][0];
                    context.moveTo(pos.x * extentFactor, pos.y * extentFactor);
                    // Polygon ring points
                    for (let j = 1; j < coordinates[i2].length; j++) {
                        pos = coordinates[i2][j];
                        context.lineTo(pos.x * extentFactor, pos.y * extentFactor);
                    }
                }
                context.stroke();
                context.fill();
            }
            else {
                console.log("Unexpected geometry type: " +
                    feature.type +
                    " in region map on tile " +
                    [requestedTile.level, requestedTile.x, requestedTile.y].join("/"));
            }
        }
        return canvas;
    }
    pickFeatures(x, y, level, longitude, latitude) {
        let nativeTile;
        let levelDelta;
        const requestedTile = {
            x: x,
            y: y,
            level: level
        };
        // Check whether to use a native tile or overzoom the largest native tile
        if (level > this._maximumNativeLevel) {
            // Determine which native tile to use
            levelDelta = level - this._maximumNativeLevel;
            nativeTile = {
                x: x >> levelDelta,
                y: y >> levelDelta,
                level: this._maximumNativeLevel
            };
        }
        else {
            nativeTile = {
                x: x,
                y: y,
                level: level
            };
        }
        const that = this;
        const url = this._buildImageUrl(nativeTile.x, nativeTile.y, nativeTile.level);
        return loadArrayBuffer(url.toString()).then((data) => {
            const layer = new VectorTile(new Protobuf(data)).layers[that._layerName];
            if (!isDefined(layer)) {
                return []; // return empty list of features for empty tile
            }
            const vt_range = [0, (layer.extent >> levelDelta) - 1];
            const boundRect = that._tilingScheme.tileXYToNativeRectangle(x, y, level);
            const x_range = [boundRect.west, boundRect.east];
            const y_range = [boundRect.north, boundRect.south];
            const map = function (pos, in_x_range, in_y_range, out_x_range, out_y_range) {
                const offset = new Cartesian2();
                Cartesian2.subtract(pos, new Cartesian2(in_x_range[0], in_y_range[0]), offset); // Offset of point from bottom left corner of bounding box
                const scale = new Cartesian2((out_x_range[1] - out_x_range[0]) / (in_x_range[1] - in_x_range[0]), (out_y_range[1] - out_y_range[0]) / (in_y_range[1] - in_y_range[0]));
                return Cartesian2.add(Cartesian2.multiplyComponents(offset, scale, new Cartesian2()), new Cartesian2(out_x_range[0], out_y_range[0]), new Cartesian2());
            };
            let pos = Cartesian2.fromCartesian3(that._tilingScheme.projection.project(new Cartographic(longitude, latitude)));
            pos = map(pos, x_range, y_range, vt_range, vt_range);
            const point = new Point(pos.x, pos.y);
            const features = [];
            for (let i = 0; i < layer.length; i++) {
                const feature = layer.feature(i);
                if (VectorTileFeature.types[feature.type] === "Polygon" &&
                    isFeatureClicked(overzoomGeometry(feature.loadGeometry(), nativeTile, layer.extent >> levelDelta, requestedTile), point)) {
                    if (isDefined(this._featureInfoFunc)) {
                        const featureInfo = this._featureInfoFunc(feature);
                        if (isDefined(featureInfo)) {
                            features.push(featureInfo);
                        }
                    }
                }
            }
            return features;
        });
    }
    createHighlightImageryProvider(regionUniqueID) {
        const that = this;
        const styleFunc = function (feature) {
            if (regionUniqueID === feature.properties[that._uniqueIdProp]) {
                // No fill, but same style border as the regions, just thicker
                const regionStyling = that._styleFunc(feature);
                if (isDefined(regionStyling)) {
                    regionStyling.fillStyle = "rgba(0,0,0,0)";
                    regionStyling.lineJoin = "round";
                    regionStyling.lineWidth = Math.floor(1.5 * defaultValue(regionStyling.lineWidth, 1) + 1);
                    return regionStyling;
                }
            }
            return undefined;
        };
        const imageryProvider = new MapboxVectorTileImageryProvider({
            url: this._uriTemplate.expression,
            layerName: this._layerName,
            subdomains: this._subdomains,
            rectangle: this._rectangle,
            minimumZoom: this._minimumLevel,
            maximumNativeZoom: this._maximumNativeLevel,
            maximumZoom: this._maximumLevel,
            uniqueIdProp: this._uniqueIdProp,
            styleFunc: styleFunc,
            credit: ""
        });
        imageryProvider.pickFeatures = function () {
            return Promise.resolve([]);
        }; // Turn off feature picking
        return imageryProvider;
    }
}
// Use x,y,level vector tile to produce imagery for newX,newY,newLevel
function overzoomGeometry(rings, nativeTile, newExtent, newTile) {
    const diffZ = newTile.level - nativeTile.level;
    if (diffZ === 0) {
        return rings;
    }
    else {
        const newRings = [];
        // (offsetX, offsetY) is the (0,0) of the new tile
        const offsetX = newExtent * (newTile.x - (nativeTile.x << diffZ));
        const offsetY = newExtent * (newTile.y - (nativeTile.y << diffZ));
        for (let i = 0; i < rings.length; i++) {
            const ring = [];
            for (let i2 = 0; i2 < rings[i].length; i2++) {
                ring.push(rings[i][i2].sub(new Point(offsetX, offsetY)));
            }
            newRings.push(ring);
        }
        return newRings;
    }
}
function isExteriorRing(ring) {
    // Normally an exterior ring would be clockwise but because these coordinates are in "canvas space" the ys are inverted
    // hence check for counter-clockwise ring
    const windingOrder = computeRingWindingOrder(ring);
    return windingOrder === WindingOrder.COUNTER_CLOCKWISE;
}
// Adapted from npm package "point-in-polygon" by James Halliday
// Licence included in LICENSE.md
function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    const x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i].x, yi = vs[i].y;
        const xj = vs[j].x, yj = vs[j].y;
        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect)
            inside = !inside;
    }
    return inside;
}
// According to the Mapbox Vector Tile specifications, a polygon consists of one exterior ring followed by 0 or more interior rings. Therefore:
// for each ring:
//   if point in ring:
//     for each interior ring (following the exterior ring):
//       check point in interior ring
//     if point not in any interior rings, feature is clicked
function isFeatureClicked(rings, point) {
    for (let i = 0; i < rings.length; i++) {
        if (inside(point, rings[i])) {
            // Point is in an exterior ring
            // Check whether point is in any interior rings
            let inInteriorRing = false;
            while (i + 1 < rings.length && !isExteriorRing(rings[i + 1])) {
                i++;
                if (!inInteriorRing && inside(point, rings[i])) {
                    inInteriorRing = true;
                    // Don't break. Still need to iterate over the rest of the interior rings but don't do point-in-polygon tests on those
                }
            }
            // Point is in exterior ring, but not in any interior ring. Therefore point is in the feature region
            if (!inInteriorRing) {
                return true;
            }
        }
    }
    return false;
}
//# sourceMappingURL=MapboxVectorTileImageryProvider.js.map