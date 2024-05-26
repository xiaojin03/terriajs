import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import CameraView from "./CameraView";
import GlobeOrMap from "./GlobeOrMap";
class NoViewer extends GlobeOrMap {
    constructor(terriaViewer, _container) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: NoViewer.type
        });
        Object.defineProperty(this, "terria", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "canShowSplitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_currentView", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new CameraView(Rectangle.MAX_VALUE)
        });
        this.terria = terriaViewer.terria;
    }
    destroy() { }
    doZoomTo(v, t) {
        if (v instanceof CameraView) {
            this._currentView = v;
        }
        else if (v instanceof Rectangle) {
            this._currentView = new CameraView(v);
        }
        return Promise.resolve();
    }
    notifyRepaintRequired() { }
    pickFromLocation(latLngHeight, providerCoords, existingFeatures) { }
    getCurrentCameraView() {
        return this._currentView;
    }
    getContainer() {
        return undefined;
    }
    pauseMapInteraction() { }
    resumeMapInteraction() { }
    _addVectorTileHighlight(imageryProvider, rectangle) {
        return () => { };
    }
}
Object.defineProperty(NoViewer, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "none"
});
export default NoViewer;
//# sourceMappingURL=NoViewer.js.map