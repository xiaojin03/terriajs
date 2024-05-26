var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from "classnames";
import { isEmpty, merge } from "lodash-es";
import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx";
import { observer } from "mobx-react";
import Mustache from "mustache";
import React from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import TerriaError from "../../Core/TerriaError";
import filterOutUndefined from "../../Core/filterOutUndefined";
import isDefined from "../../Core/isDefined";
import { getName } from "../../ModelMixins/CatalogMemberMixin";
import DiscretelyTimeVaryingMixin from "../../ModelMixins/DiscretelyTimeVaryingMixin";
import MappableMixin from "../../ModelMixins/MappableMixin";
import TimeVarying from "../../ModelMixins/TimeVarying";
import FeatureInfoContext from "../../Models/Feature/FeatureInfoContext";
import Icon from "../../Styled/Icon";
import { withViewState } from "../Context";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import FeatureInfoDownload from "./FeatureInfoDownload";
import FeatureInfoPanelButton from "./FeatureInfoPanelButton";
import Styles from "./feature-info-section.scss";
import { generateCesiumInfoHTMLFromProperties } from "./generateCesiumInfoHTMLFromProperties";
import getFeatureProperties from "./getFeatureProperties";
import { mustacheFormatDateTime, mustacheFormatNumberFunction, mustacheRenderPartialByName, mustacheURLEncodeText, mustacheURLEncodeTextComponent } from "./mustacheExpressions";
// We use Mustache templates inside React views, where React does the escaping; don't escape twice, or eg. " => &quot;
Mustache.escape = function (string) {
    return string;
};
let FeatureInfoSection = class FeatureInfoSection extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "templateReactionDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "removeFeatureChangedSubscription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Rendered feature info template - this is set using reaction.
         * We can't use `@computed` values for custom templates - as CustomComponents may cause side-effects.
         * For example
         * - A CsvChartCustomComponent will create a new CsvCatalogItem and set traits
         * See `rawDataReactNode` for rendered raw data
         */
        Object.defineProperty(this, "templatedFeatureInfoReactNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "noInfoRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "showRawData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /** See `setFeatureChangedCounter` */
        Object.defineProperty(this, "featureChangedCounter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        makeObservable(this);
    }
    componentDidMount() {
        this.templateReactionDisposer = reaction(() => [
            this.props.feature,
            this.props.catalogItem.featureInfoTemplate.template,
            this.props.catalogItem.featureInfoTemplate.partials,
            // Note `mustacheContextData` will trigger update when `currentTime` changes (through this.featureProperties)
            this.mustacheContextData
        ], () => {
            if (this.props.catalogItem.featureInfoTemplate.template &&
                this.mustacheContextData) {
                this.templatedFeatureInfoReactNode = parseCustomMarkdownToReact(Mustache.render(this.props.catalogItem.featureInfoTemplate.template, this.mustacheContextData, this.props.catalogItem.featureInfoTemplate.partials), this.parseMarkdownContextData);
            }
            else {
                this.templatedFeatureInfoReactNode = undefined;
            }
        }, { fireImmediately: true });
        this.setFeatureChangedCounter(this.props.feature);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.feature !== this.props.feature) {
            this.setFeatureChangedCounter(this.props.feature);
        }
    }
    /** Dispose of reaction and cesium feature change event listener */
    componentWillUnmount() {
        var _a, _b;
        (_a = this.templateReactionDisposer) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = this.removeFeatureChangedSubscription) === null || _b === void 0 ? void 0 : _b.call(this);
    }
    /**
     * We need to force `featureProperties` to re-compute when Cesium Feature properties change.
     * We use `featureChangedCounter` and increment it every change
     */
    setFeatureChangedCounter(feature) {
        var _a;
        (_a = this.removeFeatureChangedSubscription) === null || _a === void 0 ? void 0 : _a.call(this);
        this.removeFeatureChangedSubscription =
            feature.definitionChanged.addEventListener(((changedFeature) => {
                runInAction(() => {
                    this.featureChangedCounter++;
                });
            }).bind(this));
    }
    get currentTimeIfAvailable() {
        return TimeVarying.is(this.props.catalogItem)
            ? this.props.catalogItem.currentTimeAsJulianDate
            : undefined;
    }
    get featureProperties() {
        var _a;
        // Force computed to re-calculate when cesium feature properties change
        this.featureChangedCounter;
        return getFeatureProperties(this.props.feature, (_a = this.currentTimeIfAvailable) !== null && _a !== void 0 ? _a : JulianDate.now(), MappableMixin.isMixedInto(this.props.catalogItem) &&
            this.props.catalogItem.featureInfoTemplate.formats
            ? this.props.catalogItem.featureInfoTemplate.formats
            : undefined);
    }
    /** This monstrosity contains properties which can be used by Mustache templates:
     * - All feature properties
     * - `properties` = array of key:value from feature properties
     * - `terria` magical object
     *     - a bunch of custom mustache expressions
     *       - `partialByName`
     *       - `formatNumber`
     *       - `formatDateTime`
     *       - `urlEncodeComponent`
     *       - `urlEncode`
     *     - `coords` with `latitude` and `longitude`
     *     - `currentTime`
     *     - `rawDataTable` contains markdown table
     *  - properties provided by catalog item through `featureInfoContext` function
     */
    get mustacheContextData() {
        var _a, _b, _c;
        const propertyValues = Object.assign({}, this.featureProperties);
        // Properties accessible as {name, value} array; useful when you want
        // to iterate anonymous property values in the mustache template.
        const properties = Object.entries(propertyValues).map(([name, value]) => ({
            name,
            value
        }));
        const propertyData = {
            ...propertyValues,
            properties,
            feature: this.props.feature
        };
        const terria = {
            partialByName: mustacheRenderPartialByName((_b = (_a = this.props.catalogItem.featureInfoTemplate) === null || _a === void 0 ? void 0 : _a.partials) !== null && _b !== void 0 ? _b : {}, propertyData),
            formatNumber: mustacheFormatNumberFunction,
            formatDateTime: mustacheFormatDateTime,
            urlEncodeComponent: mustacheURLEncodeTextComponent,
            urlEncode: mustacheURLEncodeText,
            rawDataTable: this.rawDataMarkdown
        };
        if (this.props.position) {
            const latLngInRadians = Ellipsoid.WGS84.cartesianToCartographic(this.props.position);
            terria.coords = {
                latitude: CesiumMath.toDegrees(latLngInRadians.latitude),
                longitude: CesiumMath.toDegrees(latLngInRadians.longitude)
            };
        }
        // Add currentTime property
        // if discrete - use current discrete time
        // otherwise - use current (continuous) time
        if (DiscretelyTimeVaryingMixin.isMixedInto(this.props.catalogItem) &&
            this.props.catalogItem.currentDiscreteJulianDate) {
            terria.currentTime = JulianDate.toDate(this.props.catalogItem.currentDiscreteJulianDate);
        }
        else if (TimeVarying.is(this.props.catalogItem) &&
            this.props.catalogItem.currentTimeAsJulianDate) {
            terria.currentTime = JulianDate.toDate(this.props.catalogItem.currentTimeAsJulianDate);
        }
        // If catalog item has featureInfoContext function
        // Merge it into other properties
        if (FeatureInfoContext.is(this.props.catalogItem)) {
            return merge({ ...propertyData, terria }, (_c = this.props.catalogItem.featureInfoContext(this.props.feature)) !== null && _c !== void 0 ? _c : {});
        }
        return { ...propertyData, terria };
    }
    clickHeader() {
        if (isDefined(this.props.onClickHeader)) {
            this.props.onClickHeader(this.props.feature);
        }
    }
    /** Context object passed into "parseCustomMarkdownToReact"
     * These will get passed to CustomComponents (eg CsvChartCustomComponent)
     */
    get parseMarkdownContextData() {
        return {
            terria: this.props.viewState.terria,
            catalogItem: this.props.catalogItem,
            feature: this.props.feature
        };
    }
    /** Get raw data table as markdown string
     *
     * Will use feature.description if defined
     * Otherwise, will generate cesium info HTML table from feature properties
     */
    get rawDataMarkdown() {
        var _a, _b;
        const feature = this.props.feature;
        const currentTime = (_a = this.currentTimeIfAvailable) !== null && _a !== void 0 ? _a : JulianDate.now();
        const description = (_b = feature.description) === null || _b === void 0 ? void 0 : _b.getValue(currentTime);
        if (isDefined(description))
            return description;
        if (isDefined(feature.properties)) {
            return generateCesiumInfoHTMLFromProperties(feature.properties, currentTime, MappableMixin.isMixedInto(this.props.catalogItem)
                ? this.props.catalogItem.showStringIfPropertyValueIsNull
                : undefined);
        }
    }
    /** Get Raw data as ReactNode.
     * Note: this can be computed - as no custom components are used which cause side-effects (eg CSVChartCustomComponent)
     * See `templatedFeatureInfoReactNode` for rendered feature info template
     */
    get rawFeatureInfoReactNode() {
        if (this.rawDataMarkdown)
            return parseCustomMarkdownToReact(this.rawDataMarkdown, this.parseMarkdownContextData);
    }
    toggleRawData() {
        this.showRawData = !this.showRawData;
    }
    get downloadableData() {
        let fileName = getName(this.props.catalogItem);
        // Add the Lat, Lon to the baseFilename if it is possible and not already present.
        if (this.props.position) {
            const position = Ellipsoid.WGS84.cartesianToCartographic(this.props.position);
            const latitude = CesiumMath.toDegrees(position.latitude);
            const longitude = CesiumMath.toDegrees(position.longitude);
            const precision = 5;
            // Check that baseFilename doesn't already contain the lat, lon with the similar or better precision.
            if (!contains(fileName, latitude, precision) ||
                !contains(fileName, longitude, precision)) {
                fileName +=
                    " - Lat " +
                        latitude.toFixed(precision) +
                        " Lon " +
                        longitude.toFixed(precision);
            }
        }
        return {
            data: this.featureProperties && !isEmpty(this.featureProperties)
                ? this.featureProperties
                : undefined,
            fileName
        };
    }
    get generatedButtons() {
        const { feature, catalogItem } = this.props;
        const buttons = filterOutUndefined(this.props.viewState.featureInfoPanelButtonGenerators.map((generator) => {
            try {
                const dim = generator({ feature, item: catalogItem });
                return dim;
            }
            catch (error) {
                TerriaError.from(error).log();
            }
        }));
        return buttons;
    }
    renderButtons() {
        const { t } = this.props;
        return (_jsxs(ButtonsContainer, { children: [!this.props.printView && this.templatedFeatureInfoReactNode && (_jsx(FeatureInfoPanelButton, { onClick: this.toggleRawData.bind(this), text: this.showRawData
                        ? t("featureInfo.showCuratedData")
                        : t("featureInfo.showRawData") })), this.generatedButtons.map((button, i) => (_jsx(FeatureInfoPanelButton, { ...button }, i)))] }));
    }
    render() {
        var _a;
        const { t } = this.props;
        let title;
        if (this.props.catalogItem.featureInfoTemplate.name) {
            title = Mustache.render(this.props.catalogItem.featureInfoTemplate.name, this.mustacheContextData, this.props.catalogItem.featureInfoTemplate.partials);
        }
        else
            title =
                getName(this.props.catalogItem) +
                    " - " +
                    (this.props.feature.name || this.props.t("featureInfo.siteData"));
        /** Show feature info download if showing raw data - or showing template and `showFeatureInfoDownloadWithTemplate` is true
         */
        const showFeatureInfoDownload = this.showRawData ||
            !this.templatedFeatureInfoReactNode ||
            (this.templatedFeatureInfoReactNode &&
                this.props.catalogItem.featureInfoTemplate
                    .showFeatureInfoDownloadWithTemplate);
        const titleElement = this.props.printView ? (_jsx("h2", { children: title })) : (_jsxs("button", { type: "button", onClick: this.clickHeader.bind(this), className: Styles.title, children: [_jsx("span", { children: title }), this.props.isOpen ? (_jsx(Icon, { glyph: Icon.GLYPHS.opened })) : (_jsx(Icon, { glyph: Icon.GLYPHS.closed }))] }));
        // If feature is unavailable (or not showing) - show no info message
        if (!this.props.feature.isAvailable((_a = this.currentTimeIfAvailable) !== null && _a !== void 0 ? _a : JulianDate.now()) ||
            !this.props.feature.isShowing) {
            return (_jsxs("li", { className: classNames(Styles.section), children: [titleElement, this.props.isOpen ? (_jsx("section", { className: Styles.content, children: _jsx("div", { ref: (r) => {
                                this.noInfoRef = r;
                            }, children: t("featureInfo.noInfoAvailable") }, "no-info") })) : null] }));
        }
        return (_jsxs("li", { className: classNames(Styles.section), children: [titleElement, this.props.isOpen ? (_jsxs("section", { className: Styles.content, children: [this.renderButtons(), _jsxs("div", { children: [this.props.feature.loadingFeatureInfoUrl ? ("Loading") : this.showRawData || !this.templatedFeatureInfoReactNode ? (this.rawFeatureInfoReactNode ? (this.rawFeatureInfoReactNode) : (_jsx("div", { ref: (r) => {
                                        this.noInfoRef = r;
                                    }, children: t("featureInfo.noInfoAvailable") }, "no-info"))) : (
                                // Show templated feature info
                                this.templatedFeatureInfoReactNode), 
                                // Show FeatureInfoDownload
                                !this.props.printView &&
                                    showFeatureInfoDownload &&
                                    isDefined(this.downloadableData.data) ? (_jsx(FeatureInfoDownload, { data: this.downloadableData.data, name: this.downloadableData.fileName }, "download")) : null] })] })) : null] }));
    }
};
__decorate([
    observable.ref
], FeatureInfoSection.prototype, "templatedFeatureInfoReactNode", void 0);
__decorate([
    observable
], FeatureInfoSection.prototype, "showRawData", void 0);
__decorate([
    observable
], FeatureInfoSection.prototype, "featureChangedCounter", void 0);
__decorate([
    action
], FeatureInfoSection.prototype, "setFeatureChangedCounter", null);
__decorate([
    computed
], FeatureInfoSection.prototype, "currentTimeIfAvailable", null);
__decorate([
    computed
], FeatureInfoSection.prototype, "featureProperties", null);
__decorate([
    computed
], FeatureInfoSection.prototype, "mustacheContextData", null);
__decorate([
    computed
], FeatureInfoSection.prototype, "parseMarkdownContextData", null);
__decorate([
    computed
], FeatureInfoSection.prototype, "rawDataMarkdown", null);
__decorate([
    computed
], FeatureInfoSection.prototype, "rawFeatureInfoReactNode", null);
__decorate([
    action
], FeatureInfoSection.prototype, "toggleRawData", null);
__decorate([
    computed
], FeatureInfoSection.prototype, "downloadableData", null);
__decorate([
    computed
], FeatureInfoSection.prototype, "generatedButtons", null);
FeatureInfoSection = __decorate([
    observer
], FeatureInfoSection);
export { FeatureInfoSection };
// See if text contains the number (to a precision number of digits (after the dp) either fixed up or down on the last digit).
function contains(text, number, precision) {
    // Take Math.ceil or Math.floor and use it to calculate the number with a precision number of digits (after the dp).
    function fixed(round, number) {
        const scale = Math.pow(10, precision);
        return (round(number * scale) / scale).toFixed(precision);
    }
    return (text.indexOf(fixed(Math.floor, number)) !== -1 ||
        text.indexOf(fixed(Math.ceil, number)) !== -1);
}
const ButtonsContainer = styled.div `
  display: flex;
  justify-content: flex-end;
  padding: 7px 0 10px 0;
`;
export default withTranslation()(withViewState(FeatureInfoSection));
//# sourceMappingURL=FeatureInfoSection.js.map