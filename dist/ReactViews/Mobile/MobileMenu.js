var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import defined from "terriajs-cesium/Source/Core/defined";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import classNames from "classnames";
import MobileMenuItem from "./MobileMenuItem";
import SettingPanel from "../Map/Panels/SettingPanel";
import SharePanel from "../Map/Panels/SharePanel/SharePanel";
import { withTranslation } from "react-i18next";
import Styles from "./mobile-menu.scss";
import { runInAction } from "mobx";
import LangPanel from "../Map/Panels/LangPanel/LangPanel";
import { applyTranslationIfExists } from "../../Language/languageHelpers";
import { Category, HelpAction } from "../../Core/AnalyticEvents/analyticEvents";
let MobileMenu = class MobileMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    toggleMenu() {
        runInAction(() => {
            this.props.viewState.mobileMenuVisible =
                !this.props.viewState.mobileMenuVisible;
        });
    }
    onFeedbackFormClick() {
        runInAction(() => {
            this.props.viewState.feedbackFormIsVisible = true;
            this.props.viewState.mobileMenuVisible = false;
        });
    }
    hideMenu() {
        runInAction(() => {
            this.props.viewState.mobileMenuVisible = false;
        });
    }
    runStories() {
        this.props.viewState.runStories();
    }
    dismissSatelliteGuidanceAction() {
        this.props.viewState.toggleFeaturePrompt("mapGuidesLocation", true, true);
    }
    /**
     * If the help configuration defines an item named `mapuserguide`, this
     * method returns props for showing it in the mobile menu.
     */
    mapUserGuide() {
        const helpItems = this.props.terria.configParameters.helpContent;
        const mapUserGuideItem = helpItems === null || helpItems === void 0 ? void 0 : helpItems.find(({ itemName }) => itemName === "mapuserguide");
        if (!mapUserGuideItem) {
            return undefined;
        }
        const title = applyTranslationIfExists(mapUserGuideItem.title, this.props.i18n);
        return {
            href: mapUserGuideItem.url,
            caption: title,
            onClick: () => {
                var _a;
                (_a = this.props.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.help, HelpAction.itemSelected, title);
            }
        };
    }
    render() {
        var _a;
        const { t } = this.props;
        const hasStories = this.props.terria.configParameters.storyEnabled &&
            defined(this.props.terria.stories) &&
            this.props.terria.stories.length > 0;
        const mapUserGuide = this.mapUserGuide();
        // return this.props.viewState.mobileMenuVisible ? (
        return (_jsxs("div", { children: [this.props.viewState.mobileMenuVisible && (_jsx("div", { className: Styles.overlay, onClick: () => this.toggleMenu() })), _jsxs("div", { className: classNames(Styles.mobileNav, {
                        [Styles.mobileNavHidden]: !this.props.viewState.mobileMenuVisible
                    }), children: [this.props.menuLeftItems.map((menuItem) => (_jsx("div", { onClick: () => this.hideMenu(), children: menuItem }, menuItem ? menuItem.key : undefined))), _jsx("div", { onClick: () => this.hideMenu(), children: _jsx(SettingPanel, { terria: this.props.terria, viewState: this.props.viewState }) }), _jsx("div", { onClick: () => this.hideMenu(), children: _jsx(SharePanel, { terria: this.props.terria, viewState: this.props.viewState }) }), this.props.menuItems.map((menuItem) => (_jsx("div", { onClick: () => this.hideMenu(), children: menuItem }, menuItem ? menuItem.key : undefined))), mapUserGuide && _jsx(MobileMenuItem, { ...mapUserGuide }), this.props.showFeedback && (_jsx(MobileMenuItem, { onClick: () => this.onFeedbackFormClick(), caption: t("feedback.feedbackBtnText") })), hasStories && (_jsx(MobileMenuItem, { onClick: () => this.runStories(), caption: t("story.mobileViewStory", {
                                storiesLength: this.props.terria.stories.length
                            }) })), ((_a = this.props.terria.configParameters.languageConfiguration) === null || _a === void 0 ? void 0 : _a.enabled) && (_jsx("div", { onClick: () => this.hideMenu(), children: _jsx(LangPanel, { terria: this.props.terria, smallScreen: this.props.viewState.useSmallScreenInterface }) }))] })] }));
    }
};
Object.defineProperty(MobileMenu, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        menuItems: PropTypes.arrayOf(PropTypes.element),
        menuLeftItems: PropTypes.arrayOf(PropTypes.element),
        viewState: PropTypes.object.isRequired,
        showFeedback: PropTypes.bool,
        terria: PropTypes.object.isRequired,
        i18n: PropTypes.object,
        allBaseMaps: PropTypes.array.isRequired,
        t: PropTypes.func.isRequired
    }
});
Object.defineProperty(MobileMenu, "defaultProps", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        menuItems: [],
        showFeedback: false
    }
});
MobileMenu = __decorate([
    observer
], MobileMenu);
export default withTranslation()(MobileMenu);
//# sourceMappingURL=MobileMenu.js.map