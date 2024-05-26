import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import EasingFunction from "terriajs-cesium/Source/Core/EasingFunction";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import L from "leaflet";
import isDefined from "../../Core/isDefined";
const TweenCollection = require("terriajs-cesium/Source/Scene/TweenCollection").default;
const selectionIndicatorUrl = require("../../../wwwroot/images/NM-LocationTarget.svg");
const cartographicScratch = new Cartographic();
export default class LeafletSelectionIndicator {
    constructor(leaflet) {
        Object.defineProperty(this, "_leaflet", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_marker", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tweens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new TweenCollection()
        });
        Object.defineProperty(this, "_selectionIndicatorTween", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_selectionIndicatorIsAppearing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_selectionIndicatorDomElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tweensAreRunning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this._leaflet = leaflet;
        this._marker = L.marker([0, 0], {
            icon: L.divIcon({
                className: "",
                html: '<img src="' +
                    selectionIndicatorUrl +
                    '" width="50" height="50" alt="" />',
                iconSize: L.point(50, 50)
            }),
            zIndexOffset: 1,
            interactive: false,
            keyboard: false
        });
        this._marker.addTo(this._leaflet.map);
        this._selectionIndicatorDomElement = this._marker._icon.children[0];
    }
    setLatLng(latlng) {
        this._marker.setLatLng(latlng);
    }
    animateSelectionIndicatorAppear() {
        if (isDefined(this._selectionIndicatorTween)) {
            if (this._selectionIndicatorIsAppearing) {
                // Already appearing; don't restart the animation.
                return;
            }
            this._selectionIndicatorTween.cancelTween();
            this._selectionIndicatorTween = undefined;
        }
        const style = this._selectionIndicatorDomElement.style;
        this._selectionIndicatorIsAppearing = true;
        const that = this;
        this._selectionIndicatorTween = this._tweens.add({
            startObject: {
                scale: 2.0,
                opacity: 0.0,
                rotate: -180
            },
            stopObject: {
                scale: 1.0,
                opacity: 1.0,
                rotate: 0
            },
            duration: 0.8,
            easingFunction: EasingFunction.EXPONENTIAL_OUT,
            update: function (value) {
                style.opacity = value.opacity;
                style.transform =
                    "scale(" + value.scale + ") rotate(" + value.rotate + "deg)";
            },
            complete: function () {
                that._selectionIndicatorTween = undefined;
            },
            cancel: function () {
                that._selectionIndicatorTween = undefined;
            }
        });
        this._startTweens();
    }
    animateSelectionIndicatorDepart() {
        if (isDefined(this._selectionIndicatorTween)) {
            if (!this._selectionIndicatorIsAppearing) {
                // Already disappearing, dont' restart the animation.
                return;
            }
            this._selectionIndicatorTween.cancelTween();
            this._selectionIndicatorTween = undefined;
        }
        const style = this._selectionIndicatorDomElement.style;
        this._selectionIndicatorIsAppearing = false;
        const that = this;
        this._selectionIndicatorTween = this._tweens.add({
            startObject: {
                scale: 1.0,
                opacity: 1.0
            },
            stopObject: {
                scale: 1.5,
                opacity: 0.0
            },
            duration: 0.8,
            easingFunction: EasingFunction.EXPONENTIAL_OUT,
            update: function (value) {
                style.opacity = value.opacity;
                style.transform = "scale(" + value.scale + ") rotate(0deg)";
            },
            complete: function () {
                that._selectionIndicatorTween = undefined;
            },
            cancel: function () {
                that._selectionIndicatorTween = undefined;
            }
        });
        this._startTweens();
    }
    _startTweens() {
        if (this._tweensAreRunning) {
            return;
        }
        const feature = this._leaflet.terria.selectedFeature;
        if (isDefined(feature) && isDefined(feature.position)) {
            const positionValue = feature.position.getValue(this._leaflet.terria.timelineClock.currentTime);
            if (isDefined(positionValue)) {
                const cartographic = Ellipsoid.WGS84.cartesianToCartographic(positionValue, cartographicScratch);
                this._marker.setLatLng([
                    CesiumMath.toDegrees(cartographic.latitude),
                    CesiumMath.toDegrees(cartographic.longitude)
                ]);
            }
        }
        if (this._tweens.length > 0) {
            this._tweens.update();
        }
        if (this._tweens.length !== 0 ||
            (isDefined(feature) && isDefined(feature.position))) {
            requestAnimationFrame(() => {
                this._startTweens();
            });
        }
    }
}
//# sourceMappingURL=LeafletSelectionIndicator.js.map