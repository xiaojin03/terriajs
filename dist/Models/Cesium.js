var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { isEqual } from "lodash-es";
import { action, autorun, computed, makeObservable, observable, reaction, runInAction, toJS } from "mobx";
import { computedFn, fromPromise } from "mobx-utils";
import BoundingSphere from "terriajs-cesium/Source/Core/BoundingSphere";
import Cartesian2 from "terriajs-cesium/Source/Core/Cartesian2";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import CesiumTerrainProvider from "terriajs-cesium/Source/Core/CesiumTerrainProvider";
import createWorldTerrainAsync from "terriajs-cesium/Source/Core/createWorldTerrainAsync";
import Credit from "terriajs-cesium/Source/Core/Credit";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import defined from "terriajs-cesium/Source/Core/defined";
import destroyObject from "terriajs-cesium/Source/Core/destroyObject";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import EllipsoidTerrainProvider from "terriajs-cesium/Source/Core/EllipsoidTerrainProvider";
import EventHelper from "terriajs-cesium/Source/Core/EventHelper";
import FeatureDetection from "terriajs-cesium/Source/Core/FeatureDetection";
import HeadingPitchRange from "terriajs-cesium/Source/Core/HeadingPitchRange";
import Ion from "terriajs-cesium/Source/Core/Ion";
import IonResource from "terriajs-cesium/Source/Core/IonResource";
import KeyboardEventModifier from "terriajs-cesium/Source/Core/KeyboardEventModifier";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import Matrix4 from "terriajs-cesium/Source/Core/Matrix4";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import sampleTerrain from "terriajs-cesium/Source/Core/sampleTerrain";
import ScreenSpaceEventType from "terriajs-cesium/Source/Core/ScreenSpaceEventType";
import Transforms from "terriajs-cesium/Source/Core/Transforms";
import BoundingSphereState from "terriajs-cesium/Source/DataSources/BoundingSphereState";
import DataSourceCollection from "terriajs-cesium/Source/DataSources/DataSourceCollection";
import DataSourceDisplay from "terriajs-cesium/Source/DataSources/DataSourceDisplay";
import Entity from "terriajs-cesium/Source/DataSources/Entity";
import Camera from "terriajs-cesium/Source/Scene/Camera";
import ImageryLayer from "terriajs-cesium/Source/Scene/ImageryLayer";
import SceneTransforms from "terriajs-cesium/Source/Scene/SceneTransforms";
import SingleTileImageryProvider from "terriajs-cesium/Source/Scene/SingleTileImageryProvider";
import SplitDirection from "terriajs-cesium/Source/Scene/SplitDirection";
import CesiumWidget from "terriajs-cesium/Source/Widget/CesiumWidget";
import getElement from "terriajs-cesium/Source/DataSources/getElement";
import filterOutUndefined from "../Core/filterOutUndefined";
import flatten from "../Core/flatten";
import isDefined from "../Core/isDefined";
import pollToPromise from "../Core/pollToPromise";
import TerriaError from "../Core/TerriaError";
import waitForDataSourceToLoad from "../Core/waitForDataSourceToLoad";
import CesiumRenderLoopPauser from "../Map/Cesium/CesiumRenderLoopPauser";
import CesiumSelectionIndicator from "../Map/Cesium/CesiumSelectionIndicator";
import PickedFeatures from "../Map/PickedFeatures/PickedFeatures";
import FeatureInfoUrlTemplateMixin from "../ModelMixins/FeatureInfoUrlTemplateMixin";
import MappableMixin, { ImageryParts, isCesium3DTileset, isDataSource, isPrimitive, isTerrainProvider } from "../ModelMixins/MappableMixin";
import TileErrorHandlerMixin from "../ModelMixins/TileErrorHandlerMixin";
import SplitterTraits from "../Traits/TraitsClasses/SplitterTraits";
import CameraView from "./CameraView";
import hasTraits from "./Definition/hasTraits";
import TerriaFeature from "./Feature/Feature";
import GlobeOrMap from "./GlobeOrMap";
import UserDrawing from "./UserDrawing";
import { setViewerMode } from "./ViewerMode";
// Intermediary
const cartesian3Scratch = new Cartesian3();
const enuToFixedScratch = new Matrix4();
const southwestScratch = new Cartesian3();
const southeastScratch = new Cartesian3();
const northeastScratch = new Cartesian3();
const northwestScratch = new Cartesian3();
const southwestCartographicScratch = new Cartographic();
const southeastCartographicScratch = new Cartographic();
const northeastCartographicScratch = new Cartographic();
const northwestCartographicScratch = new Cartographic();
export default class Cesium extends GlobeOrMap {
    constructor(terriaViewer, container) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Cesium"
        });
        Object.defineProperty(this, "terria", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "terriaViewer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cesiumWidget", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dataSources", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new DataSourceCollection()
        });
        Object.defineProperty(this, "dataSourceDisplay", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pauser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "canShowSplitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "_eventHelper", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_3dTilesetEventListeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        }); // eventListener reference storage
        Object.defineProperty(this, "_pauseMapInteractionCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_lastZoomTarget", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Lightbox and on screen attributions from CreditDisplay
        Object.defineProperty(this, "cesiumDataAttributions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: observable([])
        });
        // Public because this is accessed from BottomLeftBar.tsx
        Object.defineProperty(this, "cesiumScreenDataAttributions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: observable([])
        });
        // When true, feature picking is paused. This is useful for temporarily
        // disabling feature picking when some other interaction mode wants to take
        // over the LEFT_CLICK behavior.
        Object.defineProperty(this, "isFeaturePickingPaused", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /* Disposers */
        Object.defineProperty(this, "_selectionIndicator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_disposeSelectedFeatureSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_disposeWorkbenchMapItemsSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_disposeTerrainReaction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_disposeSplitterReaction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_disposeResolutionReaction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_createImageryLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: computedFn((ip, clippingRectangle) => {
                return new ImageryLayer(ip, {
                    rectangle: clippingRectangle
                });
            })
        });
        Object.defineProperty(this, "_terrainMessageViewed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "previousRenderError", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        makeObservable(this);
        this.terriaViewer = terriaViewer;
        this.terria = terriaViewer.terria;
        if (this.terria.configParameters.cesiumIonAccessToken !== undefined) {
            Ion.defaultAccessToken =
                this.terria.configParameters.cesiumIonAccessToken;
        }
        //An arbitrary base64 encoded image used to populate the placeholder SingleTileImageryProvider
        const img = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA \
    AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO \
    9TXL0Y4OHwAAAABJRU5ErkJggg==";
        const options = {
            dataSources: this.dataSources,
            clock: this.terria.timelineClock,
            baseLayer: ImageryLayer.fromProviderAsync(SingleTileImageryProvider.fromUrl(img), {}),
            scene3DOnly: true,
            shadows: true,
            useBrowserRecommendedResolution: !this.terria.useNativeResolution
        };
        // Workaround for Firefox bug with WebGL and printing:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=976173
        const firefoxBugOptions = FeatureDetection.isFirefox()
            ? {
                contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                }
            }
            : undefined;
        try {
            this.cesiumWidget = new CesiumWidget(container, Object.assign({}, options, firefoxBugOptions));
            this.scene = this.cesiumWidget.scene;
        }
        catch (error) {
            throw TerriaError.from(error, {
                message: {
                    key: "terriaViewer.slowWebGLAvailableMessageII",
                    parameters: { appName: this.terria.appName, webGL: "WebGL" }
                }
            });
        }
        //new Cesium3DTilesInspector(document.getElementsByClassName("cesium-widget").item(0), this.scene);
        this.dataSourceDisplay = new DataSourceDisplay({
            scene: this.scene,
            dataSourceCollection: this.dataSources
        });
        this._selectionIndicator = new CesiumSelectionIndicator(this);
        this.supportsPolylinesOnTerrain = this.scene.context.depthTexture;
        this._eventHelper = new EventHelper();
        this._eventHelper.add(this.terria.timelineClock.onTick, ((clock) => {
            this.dataSourceDisplay.update(clock.currentTime);
        }));
        // Progress
        this._eventHelper.add(this.scene.globe.tileLoadProgressEvent, (currentLoadQueueLength) => this._updateTilesLoadingCount(currentLoadQueueLength));
        // Disable HDR lighting for better performance and to avoid changing imagery colors.
        this.scene.highDynamicRange = false;
        this.scene.imageryLayers.removeAll();
        this.updateCredits(container);
        this.scene.globe.depthTestAgainstTerrain = false;
        this.scene.renderError.addEventListener(this.onRenderError.bind(this));
        const inputHandler = this.cesiumWidget.screenSpaceEventHandler;
        // // Add double click zoom
        // inputHandler.setInputAction(
        //     function (movement) {
        //         zoomIn(scene, movement.position);
        //     },
        //     ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        // inputHandler.setInputAction(
        //     function (movement) {
        //         zoomOut(scene, movement.position);
        //     },
        //     ScreenSpaceEventType.LEFT_DOUBLE_CLICK, KeyboardEventModifier.SHIFT);
        // Handle mouse move
        inputHandler.setInputAction((e) => {
            this.mouseCoords.updateCoordinatesFromCesium(this.terria, e.endPosition);
        }, ScreenSpaceEventType.MOUSE_MOVE);
        inputHandler.setInputAction((e) => {
            this.mouseCoords.updateCoordinatesFromCesium(this.terria, e.endPosition);
        }, ScreenSpaceEventType.MOUSE_MOVE, KeyboardEventModifier.SHIFT);
        // Handle left click by picking objects from the map.
        inputHandler.setInputAction((e) => {
            if (!this.isFeaturePickingPaused)
                this.pickFromScreenPosition(e.position, false);
        }, ScreenSpaceEventType.LEFT_CLICK);
        let zoomUserDrawing;
        // Handle zooming on SHIFT + MOUSE DOWN
        inputHandler.setInputAction((e) => {
            if (!this.isFeaturePickingPaused && !isDefined(zoomUserDrawing)) {
                this.pauseMapInteraction();
                const exitZoom = () => {
                    document.removeEventListener("keyup", onKeyUp);
                    runInAction(() => {
                        this.terria.mapInteractionModeStack.pop();
                        zoomUserDrawing && zoomUserDrawing.cleanUp();
                    });
                    this.resumeMapInteraction();
                    zoomUserDrawing = undefined;
                };
                // If the shift key is released -> exit zoom
                const onKeyUp = (e) => e.key === "Shift" && zoomUserDrawing && exitZoom();
                document.addEventListener("keyup", onKeyUp);
                let pointClickCount = 0;
                zoomUserDrawing = new UserDrawing({
                    terria: this.terria,
                    messageHeader: i18next.t("map.drawExtentHelper.drawExtent"),
                    onPointClicked: () => {
                        var _a, _b, _c;
                        pointClickCount++;
                        if (zoomUserDrawing &&
                            zoomUserDrawing.pointEntities.entities.values.length >= 2) {
                            const rectangle = (_c = (_b = (_a = zoomUserDrawing.otherEntities.entities
                                .getById("rectangle")) === null || _a === void 0 ? void 0 : _a.rectangle) === null || _b === void 0 ? void 0 : _b.coordinates) === null || _c === void 0 ? void 0 : _c.getValue(this.terria.timelineClock.currentTime);
                            if (rectangle)
                                this.zoomTo(rectangle, 1);
                            exitZoom();
                            // If more than two points are clicked but a rectangle hasn't been drawn -> exit zoom
                        }
                        else if (pointClickCount >= 2) {
                            exitZoom();
                        }
                    },
                    allowPolygon: false,
                    drawRectangle: true,
                    invisible: true
                });
                zoomUserDrawing.enterDrawMode();
                // Pick first point of rectangle on start
                this.pickFromScreenPosition(e.position, false);
            }
        }, ScreenSpaceEventType.LEFT_DOWN, KeyboardEventModifier.SHIFT);
        // Handle SHIFT + CLICK for zooming
        inputHandler.setInputAction((e) => {
            if (isDefined(zoomUserDrawing)) {
                this.pickFromScreenPosition(e.position, false);
            }
        }, ScreenSpaceEventType.LEFT_UP, KeyboardEventModifier.SHIFT);
        this.pauser = new CesiumRenderLoopPauser(this.cesiumWidget, () => {
            // Post render, update selection indicator position
            const feature = this.terria.selectedFeature;
            // If the feature has an associated primitive and that primitive has
            // a clamped position, use that instead, because the regular
            // position doesn't take terrain clamping into account.
            if (isDefined(feature)) {
                if (isDefined(feature.cesiumPrimitive) &&
                    isDefined(feature.cesiumPrimitive._clampedPosition)) {
                    this._selectionIndicator.position =
                        feature.cesiumPrimitive._clampedPosition;
                }
                else if (isDefined(feature.cesiumPrimitive) &&
                    isDefined(feature.cesiumPrimitive._clampedModelMatrix)) {
                    this._selectionIndicator.position = Matrix4.getTranslation(feature.cesiumPrimitive._clampedModelMatrix, this._selectionIndicator.position || new Cartesian3());
                }
                else if (isDefined(feature.position)) {
                    this._selectionIndicator.position = feature.position.getValue(this.terria.timelineClock.currentTime);
                }
            }
            this._selectionIndicator.update();
        });
        this._disposeSelectedFeatureSubscription = autorun(() => {
            this._selectFeature();
        });
        this._disposeWorkbenchMapItemsSubscription = this.observeModelLayer();
        this._disposeTerrainReaction = autorun(() => {
            this.scene.globe.terrainProvider = this.terrainProvider;
            // TODO: bring over globe and atmosphere splitting support from terriajs-cesium
            // this.scene.globe.splitDirection = this.terria.showSplitter
            //   ? this.terria.terrainSplitDirection
            //   : SplitDirection.NONE;
            this.scene.globe.depthTestAgainstTerrain =
                this.terria.depthTestAgainstTerrainEnabled;
            // if (this.scene.skyAtmosphere) {
            //   this.scene.skyAtmosphere.splitDirection =
            //     this.scene.globe.splitDirection;
            // }
        });
        this._disposeSplitterReaction = this._reactToSplitterChanges();
        this._disposeResolutionReaction = autorun(() => {
            this.cesiumWidget.useBrowserRecommendedResolution =
                !this.terria.useNativeResolution;
            this.cesiumWidget.scene.globe.maximumScreenSpaceError =
                this.terria.baseMaximumScreenSpaceError;
        });
    }
    /** Add an event listener to a TerrainProvider.
     * If we get an error when trying to load the terrain, then switch to smooth mode, and notify the user.
     * Finally, remove the listener, so failed tiles do not trigger the error as these can be common and are not a problem. */
    async catchTerrainProviderDown(terrainProviderPromise) {
        return terrainProviderPromise
            .then((terrainProvider) => {
            /** Need to throw an error if incorrect `cesiumTerrainUrl` has been specified.
            The terrainProvider.readyPromise will still be fulfulled, but the map will not load correctly
            So we check for terrainProvider.availability */
            if (!terrainProvider.availability) {
                throw new Error();
            }
            return terrainProvider;
        })
            .catch((err) => {
            console.log("Terrain provider error.  ", err.message);
            console.log("Switching to EllipsoidTerrainProvider.");
            setViewerMode("3dsmooth", this.terriaViewer);
            if (!this._terrainMessageViewed) {
                this.terria.raiseErrorToUser(err, {
                    title: i18next.t("map.cesium.terrainServerErrorTitle"),
                    message: i18next.t("map.cesium.terrainServerErrorMessage", {
                        appName: this.terria.appName,
                        supportEmail: this.terria.supportEmail
                    })
                });
                this._terrainMessageViewed = true;
            }
            return new EllipsoidTerrainProvider();
        });
    }
    updateCredits(container) {
        const containerElement = getElement(container);
        const creditsElement = containerElement &&
            containerElement.getElementsByClassName("cesium-widget-credits")[0];
        const logoContainer = creditsElement &&
            creditsElement.getElementsByClassName("cesium-credit-logoContainer")[0];
        const expandLink = creditsElement &&
            creditsElement.getElementsByClassName("cesium-credit-expand-link") &&
            creditsElement.getElementsByClassName("cesium-credit-expand-link")[0];
        if (creditsElement) {
            if (logoContainer)
                creditsElement === null || creditsElement === void 0 ? void 0 : creditsElement.removeChild(logoContainer);
            if (expandLink)
                creditsElement === null || creditsElement === void 0 ? void 0 : creditsElement.removeChild(expandLink);
        }
        const creditDisplay = this.scene.frameState.creditDisplay;
        const creditDisplayOldDestroy = creditDisplay.destroy;
        creditDisplay.destroy = () => {
            try {
                creditDisplayOldDestroy();
            }
            catch (err) {
                /* TODO: handle Error */
            }
        };
        const creditDisplayOldEndFrame = creditDisplay.endFrame;
        creditDisplay.endFrame = () => {
            creditDisplayOldEndFrame.bind(creditDisplay)();
            runInAction(() => {
                syncCesiumCreditsToAttributions(creditDisplay._currentFrameCredits.lightboxCredits
                    .values, this.cesiumDataAttributions);
                syncCesiumCreditsToAttributions(creditDisplay._currentFrameCredits.screenCredits
                    .values, this.cesiumScreenDataAttributions);
            });
        };
    }
    getContainer() {
        return this.cesiumWidget.container;
    }
    pauseMapInteraction() {
        ++this._pauseMapInteractionCount;
        if (this._pauseMapInteractionCount === 1) {
            this.scene.screenSpaceCameraController.enableInputs = false;
        }
    }
    resumeMapInteraction() {
        --this._pauseMapInteractionCount;
        if (this._pauseMapInteractionCount === 0) {
            setTimeout(() => {
                if (this._pauseMapInteractionCount === 0) {
                    this.scene.screenSpaceCameraController.enableInputs = true;
                }
            }, 0);
        }
    }
    /** Show error message to user if Cesium stops rendering. */
    onRenderError(scene, error) {
        // This function can be called many times with the same error
        // So we do a rudimentary check to only show the error message once
        // - by comparing error.toString() to this.previousRenderError
        if (typeof error === "object" && error !== null) {
            const newError = error.toString();
            if (newError !== this.previousRenderError) {
                this.previousRenderError = error.toString();
                this.terria.raiseErrorToUser(error, {
                    title: i18next.t("map.cesium.stoppedRenderingTitle"),
                    message: i18next.t("map.cesium.stoppedRenderingMessage", {
                        appName: this.terria.appName
                    })
                });
            }
        }
    }
    destroy() {
        // Port old Cesium.prototype.destroy stuff
        // this._enableSelectExtent(cesiumWidget.scene, false);
        this.scene.renderError.removeEventListener(this.onRenderError);
        const inputHandler = this.cesiumWidget.screenSpaceEventHandler;
        inputHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        inputHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE, KeyboardEventModifier.SHIFT);
        // inputHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        // inputHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK, KeyboardEventModifier.SHIFT);
        inputHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        inputHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN, KeyboardEventModifier.SHIFT);
        inputHandler.removeInputAction(ScreenSpaceEventType.LEFT_UP, KeyboardEventModifier.SHIFT);
        // if (defined(this.monitor)) {
        //     this.monitor.destroy();
        //     this.monitor = undefined;
        // }
        if (isDefined(this._selectionIndicator)) {
            this._selectionIndicator.destroy();
        }
        this.pauser.destroy();
        this.stopObserving();
        this._eventHelper.removeAll();
        this._updateTilesLoadingIndeterminate(false); // reset progress bar loading state to false for any data sources with indeterminate progress e.g. 3DTilesets.
        this.dataSourceDisplay.destroy();
        this._disposeTerrainReaction();
        this._disposeResolutionReaction();
        this._disposeSelectedFeatureSubscription();
        this._disposeSplitterReaction();
        this.cesiumWidget.destroy();
        destroyObject(this);
    }
    get attributions() {
        return this.cesiumDataAttributions;
    }
    get _allMappables() {
        const catalogItems = [
            ...this.terriaViewer.items.get(),
            this.terriaViewer.baseMap
        ];
        return flatten(filterOutUndefined(catalogItems.map((item) => {
            if (isDefined(item) && MappableMixin.isMixedInto(item))
                return item.mapItems.map((mapItem) => ({ mapItem, item }));
        })));
    }
    get _allMapItems() {
        return this._allMappables.map(({ mapItem }) => mapItem);
    }
    get availableDataSources() {
        return this._allMapItems.filter(isDataSource);
    }
    /**
     * Syncs the `dataSources` collection against the latest `availableDataSources`.
     *
     * @return Promise for finishing the sync
     */
    async syncDataSourceCollection(availableDataSources, dataSources) {
        // 1. Remove deleted data sources
        // Iterate backwards because we're removing items.
        for (let i = dataSources.length - 1; i >= 0; i--) {
            const d = dataSources.get(i);
            if (availableDataSources.indexOf(d) === -1) {
                dataSources.remove(d);
            }
        }
        // 2. Add new data sources
        for (const ds of availableDataSources) {
            if (!dataSources.contains(ds)) {
                await dataSources.add(ds);
            }
        }
        // 3. Ensure stacking order matches order in `availableDataSources` - first item appears on top.
        runInAction(() => availableDataSources.forEach((ds) => {
            // There is a buggy/un-intended side-effect when calling raiseToTop() with
            // a source that doesn't exist in the collection. Doing this will replace
            // the last entry in the collection with the new one. So we should be
            // careful to raiseToTop() only if the DS already exists in the collection.
            // Relevant code:
            //   https://github.com/CesiumGS/cesium/blob/dbd452328a48bfc4e192146862a9f8fa15789dc8/packages/engine/Source/DataSources/DataSourceCollection.js#L298-L299
            dataSources.contains(ds) && dataSources.raiseToTop(ds);
        }));
    }
    observeModelLayer() {
        // Setup reaction to sync datSources collection with availableDataSources
        //
        // To avoid buggy concurrent syncs, we have to ensure that even when
        // multiple sync reactions are triggered, we run them one after the
        // other. To do this, we make each run of the reaction wait for the
        // previous `syncDataSourcesPromise` to finish before starting itself.
        let syncDataSourcesPromise = Promise.resolve();
        const reactionDisposer = reaction(() => this.availableDataSources, () => {
            syncDataSourcesPromise = syncDataSourcesPromise
                .then(async () => {
                await this.syncDataSourceCollection(this.availableDataSources, this.dataSources);
                this.notifyRepaintRequired();
            })
                .catch(console.error);
        }, { fireImmediately: true });
        let prevMapItems = [];
        const autorunDisposer = autorun(() => {
            // TODO: Look up the type in a map and call the associated function.
            //       That way the supported types of map items is extensible.
            const allImageryParts = this._allMappables
                .map((m) => ImageryParts.is(m.mapItem)
                ? this._makeImageryLayerFromParts(m.mapItem, m.item)
                : undefined)
                .filter(isDefined);
            // Delete imagery layers that are no longer in the model
            // Iterate backwards because we're removing items.
            for (let i = this.scene.imageryLayers.length - 1; i >= 0; i--) {
                const imageryLayer = this.scene.imageryLayers.get(i);
                if (allImageryParts.indexOf(imageryLayer) === -1) {
                    this.scene.imageryLayers.remove(imageryLayer);
                }
            }
            // Iterate backwards so that adding multiple layers adds them in increasing cesium index order
            for (let modelIndex = allImageryParts.length - 1; modelIndex >= 0; modelIndex--) {
                const mapItem = allImageryParts[modelIndex];
                const targetCesiumIndex = allImageryParts.length - modelIndex - 1;
                const currentCesiumIndex = this.scene.imageryLayers.indexOf(mapItem);
                if (currentCesiumIndex === -1) {
                    this.scene.imageryLayers.add(mapItem, targetCesiumIndex);
                }
                else if (currentCesiumIndex > targetCesiumIndex) {
                    for (let j = currentCesiumIndex; j > targetCesiumIndex; j--) {
                        this.scene.imageryLayers.lower(mapItem);
                    }
                }
                else if (currentCesiumIndex < targetCesiumIndex) {
                    for (let j = currentCesiumIndex; j < targetCesiumIndex; j++) {
                        this.scene.imageryLayers.raise(mapItem);
                    }
                }
            }
            const allPrimitives = this._allMapItems.filter(isPrimitive);
            const prevPrimitives = prevMapItems.filter(isPrimitive);
            const primitives = this.scene.primitives;
            // Remove deleted primitives
            prevPrimitives.forEach((primitive) => {
                if (!allPrimitives.includes(primitive)) {
                    if (isCesium3DTileset(primitive)) {
                        // Remove all event listeners from any Cesium3DTilesets by running stored remover functions
                        const fnArray = this._3dTilesetEventListeners.get(primitive);
                        try {
                            fnArray === null || fnArray === void 0 ? void 0 : fnArray.forEach((fn) => fn()); // Run the remover functions
                        }
                        catch (error) {
                            /* TODO: handle error */
                        }
                        this._3dTilesetEventListeners.delete(primitive); // Remove the item for this tileset from our eventListener reference storage array
                        this._updateTilesLoadingIndeterminate(false); // reset progress bar loading state to false. Any new tile loading event will restart it to account for multiple currently loading 3DTilesets.
                    }
                    primitives.remove(primitive);
                }
            });
            // Add new primitives
            allPrimitives.forEach((primitive) => {
                if (!primitives.contains(primitive)) {
                    primitives.add(primitive);
                    if (isCesium3DTileset(primitive)) {
                        const startingListener = this._eventHelper.add(primitive.tileLoad, () => this._updateTilesLoadingIndeterminate(true));
                        //Add event listener for when tiles finished loading for current view. Infrequent.
                        const finishedListener = this._eventHelper.add(primitive.allTilesLoaded, () => this._updateTilesLoadingIndeterminate(false));
                        // Push new item to eventListener reference storage
                        this._3dTilesetEventListeners.set(primitive, [
                            startingListener,
                            finishedListener
                        ]);
                    }
                }
            });
            prevMapItems = this._allMapItems;
            this.notifyRepaintRequired();
        });
        return () => {
            reactionDisposer();
            autorunDisposer();
        };
    }
    stopObserving() {
        if (this._disposeWorkbenchMapItemsSubscription !== undefined) {
            this._disposeWorkbenchMapItemsSubscription();
        }
    }
    doZoomTo(target, flightDurationSeconds = 3.0) {
        this._lastZoomTarget = target;
        const _zoom = async () => {
            const camera = this.scene.camera;
            if (target instanceof Rectangle) {
                // target is a Rectangle
                // Work out the destination that the camera would naturally fly to
                const destinationCartesian = camera.getRectangleCameraCoordinates(target);
                const destination = Ellipsoid.WGS84.cartesianToCartographic(destinationCartesian);
                const terrainProvider = this.scene.globe.terrainProvider;
                // A sufficiently coarse tile level that still has approximately accurate height
                const level = 6;
                const center = Rectangle.center(target);
                // Perform an elevation query at the centre of the rectangle
                let terrainSample;
                try {
                    [terrainSample] = await sampleTerrain(terrainProvider, level, [
                        center
                    ]);
                }
                catch {
                    // if the request fails just use center with height=0
                    terrainSample = center;
                }
                if (this._lastZoomTarget !== target) {
                    return;
                }
                const finalDestinationCartographic = new Cartographic(destination.longitude, destination.latitude, destination.height + terrainSample.height);
                const finalDestination = Ellipsoid.WGS84.cartographicToCartesian(finalDestinationCartographic);
                return flyToPromise(camera, {
                    duration: flightDurationSeconds,
                    destination: finalDestination
                });
            }
            else if (defined(target.entities)) {
                // target is some DataSource
                return waitForDataSourceToLoad(target).then(() => {
                    if (this._lastZoomTarget === target) {
                        return zoomToDataSource(this, target, flightDurationSeconds);
                    }
                });
            }
            else if (
            // check for readyPromise first because cesium raises an exception when
            // accessing `.boundingSphere` before ready
            defined(target.readyPromise) ||
                defined(target.boundingSphere)) {
                // target is some object like a Model with boundingSphere and possibly a readyPromise
                return Promise.resolve(target.readyPromise).then(() => {
                    if (this._lastZoomTarget === target) {
                        return flyToBoundingSpherePromise(camera, target.boundingSphere, {
                            offset: new HeadingPitchRange(0, -0.5, 
                            // To avoid getting too close to models less than 100m radius, let
                            // cesium calculate an appropriate zoom distance. For the rest
                            // use the radius as the zoom distance because the offset
                            // distance cesium calculates for large models is often too far away.
                            target.boundingSphere.radius < 100
                                ? undefined
                                : target.boundingSphere.radius),
                            duration: flightDurationSeconds
                        });
                    }
                });
            }
            else if (target.position instanceof Cartesian3) {
                // target is a CameraView or an Entity
                return flyToPromise(camera, {
                    duration: flightDurationSeconds,
                    destination: target.position,
                    orientation: {
                        direction: target.direction,
                        up: target.up
                    }
                });
            }
            else if (MappableMixin.isMixedInto(target)) {
                // target is a Mappable
                if (isDefined(target.cesiumRectangle)) {
                    return flyToPromise(camera, {
                        duration: flightDurationSeconds,
                        destination: target.cesiumRectangle
                    });
                }
                else if (target.mapItems.length > 0) {
                    // Zoom to the first item!
                    return this.doZoomTo(target.mapItems[0], flightDurationSeconds);
                }
                else {
                    return Promise.resolve();
                }
            }
            else if (defined(target.rectangle)) {
                // target has a rectangle
                return flyToPromise(camera, {
                    duration: flightDurationSeconds,
                    destination: target.rectangle
                });
            }
            else {
                return Promise.resolve();
            }
        };
        // we call notifyRepaintRequired before and after the zoom
        // to wake the cesium render loop which might pause itself after
        // some idle time
        this.notifyRepaintRequired();
        return _zoom().finally(() => this.notifyRepaintRequired());
    }
    notifyRepaintRequired() {
        this.pauser.notifyRepaintRequired();
    }
    _reactToSplitterChanges() {
        const disposeSplitPositionChange = autorun(() => {
            if (this.scene) {
                this.scene.splitPosition = this.terria.splitPosition;
                this.notifyRepaintRequired();
            }
        });
        const disposeSplitDirectionChange = autorun(() => {
            const items = this.terriaViewer.items.get();
            const showSplitter = this.terria.showSplitter;
            items.forEach((item) => {
                if (MappableMixin.isMixedInto(item) &&
                    hasTraits(item, SplitterTraits, "splitDirection")) {
                    const splittableItems = this.getSplittableMapItems(item);
                    const splitDirection = item.splitDirection;
                    splittableItems.forEach((splittableItem) => {
                        if (showSplitter) {
                            splittableItem.splitDirection = splitDirection;
                        }
                        else {
                            splittableItem.splitDirection = SplitDirection.NONE;
                        }
                    });
                }
            });
            this.notifyRepaintRequired();
        });
        return function () {
            disposeSplitPositionChange();
            disposeSplitDirectionChange();
        };
    }
    /**
     * Helper method to clone a camera object
     * @param camera
     * @returns Camera
     */
    cloneCamera(camera) {
        const result = new Camera(this.scene);
        Cartesian3.clone(camera.position, result.position);
        Cartesian3.clone(camera.direction, result.direction);
        Cartesian3.clone(camera.up, result.up);
        Cartesian3.clone(camera.right, result.right);
        Matrix4.clone(camera.transform, result.transform);
        result.frustum = camera.frustum.clone();
        return result;
    }
    getCurrentCameraView() {
        const scene = this.scene;
        const camera = scene.camera;
        const width = scene.canvas.clientWidth;
        const height = scene.canvas.clientHeight;
        const centerOfScreen = new Cartesian2(width / 2.0, height / 2.0);
        const pickRay = scene.camera.getPickRay(centerOfScreen);
        const center = isDefined(pickRay)
            ? scene.globe.pick(pickRay, scene) // will be undefined if we are facing above the horizon
            : undefined;
        if (!center) {
            /** In cases where the horizon is not visible, we cannot calculate a center using a pick ray,
            but we need to return a useful CameraView that works in 3D mode and 2D mode.
            In this case we can return the correct definition for the cesium camera, with position, direction, and up,
            but we need to calculate a bounding box on the ellipsoid too to be used in 2D mode.
      
            To do this we clone the camera, rotate it to point straight down, and project the camera view from that position onto the ellipsoid.
            **/
            // Clone the camera
            const cameraClone = this.cloneCamera(camera);
            // Rotate camera straight down
            cameraClone.setView({
                orientation: {
                    heading: 0.0,
                    pitch: -CesiumMath.PI_OVER_TWO,
                    roll: 0.0
                }
            });
            // Compute the bounding box on the ellipsoid
            const rectangleFor2dView = cameraClone.computeViewRectangle(this.scene.globe.ellipsoid);
            // Return the combined CameraView object
            return new CameraView(rectangleFor2dView || this.terriaViewer.homeCamera.rectangle, //TODO: Is this fallback appropriate?
            camera.positionWC, camera.directionWC, camera.upWC);
        }
        const ellipsoid = this.scene.globe.ellipsoid;
        const frustrum = scene.camera.frustum;
        const fovy = frustrum.fovy * 0.5;
        const fovx = Math.atan(Math.tan(fovy) * frustrum.aspectRatio);
        const cameraOffset = Cartesian3.subtract(camera.positionWC, center, cartesian3Scratch);
        const cameraHeight = Cartesian3.magnitude(cameraOffset);
        const xDistance = cameraHeight * Math.tan(fovx);
        const yDistance = cameraHeight * Math.tan(fovy);
        const southwestEnu = new Cartesian3(-xDistance, -yDistance, 0.0);
        const southeastEnu = new Cartesian3(xDistance, -yDistance, 0.0);
        const northeastEnu = new Cartesian3(xDistance, yDistance, 0.0);
        const northwestEnu = new Cartesian3(-xDistance, yDistance, 0.0);
        const enuToFixed = Transforms.eastNorthUpToFixedFrame(center, ellipsoid, enuToFixedScratch);
        const southwest = Matrix4.multiplyByPoint(enuToFixed, southwestEnu, southwestScratch);
        const southeast = Matrix4.multiplyByPoint(enuToFixed, southeastEnu, southeastScratch);
        const northeast = Matrix4.multiplyByPoint(enuToFixed, northeastEnu, northeastScratch);
        const northwest = Matrix4.multiplyByPoint(enuToFixed, northwestEnu, northwestScratch);
        const southwestCartographic = ellipsoid.cartesianToCartographic(southwest, southwestCartographicScratch);
        const southeastCartographic = ellipsoid.cartesianToCartographic(southeast, southeastCartographicScratch);
        const northeastCartographic = ellipsoid.cartesianToCartographic(northeast, northeastCartographicScratch);
        const northwestCartographic = ellipsoid.cartesianToCartographic(northwest, northwestCartographicScratch);
        // Account for date-line wrapping
        if (southeastCartographic.longitude < southwestCartographic.longitude) {
            southeastCartographic.longitude += CesiumMath.TWO_PI;
        }
        if (northeastCartographic.longitude < northwestCartographic.longitude) {
            northeastCartographic.longitude += CesiumMath.TWO_PI;
        }
        const rect = new Rectangle(CesiumMath.convertLongitudeRange(Math.min(southwestCartographic.longitude, northwestCartographic.longitude)), Math.min(southwestCartographic.latitude, southeastCartographic.latitude), CesiumMath.convertLongitudeRange(Math.max(northeastCartographic.longitude, southeastCartographic.longitude)), Math.max(northeastCartographic.latitude, northwestCartographic.latitude));
        // center isn't a member variable and doesn't seem to be used anywhere else in Terria
        // rect.center = center;
        return new CameraView(rect, camera.positionWC, camera.directionWC, camera.upWC);
    }
    get _firstMapItemTerrainProvider() {
        // Get the top map item that is a terrain provider, if any are
        return this._allMapItems.find(isTerrainProvider);
    }
    // It's nice to co-locate creation of Ion TerrainProvider and Credit, but not necessary
    get _terrainWithCredits() {
        if (!this.terriaViewer.viewerOptions.useTerrain) {
            // Terrain mode is off, use the ellipsoidal terrain (aka 3d-smooth)
            return {
                terrainProviderPromise: Promise.resolve(new EllipsoidTerrainProvider())
            };
        }
        else if (this._firstMapItemTerrainProvider) {
            // If there's a TerrainProvider in map items/workbench then use it
            return {
                terrainProviderPromise: Promise.resolve(this._firstMapItemTerrainProvider)
            };
        }
        else if (this.terria.configParameters.cesiumTerrainAssetId !== undefined) {
            // Load the terrain provider from Ion
            return {
                terrainProviderPromise: this.createTerrainProviderFromIonAssetId(this.terria.configParameters.cesiumTerrainAssetId, this.terria.configParameters.cesiumIonAccessToken)
            };
        }
        else if (this.terria.configParameters.cesiumTerrainUrl) {
            // Load the terrain provider from the given URL
            return {
                terrainProviderPromise: this.createTerrainProviderFromUrl(this.terria.configParameters.cesiumTerrainUrl)
            };
        }
        else if (this.terria.configParameters.useCesiumIonTerrain) {
            // Use Cesium ION world Terrain
            const logo = require("terriajs-cesium/Source/Assets/Images/ion-credit.png");
            const ionCredit = new Credit('<a href="https://cesium.com/" target="_blank" rel="noopener noreferrer"><img src="' +
                logo +
                '" title="Cesium ion"/></a>', true);
            return {
                terrainProviderPromise: this.createWorldTerrain(),
                credit: ionCredit
            };
        }
        else {
            // Default to ellipsoid/3d-smooth
            return {
                terrainProviderPromise: Promise.resolve(new EllipsoidTerrainProvider())
            };
        }
    }
    /**
     * Returns terrainProvider from `configParameters.cesiumTerrainAssetId` when set or `undefined`.
     *
     * Used for spying in specs
     */
    createTerrainProviderFromIonAssetId(assetId, accessToken) {
        const terrainProvider = CesiumTerrainProvider.fromUrl(IonResource.fromAssetId(assetId, {
            accessToken
        }));
        // Add the event handler to the TerrainProvider
        return this.catchTerrainProviderDown(terrainProvider);
    }
    /**
     * Returns terrainProvider from `configParameters.cesiumTerrainAssetId` when set or `undefined`.
     *
     * Used for spying in specs
     */
    createTerrainProviderFromUrl(url) {
        return this.catchTerrainProviderDown(CesiumTerrainProvider.fromUrl(url));
    }
    /**
     * Creates cesium-world-terrain.
     *
     * Used for spying in specs
     */
    createWorldTerrain() {
        return this.catchTerrainProviderDown(createWorldTerrainAsync({}));
    }
    /**
     * An observable terrain provider promise
     */
    get observableTerrainProviderPromise() {
        return fromPromise(this._terrainWithCredits.terrainProviderPromise);
    }
    /**
     * Returns the currently active TerrainProvider
     */
    get terrainProvider() {
        return this.observableTerrainProviderPromise.case({
            // Return the current provider from the scene instance if the promise is pending or rejected
            pending: () => this.scene.terrainProvider,
            rejected: () => this.scene.terrainProvider,
            // When promise is fulfilled, return the new terrainProvider
            fulfilled: (terrainProvider) => terrainProvider
        });
    }
    /**
     * Returns `true` if loading of a new TerrainProvider is in progress
     *
     * Note that until the loading is fully complete, `this.terrainProvider` will
     * return the existing TerrainProvider.
     */
    get isTerrainLoading() {
        return this.observableTerrainProviderPromise.state === "pending";
    }
    /**
     * Picks features based on coordinates relative to the Cesium window. Will draw a ray from the camera through the point
     * specified and set terria.pickedFeatures based on this.
     *
     */
    pickFromScreenPosition(screenPosition, ignoreSplitter) {
        const pickRay = this.scene.camera.getPickRay(screenPosition);
        const pickPosition = isDefined(pickRay)
            ? this.scene.globe.pick(pickRay, this.scene)
            : undefined;
        const pickPositionCartographic = pickPosition && Ellipsoid.WGS84.cartesianToCartographic(pickPosition);
        const vectorFeatures = this.pickVectorFeatures(screenPosition);
        const providerCoords = this._attachProviderCoordHooks();
        const pickRasterPromise = this.terria.allowFeatureInfoRequests && isDefined(pickRay)
            ? this.scene.imageryLayers.pickImageryLayerFeatures(pickRay, this.scene)
            : undefined;
        const result = this._buildPickedFeatures(providerCoords, pickPosition, vectorFeatures, pickRasterPromise ? [pickRasterPromise] : [], pickPositionCartographic ? pickPositionCartographic.height : 0.0, ignoreSplitter);
        const mapInteractionModeStack = this.terria.mapInteractionModeStack;
        runInAction(() => {
            if (isDefined(mapInteractionModeStack) &&
                mapInteractionModeStack.length > 0) {
                mapInteractionModeStack[mapInteractionModeStack.length - 1].pickedFeatures = result;
            }
            else {
                this.terria.pickedFeatures = result;
            }
        });
    }
    pickFromLocation(latLngHeight, providerCoords, existingFeatures) {
        const pickPosition = this.scene.globe.ellipsoid.cartographicToCartesian(Cartographic.fromDegrees(latLngHeight.longitude, latLngHeight.latitude, latLngHeight.height));
        const pickPositionCartographic = Ellipsoid.WGS84.cartesianToCartographic(pickPosition);
        const promises = this.terria.allowFeatureInfoRequests
            ? this.pickImageryLayerFeatures(pickPositionCartographic, providerCoords)
            : [];
        const pickedFeatures = this._buildPickedFeatures(providerCoords, pickPosition, existingFeatures, filterOutUndefined(promises), pickPositionCartographic.height, false);
        const mapInteractionModeStack = this.terria.mapInteractionModeStack;
        if (defined(mapInteractionModeStack) &&
            mapInteractionModeStack.length > 0) {
            mapInteractionModeStack[mapInteractionModeStack.length - 1].pickedFeatures = pickedFeatures;
        }
        else {
            this.terria.pickedFeatures = pickedFeatures;
        }
    }
    pickImageryLayerFeatures(pickPosition, providerCoords) {
        var _a;
        const promises = [];
        function hasUrl(o) {
            return typeof (o === null || o === void 0 ? void 0 : o.url) === "string";
        }
        for (let i = this.scene.imageryLayers.length - 1; i >= 0; i--) {
            const imageryLayer = this.scene.imageryLayers.get(i);
            const imageryProvider = imageryLayer.imageryProvider;
            if (hasUrl(imageryProvider) && providerCoords[imageryProvider.url]) {
                const coords = providerCoords[imageryProvider.url];
                promises.push((_a = imageryProvider
                    .pickFeatures(coords.x, coords.y, coords.level, pickPosition.longitude, pickPosition.latitude)) === null || _a === void 0 ? void 0 : _a.then((features) => features.map((f) => {
                    f.imageryLayer = imageryLayer;
                    return f;
                })));
            }
        }
        return filterOutUndefined(promises);
    }
    /**
     * Picks all *vector* features (e.g. GeoJSON) shown at a certain position on the screen, ignoring raster features
     * (e.g. WMS). Because all vector features are already in memory, this is synchronous.
     *
     * @param screenPosition position on the screen to look for features
     * @returns The features found.
     */
    pickVectorFeatures(screenPosition) {
        var _a, _b;
        // Pick vector features
        const vectorFeatures = [];
        const pickedList = this.scene.drillPick(screenPosition);
        for (let i = 0; i < pickedList.length; ++i) {
            const picked = pickedList[i];
            let id = picked.id;
            if (id &&
                id.entityCollection &&
                id.entityCollection.owner &&
                id.entityCollection.owner.name === GlobeOrMap._featureHighlightName) {
                continue;
            }
            if (!defined(id) && defined(picked.primitive)) {
                id = picked.primitive.id;
            }
            // Try to find catalogItem for picked feature, and use catalogItem.getFeaturesFromPickResult() if it exists - this is used by FeatureInfoUrlTemplateMixin
            const catalogItem = (_b = (_a = picked === null || picked === void 0 ? void 0 : picked.primitive) === null || _a === void 0 ? void 0 : _a._catalogItem) !== null && _b !== void 0 ? _b : id === null || id === void 0 ? void 0 : id._catalogItem;
            if (FeatureInfoUrlTemplateMixin.isMixedInto(catalogItem) &&
                typeof (catalogItem === null || catalogItem === void 0 ? void 0 : catalogItem.getFeaturesFromPickResult) === "function" &&
                this.terria.allowFeatureInfoRequests) {
                const result = catalogItem.getFeaturesFromPickResult.bind(catalogItem)(screenPosition, picked, vectorFeatures.length < catalogItem.maxRequests);
                if (result) {
                    if (Array.isArray(result)) {
                        vectorFeatures.push(...result);
                    }
                    else {
                        vectorFeatures.push(result);
                    }
                }
            }
            else if (id instanceof Entity && vectorFeatures.indexOf(id) === -1) {
                const feature = TerriaFeature.fromEntityCollectionOrEntity(id);
                if (picked.primitive) {
                    feature.cesiumPrimitive = picked.primitive;
                }
                vectorFeatures.push(feature);
            }
        }
        return vectorFeatures;
    }
    /**
     * Hooks into the {@link ImageryProvider#pickFeatures} method of every imagery provider in the scene - when this method is
     * evaluated (usually as part of feature picking), it will record the tile coordinates used against the url of the
     * imagery provider in an object that is returned by this method. Hooks are removed immediately after being executed once.
     *
     * returns {{x, y, level}} A map of urls to the coords used by the imagery provider when picking features. Will
     *     initially be empty but will be updated as the hooks are evaluated.
  
     */
    _attachProviderCoordHooks() {
        const providerCoords = {};
        const pickFeaturesHook = function (imageryProvider, oldPick, x, y, level, longitude, latitude) {
            const url = imageryProvider.url;
            try {
                const featuresPromise = oldPick.call(imageryProvider, x, y, level, longitude, latitude);
                // Use url to uniquely identify providers because what else can we do?
                if (url) {
                    providerCoords[url] = {
                        x: x,
                        y: y,
                        level: level
                    };
                }
                imageryProvider.pickFeatures = oldPick;
                return featuresPromise;
            }
            catch (e) {
                TerriaError.from(e, `An error ocurred while hooking into \`ImageryProvider#.pickFeatures\`. \`ImageryProvider.url = ${url}\``).log();
            }
        };
        for (let j = 0; j < this.scene.imageryLayers.length; j++) {
            const imageryProvider = this.scene.imageryLayers.get(j).imageryProvider;
            imageryProvider.pickFeatures = pickFeaturesHook.bind(undefined, imageryProvider, imageryProvider.pickFeatures);
        }
        return providerCoords;
    }
    /**
     * Builds a {@link PickedFeatures} object from a number of inputs.
     *
     * @param providerCoords A map of imagery provider urls to the coords used to get features for that provider.
     * @param  pickPosition The position in the 3D model that has been picked.
     * @param existingFeatures Existing features - the results of feature promises will be appended to this.
     * @param featurePromises Zero or more promises that each resolve to a list of {@link ImageryLayerFeatureInfo}s
     *     (usually there will be one promise per ImageryLayer. These will be combined as part of
     *     {@link PickedFeatures#allFeaturesAvailablePromise} and their results used to build the final
     *     {@link PickedFeatures#features} array.
     * @param imageryLayers An array of ImageryLayers that should line up with the one passed as featurePromises.
     * @param defaultHeight The height to use for feature position heights if none is available when picking.
     * @returns A {@link PickedFeatures} object that is a combination of everything passed.
     */
    _buildPickedFeatures(providerCoords, pickPosition, existingFeatures, featurePromises, defaultHeight, ignoreSplitter) {
        const result = new PickedFeatures();
        result.providerCoords = providerCoords;
        result.pickPosition = pickPosition;
        result.allFeaturesAvailablePromise = Promise.all(featurePromises)
            .then((allFeatures) => {
            runInAction(() => {
                result.isLoading = false;
                result.features = allFeatures.reduce((resultFeaturesSoFar, imageryLayerFeatures, i) => {
                    if (!isDefined(imageryLayerFeatures)) {
                        return resultFeaturesSoFar;
                    }
                    let features = imageryLayerFeatures.map((feature) => {
                        if (!isDefined(feature.position)) {
                            feature.position =
                                pickPosition &&
                                    Ellipsoid.WGS84.cartesianToCartographic(pickPosition);
                        }
                        // If the picked feature does not have a height, use the height of the picked location.
                        // This at least avoids major parallax effects on the selection indicator.
                        if (isDefined(feature.position) &&
                            (!isDefined(feature.position.height) ||
                                feature.position.height === 0.0)) {
                            feature.position.height = defaultHeight;
                        }
                        return this._createFeatureFromImageryLayerFeature(feature);
                    });
                    if (this.terria.showSplitter &&
                        isDefined(result.pickPosition) &&
                        ignoreSplitter === false) {
                        // Select only features that are active on the same side or
                        // both sides of the splitter
                        const screenPosition = this._computePositionOnScreen(result.pickPosition);
                        const pickedSide = this._getSplitterSideForScreenPosition(screenPosition);
                        features = features.filter((feature) => {
                            var _a;
                            const splitDirection = (_a = feature.imageryLayer) === null || _a === void 0 ? void 0 : _a.splitDirection;
                            return (splitDirection === pickedSide ||
                                splitDirection === SplitDirection.NONE);
                        });
                    }
                    return resultFeaturesSoFar.concat(features);
                }, defaultValue(existingFeatures, []));
            });
        })
            .catch((e) => {
            console.log(TerriaError.from(e, "Failed to pick features"));
            runInAction(() => {
                result.isLoading = false;
                result.error = "An unknown error occurred while picking features.";
            });
        });
        return result;
    }
    getSplittableMapItems(item) {
        return filterOutUndefined(item.mapItems.map((m) => {
            if (ImageryParts.is(m)) {
                return this._makeImageryLayerFromParts(m, item);
            }
            else if (isCesium3DTileset(m)) {
                return m;
            }
            return undefined;
        }));
    }
    _makeImageryLayerFromParts(parts, item) {
        if (parts.imageryProvider === undefined)
            return undefined;
        const layer = this._createImageryLayer(parts.imageryProvider, parts.clippingRectangle);
        if (TileErrorHandlerMixin.isMixedInto(item)) {
            // because this code path can run multiple times, make sure we remove the
            // handler if it is already registered
            parts.imageryProvider.errorEvent.removeEventListener(item.onTileLoadError, item);
            parts.imageryProvider.errorEvent.addEventListener(item.onTileLoadError, item);
        }
        layer.alpha = parts.alpha;
        layer.show = parts.show;
        return layer;
    }
    /**
     * Computes the screen position of a given world position.
     * @param position The world position in Earth-centered Fixed coordinates.
     * @param [result] The instance to which to copy the result.
     * @return The screen position, or undefined if the position is not on the screen.
     */
    _computePositionOnScreen(position, result) {
        return SceneTransforms.wgs84ToWindowCoordinates(this.scene, position, result);
    }
    _selectFeature() {
        const feature = this.terria.selectedFeature;
        this._highlightFeature(feature);
        if (isDefined(feature) && isDefined(feature.position)) {
            this._selectionIndicator.position = feature.position.getValue(this.terria.timelineClock.currentTime);
            this._selectionIndicator.animateAppear();
        }
        else {
            this._selectionIndicator.animateDepart();
        }
        this._selectionIndicator.update();
    }
    captureScreenshot() {
        const deferred = new Promise((resolve, reject) => {
            const removeCallback = this.scene.postRender.addEventListener(() => {
                removeCallback();
                try {
                    const cesiumCanvas = this.scene.canvas;
                    // If we're using the splitter, draw the split position as a vertical white line.
                    let canvas = cesiumCanvas;
                    if (this.terria.showSplitter) {
                        canvas = document.createElement("canvas");
                        canvas.width = cesiumCanvas.width;
                        canvas.height = cesiumCanvas.height;
                        const context = canvas.getContext("2d");
                        if (context !== undefined && context !== null) {
                            context.drawImage(cesiumCanvas, 0, 0);
                            const x = this.terria.splitPosition * cesiumCanvas.width;
                            context.strokeStyle = this.terria.baseMapContrastColor;
                            context.beginPath();
                            context.moveTo(x, 0);
                            context.lineTo(x, cesiumCanvas.height);
                            context.stroke();
                        }
                    }
                    resolve(canvas.toDataURL("image/png"));
                }
                catch (e) {
                    reject(e);
                }
            }, this);
        });
        // since we're hooking into the post-render event, we want to render **right now** to ensure that the screenshot
        // image gets created. This is particularly important when showing the print view in a new tab.
        this.scene.render(this.terria.timelineClock.currentTime);
        return deferred;
    }
    _addVectorTileHighlight(imageryProvider, rectangle) {
        const result = new ImageryLayer(imageryProvider, {
            show: true,
            alpha: 1
        });
        const scene = this.scene;
        scene.imageryLayers.add(result);
        return function () {
            scene.imageryLayers.remove(result);
        };
    }
}
__decorate([
    computed
], Cesium.prototype, "attributions", null);
__decorate([
    computed
], Cesium.prototype, "_allMapItems", null);
__decorate([
    computed
], Cesium.prototype, "availableDataSources", null);
__decorate([
    computed
], Cesium.prototype, "_firstMapItemTerrainProvider", null);
__decorate([
    computed
], Cesium.prototype, "_terrainWithCredits", null);
__decorate([
    computed
], Cesium.prototype, "observableTerrainProviderPromise", null);
__decorate([
    computed
], Cesium.prototype, "terrainProvider", null);
__decorate([
    computed
], Cesium.prototype, "isTerrainLoading", null);
__decorate([
    action
], Cesium.prototype, "pickFromScreenPosition", null);
const boundingSphereScratch = new BoundingSphere();
function zoomToDataSource(cesium, target, flightDurationSeconds) {
    let flyToPromise;
    const pollPromise = pollToPromise(function () {
        const dataSourceDisplay = cesium.dataSourceDisplay;
        if (dataSourceDisplay === undefined) {
            return false;
        }
        const entities = target.entities.values;
        const boundingSpheres = [];
        for (let i = 0, len = entities.length; i < len; i++) {
            let state = BoundingSphereState.PENDING;
            try {
                // TODO: missing Cesium type info
                state = dataSourceDisplay.getBoundingSphere(entities[i], false, boundingSphereScratch);
            }
            catch (e) {
                /* TODO: handle error */
            }
            if (state === BoundingSphereState.PENDING) {
                return false;
            }
            else if (state !== BoundingSphereState.FAILED) {
                boundingSpheres.push(BoundingSphere.clone(boundingSphereScratch));
            }
        }
        const _lastZoomTarget = cesium._lastZoomTarget;
        // Test if boundingSpheres is empty to avoid zooming to nowhere
        if (boundingSpheres.length > 0 && _lastZoomTarget === target) {
            const boundingSphere = BoundingSphere.fromBoundingSpheres(boundingSpheres);
            flyToPromise = flyToBoundingSpherePromise(cesium.scene.camera, boundingSphere, {
                duration: flightDurationSeconds,
                offset: new HeadingPitchRange(0, -0.5, 
                // To avoid getting too close to models less than 100m radius, let
                // cesium calculate an appropriate zoom distance. For the rest
                // use the radius as the zoom distance because the offset
                // distance cesium calculates for large models is often too far away.
                boundingSphere.radius < 100 ? undefined : boundingSphere.radius)
            });
            cesium.scene.camera.lookAtTransform(Matrix4.IDENTITY);
        }
        return true;
    }, {
        pollInterval: 100,
        timeout: 30000
    });
    return pollPromise.then(() => flyToPromise);
}
function flyToPromise(camera, options) {
    return new Promise((complete, cancel) => {
        camera.flyTo({
            ...options,
            complete,
            cancel
        });
    });
}
function flyToBoundingSpherePromise(camera, boundingSphere, options) {
    return new Promise((complete, cancel) => {
        camera.flyToBoundingSphere(boundingSphere, {
            ...options,
            complete,
            cancel
        });
    });
}
function syncCesiumCreditsToAttributions(creditsElements, dataAttributionsObservable) {
    // sort credits by count (number of times they are added to map)
    const credits = creditsElements
        .sort((credit1, credit2) => {
        return credit2.count - credit1.count;
    })
        .map(({ credit }) => credit.html);
    if (isEqual(credits, toJS(dataAttributionsObservable)))
        return;
    // first remove ones that are not on the map anymore
    // Iterate backwards because we're removing items.
    for (let i = dataAttributionsObservable.length - 1; i >= 0; i--) {
        const attribution = dataAttributionsObservable[i];
        if (!credits.includes(attribution)) {
            dataAttributionsObservable.remove(attribution);
        }
    }
    // then go through all credits and add them or update their position
    for (const [index, credit] of credits.entries()) {
        const attributionIndex = dataAttributionsObservable.indexOf(credit);
        if (attributionIndex === index) {
            // it is already on correct position in the list
            continue;
        }
        else if (attributionIndex === -1) {
            // it is not on the list yet so we add it to the list
            dataAttributionsObservable.splice(index, 0, credit);
        }
        else {
            // it is on the list but not in the right place so we move it
            dataAttributionsObservable.splice(index, 0, dataAttributionsObservable.splice(attributionIndex, 1)[0]);
        }
    }
}
//# sourceMappingURL=Cesium.js.map