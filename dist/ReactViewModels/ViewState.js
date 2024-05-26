var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable, reaction, runInAction, makeObservable } from "mobx";
import defined from "terriajs-cesium/Source/Core/defined";
import addedByUser from "../Core/addedByUser";
import { Category, HelpAction, StoryAction } from "../Core/AnalyticEvents/analyticEvents";
import Result from "../Core/Result";
import triggerResize from "../Core/triggerResize";
import CatalogMemberMixin, { getName } from "../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../ModelMixins/GroupMixin";
import MappableMixin from "../ModelMixins/MappableMixin";
import ReferenceMixin from "../ModelMixins/ReferenceMixin";
import CommonStrata from "../Models/Definition/CommonStrata";
import getAncestors from "../Models/getAncestors";
import { SATELLITE_HELP_PROMPT_KEY } from "../ReactViews/HelpScreens/SatelliteHelpPrompt";
import { animationDuration } from "../ReactViews/StandardUserInterface/StandardUserInterface";
import { defaultTourPoints, RelativePosition } from "./defaultTourPoints";
import DisclaimerHandler from "./DisclaimerHandler";
import SearchState from "./SearchState";
import { getMarkerCatalogItem } from "../Models/LocationMarkerUtils";
export const DATA_CATALOG_NAME = "data-catalog";
export const USER_DATA_NAME = "my-data";
// check showWorkbenchButton delay and transforms
// export const WORKBENCH_RESIZE_ANIMATION_DURATION = 250;
export const WORKBENCH_RESIZE_ANIMATION_DURATION = 500;
/**
 * Root of a global view model. Presumably this should get nested as more stuff goes into it. Basically this belongs to
 * the root of the UI and then it can choose to pass either the whole thing or parts down as props to its children.
 */
