var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import React from "react";
import defined from "terriajs-cesium/Source/Core/defined";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import MapInteractionMode from "../../../Models/MapInteractionMode";
import Loader from "../../Loader";
import LocationItem from "../../LocationItem.jsx";
import { withTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { runInAction, reaction } from "mobx";
import Styles from "./satellite-imagery-time-filter-section.scss";
let SatelliteImageryTimeFilterSection = class SatelliteImageryTimeFilterSection extends React.Component {
    removeFilter() {
        this.props.item.removeTimeFilterFeature();
    }
    zoomTo() {
        const feature = this.props.item.timeFilterFeature;
        const position = feature !== undefined && feature.position !== undefined
            ? feature.position.getValue(this.props.item.currentTime)
            : undefined;
        if (defined(position)) {
            const cartographic = Ellipsoid.WGS84.cartesianToCartographic(position);
            this.props.item.terria.currentViewer.zoomTo(new Rectangle(cartographic.longitude - 0.0005, cartographic.latitude - 0.0005, cartographic.longitude + 0.0005, cartographic.latitude + 0.0005));
        }
    }
    newLocation() {
        const { t } = this.props;
        // Cancel any feature picking already in progress.
        const terria = this.props.item.terria;
        const pickPointMode = new MapInteractionMode({
            message: t("satellite.pickPoint"),
            onCancel: () => runInAction(() => terria.mapInteractionModeStack.pop())
        });
        runInAction(() => terria.mapInteractionModeStack.push(pickPointMode));
        // Set up a reaction to observe pickedFeatures and filter the items
        // discrete times
        const disposer = reaction(() => pickPointMode.pickedFeatures, async (pickedFeatures) => {
            runInAction(() => {
                pickPointMode.customUi = function () {
                    return _jsx(Loader, { message: t("satellite.querying") });
                };
            });
            await pickedFeatures.allFeaturesAvailablePromise;
            if (terria.mapInteractionModeStack[terria.mapInteractionModeStack.length - 1] !== pickPointMode) {
                // already cancelled
                disposer();
                return;
            }
            const item = this.props.item;
            const thisLayerFeature = pickedFeatures.features.filter((feature) => {
                return (item.mapItems.find((mapItem) => {
                    var _a;
                    return mapItem.imageryProvider &&
                        mapItem.imageryProvider ===
                            ((_a = feature.imageryLayer) === null || _a === void 0 ? void 0 : _a.imageryProvider);
                }) !== undefined);
            })[0];
            if (thisLayerFeature !== undefined) {
                try {
                    item.setTimeFilterFeature(thisLayerFeature, pickedFeatures.providerCoords);
                }
                catch (e) {
                    terria.raiseErrorToUser(e);
                }
            }
            runInAction(() => terria.mapInteractionModeStack.pop());
            disposer();
        });
    }
    render() {
        if (!this.props.item.canFilterTimeByFeature) {
            return null;
        }
        const feature = this.props.item.timeFilterFeature;
        if (feature === undefined) {
            return this.renderNoFeatureSelected();
        }
        else {
            return this.renderFeatureSelected(feature);
        }
    }
    renderNoFeatureSelected() {
        const { t } = this.props;
        return (_jsx("div", { className: Styles.inactive, children: _jsx("div", { className: Styles.btnGroup, children: _jsx("button", { className: Styles.btn, onClick: () => this.newLocation(), children: t("satellite.filterByLocation") }) }) }));
    }
    renderFeatureSelected(feature) {
        const { t } = this.props;
        // TODO: if the feature itself doesn't have a position, we should be able to use the position the user clicked on.
        const position = feature.position !== undefined
            ? feature.position.getValue(this.props.item.currentTime)
            : undefined;
        return (_jsxs("div", { className: Styles.active, css: `
          background: ${(p) => p.theme.colorPrimary};
        `, children: [_jsxs("div", { className: Styles.infoGroup, children: [_jsx("div", { children: t("satellite.infoGroup") }), _jsx(LocationItem, { position: position })] }), _jsxs("div", { className: Styles.btnGroup, children: [_jsx("button", { className: Styles.btn, onClick: () => this.removeFilter(), children: t("satellite.removeFilter") }), _jsx("button", { className: Styles.btn, onClick: () => this.zoomTo(), children: t("satellite.zoomTo") }), _jsx("button", { className: Styles.btn, onClick: () => this.newLocation(), children: t("satellite.newLocation") })] })] }));
    }
};
Object.defineProperty(SatelliteImageryTimeFilterSection, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        item: PropTypes.object,
        t: PropTypes.func.isRequired
    }
});
SatelliteImageryTimeFilterSection = __decorate([
    observer
], SatelliteImageryTimeFilterSection);
export default withTranslation()(SatelliteImageryTimeFilterSection);
//# sourceMappingURL=SatelliteImageryTimeFilterSection.js.map