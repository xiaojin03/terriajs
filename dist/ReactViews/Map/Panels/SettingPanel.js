var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { action, computed, observable, runInAction, makeObservable } from "mobx";
import { observer } from "mobx-react";
import Slider from "rc-slider";
import React from "react";
import { withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import SplitDirection from "terriajs-cesium/Source/Scene/SplitDirection";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import Cesium from "../../../Models/Cesium";
import ViewerMode, { MapViewers, setViewerMode } from "../../../Models/ViewerMode";
import Box from "../../../Styled/Box";
import Button, { RawButton } from "../../../Styled/Button";
import Checkbox from "../../../Styled/Checkbox";
import { GLYPHS, StyledIcon } from "../../../Styled/Icon";
import Spacing from "../../../Styled/Spacing";
import Text, { TextSpan } from "../../../Styled/Text";
import withTerriaRef from "../../HOCs/withTerriaRef";
import MenuPanel from "../../StandardUserInterface/customizable/MenuPanel";
import Styles from "./setting-panel.scss";
const sides = {
    left: "settingPanel.terrain.left",
    both: "settingPanel.terrain.both",
    right: "settingPanel.terrain.right"
};
let SettingPanel = class SettingPanel extends React.Component {
    /**
     * @param {Props} props
     */
    constructor(props) {
        super(props);
        Object.defineProperty(this, "_hoverBaseMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        makeObservable(this);
    }
    get activeMapName() {
        return this._hoverBaseMap
            ? this._hoverBaseMap
            : this.props.terria.mainViewer.baseMap
                ? this.props.terria.mainViewer.baseMap.name
                : "(None)";
    }
    selectBaseMap(baseMap, event) {
        event.stopPropagation();
        if (!MappableMixin.isMixedInto(baseMap))
            return;
        this.props.terria.mainViewer.setBaseMap(baseMap);
        // this.props.terria.baseMapContrastColor = baseMap.contrastColor;
        // We store the user's chosen basemap for future use, but it's up to the instance to decide
        // whether to use that at start up.
        if (baseMap) {
            const baseMapId = baseMap.uniqueId;
            if (baseMapId) {
                this.props.terria.setLocalProperty("basemap", baseMapId);
            }
        }
    }
    mouseEnterBaseMap(baseMap) {
        runInAction(() => {
            var _a;
            this._hoverBaseMap = (_a = baseMap.item) === null || _a === void 0 ? void 0 : _a.name;
        });
    }
    mouseLeaveBaseMap() {
        runInAction(() => {
            this._hoverBaseMap = null;
        });
    }
    selectViewer(viewer, event) {
        const mainViewer = this.props.terria.mainViewer;
        event.stopPropagation();
        this.showTerrainOnSide(sides.both, undefined);
        setViewerMode(viewer, mainViewer);
        // We store the user's chosen viewer mode for future use.
        this.props.terria.setLocalProperty("viewermode", viewer);
        this.props.terria.currentViewer.notifyRepaintRequired();
    }
    showTerrainOnSide(side, event) {
        event === null || event === void 0 ? void 0 : event.stopPropagation();
        switch (side) {
            case sides.left:
                this.props.terria.terrainSplitDirection = SplitDirection.LEFT;
                this.props.terria.showSplitter = true;
                break;
            case sides.right:
                this.props.terria.terrainSplitDirection = SplitDirection.RIGHT;
                this.props.terria.showSplitter = true;
                break;
            case sides.both:
                this.props.terria.terrainSplitDirection = SplitDirection.NONE;
                break;
        }
        this.props.terria.currentViewer.notifyRepaintRequired();
    }
    toggleDepthTestAgainstTerrainEnabled(event) {
        event.stopPropagation();
        this.props.terria.depthTestAgainstTerrainEnabled =
            !this.props.terria.depthTestAgainstTerrainEnabled;
        this.props.terria.currentViewer.notifyRepaintRequired();
    }
    onBaseMaximumScreenSpaceErrorChange(bmsse) {
        this.props.terria.setBaseMaximumScreenSpaceError(bmsse);
        this.props.terria.setLocalProperty("baseMaximumScreenSpaceError", bmsse.toString());
    }
    toggleUseNativeResolution() {
        this.props.terria.setUseNativeResolution(!this.props.terria.useNativeResolution);
        this.props.terria.setLocalProperty("useNativeResolution", this.props.terria.useNativeResolution);
    }
    render() {
        if (!this.props.terria.mainViewer) {
            return null;
        }
        const { t } = this.props;
        const qualityLabels = {
            0: t("settingPanel.qualityLabels.maximumPerformance"),
            1: t("settingPanel.qualityLabels.balancedPerformance"),
            2: t("settingPanel.qualityLabels.lowerPerformance")
        };
        const currentViewer = this.props.terria.mainViewer.viewerMode === ViewerMode.Cesium
            ? this.props.terria.mainViewer.viewerOptions.useTerrain
                ? "3d"
                : "3dsmooth"
            : "2d";
        const useNativeResolution = this.props.terria.useNativeResolution;
        const nativeResolutionLabel = t("settingPanel.nativeResolutionLabel", {
            resolution1: useNativeResolution
                ? t("settingPanel.native")
                : t("settingPanel.screen"),
            resolution2: useNativeResolution
                ? t("settingPanel.screen")
                : t("settingPanel.native")
        });
        const dropdownTheme = {
            inner: Styles.dropdownInner,
            icon: "map"
        };
        const isCesiumWithTerrain = this.props.terria.mainViewer.viewerMode === ViewerMode.Cesium &&
            this.props.terria.mainViewer.viewerOptions.useTerrain &&
            this.props.terria.currentViewer &&
            this.props.terria.currentViewer instanceof Cesium &&
            this.props.terria.currentViewer.scene &&
            this.props.terria.currentViewer.scene.globe;
        const supportsDepthTestAgainstTerrain = isCesiumWithTerrain;
        const depthTestAgainstTerrainEnabled = supportsDepthTestAgainstTerrain &&
            this.props.terria.depthTestAgainstTerrainEnabled;
        const depthTestAgainstTerrainLabel = depthTestAgainstTerrainEnabled
            ? t("settingPanel.terrain.showUndergroundFeatures")
            : t("settingPanel.terrain.hideUndergroundFeatures");
        if (this.props.terria.configParameters.useCesiumIonTerrain ||
            this.props.terria.configParameters.cesiumTerrainUrl) {
            MapViewers["3d"].available = true;
        }
        const supportsSide = isCesiumWithTerrain;
        let currentSide = sides.both;
        if (supportsSide) {
            switch (this.props.terria.terrainSplitDirection) {
                case SplitDirection.LEFT:
                    currentSide = sides.left;
                    break;
                case SplitDirection.RIGHT:
                    currentSide = sides.right;
                    break;
            }
        }
        const timelineStack = this.props.terria.timelineStack;
        const alwaysShowTimelineLabel = timelineStack.alwaysShowingTimeline
            ? t("settingPanel.timeline.alwaysShowLabel")
            : t("settingPanel.timeline.hideLabel");
        return (
        //@ts-ignore - not yet ready to tackle tsfying MenuPanel
        _jsx(MenuPanel, { theme: dropdownTheme, btnRef: this.props.refFromHOC, btnTitle: t("settingPanel.btnTitle"), btnText: t("settingPanel.btnText"), viewState: this.props.viewState, smallScreen: this.props.viewState.useSmallScreenInterface, children: _jsxs(Box, { padded: true, column: true, children: [_jsx(Box, { paddedVertically: 1, children: _jsx(Text, { as: "label", children: t("settingPanel.mapView") }) }), _jsx(FlexGrid, { gap: 1, elementsNo: 3, children: Object.entries(MapViewers).map(([key, viewerMode]) => (_jsx(SettingsButton, { isActive: key === currentViewer, onClick: (event) => this.selectViewer(key, event), children: _jsx(Text, { mini: true, children: t(viewerMode.label) }) }, key))) }), !!supportsSide && (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 2 }), _jsxs(Box, { column: true, children: [_jsx(Box, { paddedVertically: 1, children: _jsx(Text, { as: "label", children: t("settingPanel.terrain.sideLabel") }) }), _jsx(FlexGrid, { gap: 1, elementsNo: 3, children: Object.values(sides).map((side) => (_jsx(SettingsButton, { isActive: side === currentSide, onClick: (event) => this.showTerrainOnSide(side, event), children: _jsx(Text, { mini: true, children: t(side) }) }, side))) })] }), !!supportsDepthTestAgainstTerrain && (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 2 }), _jsx(Checkbox, { textProps: { small: true }, id: "depthTestAgainstTerrain", title: depthTestAgainstTerrainLabel, isChecked: depthTestAgainstTerrainEnabled, onChange: this.toggleDepthTestAgainstTerrainEnabled.bind(this), children: _jsx(TextSpan, { children: t("settingPanel.terrain.hideUnderground") }) })] }))] })), _jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 2 }), _jsxs(Box, { column: true, children: [_jsx(Box, { paddedVertically: 1, children: _jsx(Text, { as: "label", children: t("settingPanel.baseMap") }) }), _jsx(Box, { paddedVertically: 1, children: _jsx(Text, { as: "label", mini: true, children: this.activeMapName }) }), _jsx(FlexGrid, { gap: 1, elementsNo: 4, children: this.props.terria.baseMapsModel.baseMapItems.map((baseMap) => {
                                            var _a;
                                            return (_jsxs(StyledBasemapButton, { isActive: baseMap.item === this.props.terria.mainViewer.baseMap, onClick: (event) => this.selectBaseMap(baseMap.item, event), onMouseEnter: this.mouseEnterBaseMap.bind(this, baseMap), onMouseLeave: this.mouseLeaveBaseMap.bind(this), onFocus: this.mouseEnterBaseMap.bind(this, baseMap), children: [baseMap.item === this.props.terria.mainViewer.baseMap ? (_jsx(Box, { position: "absolute", topRight: true, children: _jsx(StyledIcon, { light: true, glyph: GLYPHS.selected, styledWidth: "22px" }) })) : null, _jsx(StyledImage, { fullWidth: true, alt: baseMap.item ? baseMap.item.name : "", src: baseMap.image })] }, (_a = baseMap.item) === null || _a === void 0 ? void 0 : _a.uniqueId));
                                        }) })] })] }), _jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 2 }), _jsxs(Box, { column: true, children: [_jsx(Box, { paddedVertically: 1, children: _jsx(Text, { as: "label", children: t("settingPanel.timeline.title") }) }), _jsx(Checkbox, { textProps: { small: true }, id: "alwaysShowTimeline", isChecked: timelineStack.alwaysShowingTimeline, title: alwaysShowTimelineLabel, onChange: () => {
                                            timelineStack.setAlwaysShowTimeline(!timelineStack.alwaysShowingTimeline);
                                        }, children: _jsx(TextSpan, { children: t("settingPanel.timeline.alwaysShow") }) })] })] }), this.props.terria.mainViewer.viewerMode !== ViewerMode.Leaflet && (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 2 }), _jsxs(Box, { column: true, children: [_jsx(Box, { paddedVertically: 1, children: _jsx(Text, { as: "label", children: t("settingPanel.imageOptimisation") }) }), _jsx(Checkbox, { textProps: { small: true }, id: "mapUseNativeResolution", isChecked: useNativeResolution, title: nativeResolutionLabel, onChange: () => this.toggleUseNativeResolution(), children: _jsx(TextSpan, { children: t("settingPanel.nativeResolutionHeader") }) }), _jsx(Spacing, { bottom: 2 }), _jsx(Box, { paddedVertically: 1, children: _jsx(Text, { as: "label", children: t("settingPanel.mapQuality") }) }), _jsxs(Box, { verticalCenter: true, children: [_jsx(Text, { mini: true, children: t("settingPanel.qualityLabel") }), _jsx(Slider, { min: 1, max: 3, step: 0.1, value: this.props.terria.baseMaximumScreenSpaceError, onChange: (val) => this.onBaseMaximumScreenSpaceErrorChange(val), marks: { 2: "" }, "aria-valuetext": qualityLabels, css: `
                      margin: 0 10px;
                      margin-top: 5px;
                    ` }), _jsx(Text, { mini: true, children: t("settingPanel.performanceLabel") })] })] })] }))] }) }));
    }
};
__decorate([
    observable
], SettingPanel.prototype, "_hoverBaseMap", void 0);
__decorate([
    computed
], SettingPanel.prototype, "activeMapName", null);
__decorate([
    action
], SettingPanel.prototype, "selectViewer", null);
__decorate([
    action
], SettingPanel.prototype, "showTerrainOnSide", null);
__decorate([
    action
], SettingPanel.prototype, "toggleDepthTestAgainstTerrainEnabled", null);
SettingPanel = __decorate([
    observer
], SettingPanel);
export const SETTING_PANEL_NAME = "MenuBarMapSettingsButton";
export default withTranslation()(withTheme(withTerriaRef(SettingPanel, SETTING_PANEL_NAME)));
const FlexGrid = styled(Box).attrs({ flexWrap: true }) `
  gap: ${(props) => props.gap * 5}px;
  > * {
    flex: ${(props) => `1 0 ${getCalcWidth(props.elementsNo, props.gap)}`};
    max-width: ${(props) => getCalcWidth(props.elementsNo, props.gap)};
  }
`;
const getCalcWidth = (elementsNo, gap) => `calc(${100 / elementsNo}% - ${gap * 5}px)`;
const SettingsButton = styled(Button) `
  background-color: ${(props) => props.theme.overlay};
  border: 1px solid
    ${(props) => (props.isActive ? "rgba(255, 255, 255, 0.5)" : "transparent")};
`;
const StyledBasemapButton = styled(RawButton) `
  border-radius: 4px;
  position: relative;
  border: 2px solid
    ${(props) => props.isActive ? props.theme.turquoiseBlue : "rgba(255, 255, 255, 0.5)"};
`;
const StyledImage = styled(Box).attrs({
    as: "img"
}) `
  border-radius: inherit;
`;
//# sourceMappingURL=SettingPanel.js.map