export default class ViewState {
    get previewedItem() {
        return this._previewedItem;
    }
    setSelectedTrainerItem(trainerItem) {
        this.selectedTrainerItem = trainerItem;
    }
    setTrainerBarVisible(bool) {
        this.trainerBarVisible = bool;
    }
    setTrainerBarShowingAllSteps(bool) {
        this.trainerBarShowingAllSteps = bool;
    }
    setTrainerBarExpanded(bool) {
        this.trainerBarExpanded = bool;
        // if collapsing trainer bar, also hide steps
        if (!bool) {
            this.trainerBarShowingAllSteps = bool;
        }
    }
    setCurrentTrainerItemIndex(index) {
        this.currentTrainerItemIndex = index;
        this.currentTrainerStepIndex = 0;
    }
    setCurrentTrainerStepIndex(index) {
        this.currentTrainerStepIndex = index;
    }
    setActionBarVisible(visible) {
        this.isActionBarVisible = visible;
    }
    setBottomDockHeight(height) {
        if (this.bottomDockHeight !== height) {
            this.bottomDockHeight = height;
        }
    }
    get tourPointsWithValidRefs() {
        // should viewstate.ts reach into document? seems unavoidable if we want
        // this to be the true source of tourPoints.
        // update: well it turns out you can be smarter about it and actually
        // properly clean up your refs - so we'll leave that up to the UI to
        // provide valid refs
        return this.tourPoints
            .slice()
            .sort((a, b) => {
            return a.priority - b.priority;
        })
            .filter((tourPoint) => { var _a; return (_a = this.appRefs.get(tourPoint.appRefName)) === null || _a === void 0 ? void 0 : _a.current; });
    }
    setTourIndex(index) {
        this.currentTourIndex = index;
    }
    setShowTour(bool) {
        this.showTour = bool;
        // If we're enabling the tour, make sure the trainer is collapsed
        if (bool) {
            this.setTrainerBarExpanded(false);
        }
    }
    closeTour() {
        this.currentTourIndex = -1;
        this.showTour = false;
    }
    previousTourPoint() {
        const currentIndex = this.currentTourIndex;
        if (currentIndex !== 0) {
            this.currentTourIndex = currentIndex - 1;
        }
    }
    nextTourPoint() {
        const totalTourPoints = this.tourPointsWithValidRefs.length;
        const currentIndex = this.currentTourIndex;
        if (currentIndex >= totalTourPoints - 1) {
            this.closeTour();
        }
        else {
            this.currentTourIndex = currentIndex + 1;
        }
    }
    closeCollapsedNavigation() {
        this.showCollapsedNavigation = false;
    }
    updateAppRef(refName, ref) {
        if (!this.appRefs.get(refName) || this.appRefs.get(refName) !== ref) {
            this.appRefs.set(refName, ref);
        }
    }
    deleteAppRef(refName) {
        this.appRefs.delete(refName);
    }
    constructor(options) {
        Object.defineProperty(this, "mobileViewOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Object.freeze({
                data: "data",
                preview: "preview",
                nowViewing: "nowViewing",
                locationSearchResults: "locationSearchResults"
            })
        });
        Object.defineProperty(this, "searchState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "terria", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "relativePosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: RelativePosition
        });
        Object.defineProperty(this, "_previewedItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userDataPreviewedItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "explorerPanelIsVisible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "activeTabCategory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: DATA_CATALOG_NAME
        });
        Object.defineProperty(this, "activeTabIdInCategory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "isDraggingDroppingFile", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "mobileView", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isMapFullScreen", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "myDataIsUploadView", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "mobileMenuVisible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "explorerPanelAnimating", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "topElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "FeatureInfo"
        });
        // Map for storing react portal containers created by <Portal> component.
        Object.defineProperty(this, "portals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "lastUploadedFiles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "storyBuilderShown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // Flesh out later
        Object.defineProperty(this, "showHelpMenu", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "showSatelliteGuidance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "showWelcomeMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "selectedHelpMenuItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "helpPanelExpanded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "disclaimerSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "disclaimerVisible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "videoGuideVisible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "trainerBarVisible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "trainerBarExpanded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "trainerBarShowingAllSteps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "selectedTrainerItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "currentTrainerItemIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "currentTrainerStepIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "printWindow", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        /**
         * Toggles ActionBar visibility. Do not set manually, it is
         * automatically set when rendering <ActionBar>
         */
        Object.defineProperty(this, "isActionBarVisible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * A global list of functions that generate a {@link ViewingControl} option
         * for the given catalog item instance.  This is useful for plugins to extend
         * the viewing control menu across catalog items.
         *
         * Use {@link ViewingControlsMenu.addMenuItem} instead of updating directly.
         */
        Object.defineProperty(this, "globalViewingControlOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        /**
         * A global list of hooks for generating input controls for items in the workbench.
         * The hooks in this list gets called once for each item in shown in the workbench.
         * This is a mechanism for plugins to extend workbench input controls by adding new ones.
         *
         * Use {@link WorkbenchItem.Inputs.addInput} instead of updating directly.
         */
        Object.defineProperty(this, "workbenchItemInputGenerators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        /**
         * A global list of generator functions for showing buttons in feature info panel.
         * Use {@link FeatureInfoPanelButton.addButton} instead of updating directly.
         */
        Object.defineProperty(this, "featureInfoPanelButtonGenerators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        /**
         * Bottom dock state & action
         */
        Object.defineProperty(this, "bottomDockHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        /**
         * ID of the workbench item whose ViewingControls menu is currently open.
         */
        Object.defineProperty(this, "workbenchItemWithOpenControls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "errorProvider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // default value is null, because user has not made decision to show or
        // not show story
        // will be explicitly set to false when user 1. dismiss story
        // notification or 2. close a story
        Object.defineProperty(this, "storyShown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "currentStoryId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "featurePrompts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        /**
         * we need a layering system for touring the app, but also a way for it to be
         * chopped and changed from a terriamap
         *
         * this will be slightly different to the help sequences that were done in
         * the past, but may evolve to become a "sequence" (where the UI gets
         * programatically toggled to delve deeper into the app, e.g. show the user
         * how to add data via the data catalog window)
         *
         * rough points
         * - "all guide points visible"
         * -
         *
      
         * draft structure(?):
         *
         * maybe each "guide" item will have
         * {
         *  ref: (react ref object)
         *  dotOffset: (which way the dot and guide should be positioned relative to the ref component)
         *  content: (component, more flexibility than a string)
         * ...?
         * }
         * and guide props?
         * {
         *  enabled: parent component to decide this based on active index
         * ...?
         * }
         *  */
        Object.defineProperty(this, "tourPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: defaultTourPoints
        });
        Object.defineProperty(this, "showTour", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "appRefs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "currentTourIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -1
        });
        Object.defineProperty(this, "showCollapsedNavigation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Gets or sets a value indicating whether the small screen (mobile) user interface should be used.
         * @type {Boolean}
         */
        Object.defineProperty(this, "useSmallScreenInterface", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Gets or sets a value indicating whether the feature info panel is visible.
         * @type {Boolean}
         */
        Object.defineProperty(this, "featureInfoPanelIsVisible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Gets or sets a value indicating whether the feature info panel is collapsed.
         * When it's collapsed, only the title bar is visible.
         * @type {Boolean}
         */
        Object.defineProperty(this, "featureInfoPanelIsCollapsed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * True if this is (or will be) the first time the user has added data to the map.
         * @type {Boolean}
         */
        Object.defineProperty(this, "firstTimeAddingData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        /**
         * Gets or sets a value indicating whether the feedback form is visible.
         * @type {Boolean}
         */
        Object.defineProperty(this, "feedbackFormIsVisible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Gets or sets a value indicating whether the catalog's modal share panel
         * is currently visible.
         */
        Object.defineProperty(this, "shareModalIsVisible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        }); // Small share modal inside StoryEditor
        /**
         * Used to indicate that the Share Panel should stay open even if it loses focus.
         * This is used when clicking a help link in the Share Panel - The Help Panel will open, and when it is closed, the Share Panel should still be visible for the user to continue their task.
         */
        Object.defineProperty(this, "retainSharePanel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        }); // The large share panel accessed via Share/Print button
        /**
         * The currently open tool
         */
        Object.defineProperty(this, "currentTool", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "panel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_pickedFeaturesSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_disclaimerVisibleSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_isMapFullScreenSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_showStoriesSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_mobileMenuSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_storyPromptSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_previewedItemIdSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_locationMarkerSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_workbenchHasTimeWMSSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_storyBeforeUnloadSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_disclaimerHandler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        makeObservable(this);
        const terria = options.terria;
        this.searchState = new SearchState({
            terria,
            catalogSearchProvider: options.catalogSearchProvider
        });
        this.errorProvider = options.errorHandlingProvider
            ? options.errorHandlingProvider
            : null;
        this.terria = terria;
        // When features are picked, show the feature info panel.
        this._pickedFeaturesSubscription = reaction(() => this.terria.pickedFeatures, (pickedFeatures) => {
            if (defined(pickedFeatures)) {
                this.featureInfoPanelIsVisible = true;
                this.featureInfoPanelIsCollapsed = false;
            }
            else {
                this.featureInfoPanelIsVisible = false;
            }
        });
        // When disclaimer is shown, ensure fullscreen
        // unsure about this behaviour because it nudges the user off center
        // of the original camera set from config once they acknowdge
        this._disclaimerVisibleSubscription = reaction(() => this.disclaimerVisible, (disclaimerVisible) => {
            this.isMapFullScreen =
                disclaimerVisible ||
                    terria.userProperties.get("hideWorkbench") === "1" ||
                    terria.userProperties.get("hideExplorerPanel") === "1";
        });
        this._isMapFullScreenSubscription = reaction(() => terria.userProperties.get("hideWorkbench") === "1" ||
            terria.userProperties.get("hideExplorerPanel") === "1", (isMapFullScreen) => {
            this.isMapFullScreen = isMapFullScreen;
            // if /#hideWorkbench=1 exists in url onload, show stories directly
            // any show/hide workbench will not automatically show story
            if (!defined(this.storyShown)) {
                // why only check config params here? because terria.stories are not
                // set at the moment, and that property will be checked in rendering
                // Here are all are checking are: is terria story enabled in this app?
                // if so we should show it when app first load, if workbench is hidden
                this.storyShown = terria.configParameters.storyEnabled;
            }
        });
        this._showStoriesSubscription = reaction(() => Boolean(terria.userProperties.get("playStory")), (playStory) => {
            this.storyShown = terria.configParameters.storyEnabled && playStory;
        });
        this._mobileMenuSubscription = reaction(() => this.mobileMenuVisible, (mobileMenuVisible) => {
            if (mobileMenuVisible) {
                this.explorerPanelIsVisible = false;
                this.switchMobileView(null);
            }
        });
        this._disclaimerHandler = new DisclaimerHandler(terria, this);
        this._workbenchHasTimeWMSSubscription = reaction(() => this.terria.workbench.hasTimeWMS, (hasTimeWMS) => {
            if (this.terria.configParameters.showInAppGuides &&
                hasTimeWMS === true &&
                // // only show it once
                !this.terria.getLocalProperty(`${SATELLITE_HELP_PROMPT_KEY}Prompted`)) {
                this.setShowSatelliteGuidance(true);
                this.toggleFeaturePrompt(SATELLITE_HELP_PROMPT_KEY, true, true);
            }
        });
        this._storyPromptSubscription = reaction(() => this.storyShown, (storyShown) => {
            if (storyShown === false) {
                // only show it once
                if (!this.terria.getLocalProperty("storyPrompted")) {
                    this.toggleFeaturePrompt("story", true, false);
                }
            }
        });
        this._locationMarkerSubscription = reaction(() => getMarkerCatalogItem(this.terria), (item) => {
            if (item) {
                terria.overlays.add(item);
                /* dispose subscription after init */
                this._locationMarkerSubscription();
            }
        });
        this._previewedItemIdSubscription = reaction(() => this.terria.previewedItemId, async (previewedItemId) => {
            if (previewedItemId === undefined) {
                return;
            }
            try {
                const result = await this.terria.getModelByIdShareKeyOrCatalogIndex(previewedItemId);
                result.throwIfError();
                const model = result.throwIfUndefined();
                this.viewCatalogMember(model);
            }
            catch (e) {
                terria.raiseErrorToUser(e, {
                    message: `Couldn't find model \`${previewedItemId}\` for preview`
                });
            }
        });
        const handleWindowClose = (e) => {
            // Cancel the event
            e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
            // Chrome requires returnValue to be set
            e.returnValue = "";
        };
        this._storyBeforeUnloadSubscription = reaction(() => this.terria.stories.length > 0, (hasScenes) => {
            if (hasScenes) {
                window.addEventListener("beforeunload", handleWindowClose);
            }
            else {
                window.removeEventListener("beforeunload", handleWindowClose);
            }
        });
    }
    dispose() {
        this._pickedFeaturesSubscription();
        this._disclaimerVisibleSubscription();
        this._mobileMenuSubscription();
        this._isMapFullScreenSubscription();
        this._showStoriesSubscription();
        this._storyPromptSubscription();
        this._previewedItemIdSubscription();
        this._workbenchHasTimeWMSSubscription();
        this._locationMarkerSubscription();
        this._disclaimerHandler.dispose();
        this.searchState.dispose();
    }
    triggerResizeEvent() {
        triggerResize();
    }
    setIsMapFullScreen(bool, animationDuration = WORKBENCH_RESIZE_ANIMATION_DURATION) {
        this.isMapFullScreen = bool;
        // Allow any animations to finish, then trigger a resize.
        // (wing): much better to do by listening for transitionend, but will leave
        // this as is until that's in place
        setTimeout(function () {
            // should we do this here in viewstate? it pulls in browser dependent things,
            // and (defensively) calls it.
            // but only way to ensure we trigger this resize, by standardising fullscreen
            // toggle through an action.
            triggerResize();
        }, animationDuration);
    }
    toggleStoryBuilder() {
        this.storyBuilderShown = !this.storyBuilderShown;
    }
    setTopElement(key) {
        this.topElement = key;
    }
    openAddData() {
        this.explorerPanelIsVisible = true;
        this.activeTabCategory = DATA_CATALOG_NAME;
        this.switchMobileView(this.mobileViewOptions.data);
    }
    openUserData() {
        this.explorerPanelIsVisible = true;
        this.activeTabCategory = USER_DATA_NAME;
    }
    closeCatalog() {
        this.explorerPanelIsVisible = false;
        this.switchMobileView(null);
        this.clearPreviewedItem();
    }
    searchInCatalog(query) {
        this.openAddData();
        this.searchState.catalogSearchText = query;
        this.searchState.searchCatalog();
    }
    clearPreviewedItem() {
        this.userDataPreviewedItem = undefined;
        this._previewedItem = undefined;
    }
    /**
     * Views a model in the catalog. If model is a
     *
     * - `Reference` - it will be dereferenced first.
     * - `CatalogMember` - `loadMetadata` will be called
     * - `Group` - its `isOpen` trait will be set according to the value of the `isOpen` parameter in the `stratum` indicated.
     *   - If after doing this the group is open, its members will be loaded with a call to `loadMembers`.
     * - `Mappable` - `loadMapItems` will be called
     *
     * Then (if no errors have occurred) it will open the catalog.
     * Note - `previewItem` is set at the start of the function, regardless of errors.
     *
     * @param item The model to view in catalog.
     * @param [isOpen=true] True if the group should be opened. False if it should be closed.
     * @param stratum The stratum in which to mark the group opened or closed.
     * @param openAddData True if data catalog window should be opened.
     */
    async viewCatalogMember(item, isOpen = true, stratum = CommonStrata.user, openAddData = true) {
        // Set preview item before loading - so we can see loading indicator and errors in DataPreview panel.
        runInAction(() => (this._previewedItem = item));
        try {
            // If item is a Reference - recursively load and call viewCatalogMember on the target
            if (ReferenceMixin.isMixedInto(item)) {
                (await item.loadReference()).throwIfError();
                if (item.target) {
                    return this.viewCatalogMember(item.target);
                }
                else {
                    return Result.error(`Could not view catalog member ${getName(item)}`);
                }
            }
            // Open "Add Data"
            if (openAddData) {
                if (addedByUser(item)) {
                    runInAction(() => (this.userDataPreviewedItem = item));
                    this.openUserData();
                }
                else {
                    runInAction(() => {
                        this.openAddData();
                        if (this.terria.configParameters.tabbedCatalog) {
                            const parentGroups = getAncestors(item);
                            if (parentGroups.length > 0) {
                                // Go to specific tab
                                this.activeTabIdInCategory = parentGroups[0].uniqueId;
                            }
                        }
                    });
                }
                // mobile switch to now viewing if not viewing a group
                if (!GroupMixin.isMixedInto(item)) {
                    this.switchMobileView(this.mobileViewOptions.preview);
                }
            }
            if (GroupMixin.isMixedInto(item)) {
                item.setTrait(stratum, "isOpen", isOpen);
                if (item.isOpen) {
                    (await item.loadMembers()).throwIfError();
                }
            }
            else if (MappableMixin.isMixedInto(item))
                (await item.loadMapItems()).throwIfError();
            else if (CatalogMemberMixin.isMixedInto(item))
                (await item.loadMetadata()).throwIfError();
        }
        catch (e) {
            return Result.error(e, `Could not view catalog member ${getName(item)}`);
        }
        return Result.none();
    }
    switchMobileView(viewName) {
        this.mobileView = viewName;
    }
    showHelpPanel() {
        var _a;
        (_a = this.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.help, HelpAction.panelOpened);
        this.showHelpMenu = true;
        this.helpPanelExpanded = false;
        this.selectedHelpMenuItem = "";
        this.setTopElement("HelpPanel");
    }
    openHelpPanelItemFromSharePanel(evt, itemName) {
        evt.preventDefault();
        evt.stopPropagation();
        this.setRetainSharePanel(true);
        this.showHelpPanel();
        this.selectHelpMenuItem(itemName);
    }
    selectHelpMenuItem(key) {
        this.selectedHelpMenuItem = key;
        this.helpPanelExpanded = true;
    }
    hideHelpPanel() {
        this.showHelpMenu = false;
    }
    setRetainSharePanel(retain) {
        this.retainSharePanel = retain;
    }
    changeSearchState(newText) {
        this.searchState.catalogSearchText = newText;
    }
    setDisclaimerVisible(bool) {
        this.disclaimerVisible = bool;
    }
    hideDisclaimer() {
        this.setDisclaimerVisible(false);
    }
    setShowSatelliteGuidance(showSatelliteGuidance) {
        this.showSatelliteGuidance = showSatelliteGuidance;
    }
    setShowWelcomeMessage(welcomeMessageShown) {
        this.showWelcomeMessage = welcomeMessageShown;
    }
    setVideoGuideVisible(videoName) {
        this.videoGuideVisible = videoName;
    }
    /**
     * Removes references of a model from viewState
     */
    removeModelReferences(model) {
        if (this._previewedItem === model)
            this._previewedItem = undefined;
        if (this.userDataPreviewedItem === model)
            this.userDataPreviewedItem = undefined;
    }
    toggleFeaturePrompt(feature, state, persistent = false) {
        const featureIndexInPrompts = this.featurePrompts.indexOf(feature);
        if (state &&
            featureIndexInPrompts < 0 &&
            !this.terria.getLocalProperty(`${feature}Prompted`)) {
            this.featurePrompts.push(feature);
        }
        else if (!state && featureIndexInPrompts >= 0) {
            this.featurePrompts.splice(featureIndexInPrompts, 1);
        }
        if (persistent) {
            this.terria.setLocalProperty(`${feature}Prompted`, true);
        }
    }
    viewingUserData() {
        return this.activeTabCategory === USER_DATA_NAME;
    }
    afterTerriaStarted() {
        if (this.terria.configParameters.openAddData) {
            this.openAddData();
        }
    }
    openTool(tool) {
        this.currentTool = tool;
    }
    closeTool() {
        this.currentTool = undefined;
    }
    setPrintWindow(window) {
        if (this.printWindow) {
            this.printWindow.close();
        }
        this.printWindow = window;
    }
    toggleMobileMenu() {
        this.setTopElement("mobileMenu");
        this.mobileMenuVisible = !this.mobileMenuVisible;
    }
    runStories() {
        var _a;
        this.storyBuilderShown = false;
        this.storyShown = true;
        setTimeout(function () {
            triggerResize();
        }, animationDuration || 1);
        this.terria.currentViewer.notifyRepaintRequired();
        (_a = this.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.story, StoryAction.runStory);
    }
    get breadcrumbsShown() {
        return (this.previewedItem !== undefined ||
            this.userDataPreviewedItem !== undefined);
    }
    get isToolOpen() {
        return this.currentTool !== undefined;
    }
    get hideMapUi() {
        return (this.terria.notificationState.currentNotification !== undefined &&
            this.terria.notificationState.currentNotification.hideUi);
    }
    get isMapZooming() {
        return this.terria.currentViewer.isMapZooming;
    }
    /**
     * Returns true if the user is currently interacting with the map - like
     * picking a point or drawing a shape.
     */
    get isMapInteractionActive() {
        return this.terria.mapInteractionModeStack.length > 0;
    }
}
__decorate([
    observable
], ViewState.prototype, "_previewedItem", void 0);
__decorate([
    observable
], ViewState.prototype, "userDataPreviewedItem", void 0);
__decorate([
    observable
], ViewState.prototype, "explorerPanelIsVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "activeTabCategory", void 0);
__decorate([
    observable
], ViewState.prototype, "activeTabIdInCategory", void 0);
__decorate([
    observable
], ViewState.prototype, "isDraggingDroppingFile", void 0);
__decorate([
    observable
], ViewState.prototype, "mobileView", void 0);
__decorate([
    observable
], ViewState.prototype, "isMapFullScreen", void 0);
__decorate([
    observable
], ViewState.prototype, "myDataIsUploadView", void 0);
__decorate([
    observable
], ViewState.prototype, "mobileMenuVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "explorerPanelAnimating", void 0);
__decorate([
    observable
], ViewState.prototype, "topElement", void 0);
__decorate([
    observable
], ViewState.prototype, "portals", void 0);
__decorate([
    observable
], ViewState.prototype, "lastUploadedFiles", void 0);
__decorate([
    observable
], ViewState.prototype, "storyBuilderShown", void 0);
__decorate([
    observable
], ViewState.prototype, "showHelpMenu", void 0);
__decorate([
    observable
], ViewState.prototype, "showSatelliteGuidance", void 0);
__decorate([
    observable
], ViewState.prototype, "showWelcomeMessage", void 0);
__decorate([
    observable
], ViewState.prototype, "selectedHelpMenuItem", void 0);
__decorate([
    observable
], ViewState.prototype, "helpPanelExpanded", void 0);
__decorate([
    observable
], ViewState.prototype, "disclaimerSettings", void 0);
__decorate([
    observable
], ViewState.prototype, "disclaimerVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "videoGuideVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "trainerBarVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "trainerBarExpanded", void 0);
__decorate([
    observable
], ViewState.prototype, "trainerBarShowingAllSteps", void 0);
__decorate([
    observable
], ViewState.prototype, "selectedTrainerItem", void 0);
__decorate([
    observable
], ViewState.prototype, "currentTrainerItemIndex", void 0);
__decorate([
    observable
], ViewState.prototype, "currentTrainerStepIndex", void 0);
__decorate([
    observable
], ViewState.prototype, "printWindow", void 0);
__decorate([
    observable
], ViewState.prototype, "isActionBarVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "globalViewingControlOptions", void 0);
__decorate([
    observable
], ViewState.prototype, "workbenchItemInputGenerators", void 0);
__decorate([
    observable
], ViewState.prototype, "featureInfoPanelButtonGenerators", void 0);
__decorate([
    action
], ViewState.prototype, "setSelectedTrainerItem", null);
__decorate([
    action
], ViewState.prototype, "setTrainerBarVisible", null);
__decorate([
    action
], ViewState.prototype, "setTrainerBarShowingAllSteps", null);
__decorate([
    action
], ViewState.prototype, "setTrainerBarExpanded", null);
__decorate([
    action
], ViewState.prototype, "setCurrentTrainerItemIndex", null);
__decorate([
    action
], ViewState.prototype, "setCurrentTrainerStepIndex", null);
__decorate([
    action
], ViewState.prototype, "setActionBarVisible", null);
__decorate([
    observable
], ViewState.prototype, "bottomDockHeight", void 0);
__decorate([
    action
], ViewState.prototype, "setBottomDockHeight", null);
__decorate([
    observable
], ViewState.prototype, "workbenchItemWithOpenControls", void 0);
__decorate([
    observable
], ViewState.prototype, "storyShown", void 0);
__decorate([
    observable
], ViewState.prototype, "currentStoryId", void 0);
__decorate([
    observable
], ViewState.prototype, "featurePrompts", void 0);
__decorate([
    observable
], ViewState.prototype, "tourPoints", void 0);
__decorate([
    observable
], ViewState.prototype, "showTour", void 0);
__decorate([
    observable
], ViewState.prototype, "appRefs", void 0);
__decorate([
    observable
], ViewState.prototype, "currentTourIndex", void 0);
__decorate([
    observable
], ViewState.prototype, "showCollapsedNavigation", void 0);
__decorate([
    computed
], ViewState.prototype, "tourPointsWithValidRefs", null);
__decorate([
    action
], ViewState.prototype, "setTourIndex", null);
__decorate([
    action
], ViewState.prototype, "setShowTour", null);
__decorate([
    action
], ViewState.prototype, "closeTour", null);
__decorate([
    action
], ViewState.prototype, "previousTourPoint", null);
__decorate([
    action
], ViewState.prototype, "nextTourPoint", null);
__decorate([
    action
], ViewState.prototype, "closeCollapsedNavigation", null);
__decorate([
    action
], ViewState.prototype, "updateAppRef", null);
__decorate([
    action
], ViewState.prototype, "deleteAppRef", null);
__decorate([
    observable
], ViewState.prototype, "useSmallScreenInterface", void 0);
__decorate([
    observable
], ViewState.prototype, "featureInfoPanelIsVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "featureInfoPanelIsCollapsed", void 0);
__decorate([
    observable
], ViewState.prototype, "firstTimeAddingData", void 0);
__decorate([
    observable
], ViewState.prototype, "feedbackFormIsVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "shareModalIsVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "retainSharePanel", void 0);
__decorate([
    observable
], ViewState.prototype, "currentTool", void 0);
__decorate([
    observable
], ViewState.prototype, "panel", void 0);
__decorate([
    action
], ViewState.prototype, "triggerResizeEvent", null);
__decorate([
    action
], ViewState.prototype, "setIsMapFullScreen", null);
__decorate([
    action
], ViewState.prototype, "toggleStoryBuilder", null);
__decorate([
    action
], ViewState.prototype, "setTopElement", null);
__decorate([
    action
], ViewState.prototype, "openAddData", null);
__decorate([
    action
], ViewState.prototype, "openUserData", null);
__decorate([
    action
], ViewState.prototype, "closeCatalog", null);
__decorate([
    action
], ViewState.prototype, "searchInCatalog", null);
__decorate([
    action
], ViewState.prototype, "clearPreviewedItem", null);
__decorate([
    action
], ViewState.prototype, "switchMobileView", null);
__decorate([
    action
], ViewState.prototype, "showHelpPanel", null);
__decorate([
    action
], ViewState.prototype, "openHelpPanelItemFromSharePanel", null);
__decorate([
    action
], ViewState.prototype, "selectHelpMenuItem", null);
__decorate([
    action
], ViewState.prototype, "hideHelpPanel", null);
__decorate([
    action
], ViewState.prototype, "setRetainSharePanel", null);
__decorate([
    action
], ViewState.prototype, "changeSearchState", null);
__decorate([
    action
], ViewState.prototype, "setDisclaimerVisible", null);
__decorate([
    action
], ViewState.prototype, "hideDisclaimer", null);
__decorate([
    action
], ViewState.prototype, "setShowSatelliteGuidance", null);
__decorate([
    action
], ViewState.prototype, "setShowWelcomeMessage", null);
__decorate([
    action
], ViewState.prototype, "setVideoGuideVisible", null);
__decorate([
    action
], ViewState.prototype, "removeModelReferences", null);
__decorate([
    action
], ViewState.prototype, "toggleFeaturePrompt", null);
__decorate([
    action
], ViewState.prototype, "openTool", null);
__decorate([
    action
], ViewState.prototype, "closeTool", null);
__decorate([
    action
], ViewState.prototype, "setPrintWindow", null);
__decorate([
    action
], ViewState.prototype, "toggleMobileMenu", null);
__decorate([
    action
], ViewState.prototype, "runStories", null);
__decorate([
    computed
], ViewState.prototype, "breadcrumbsShown", null);
__decorate([
    computed
], ViewState.prototype, "isToolOpen", null);
__decorate([
    computed
], ViewState.prototype, "hideMapUi", null);
__decorate([
    computed
], ViewState.prototype, "isMapInteractionActive", null);
//# sourceMappingURL=ViewState.js.map