var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from "classnames";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import Box from "../../Styled/Box";
import Icon from "../../Styled/Icon";
import DataCatalog from "../DataCatalog/DataCatalog";
import DataPreview from "../Preview/DataPreview";
import WorkbenchList from "../Workbench/WorkbenchList";
import Styles from "./mobile-modal-window.scss";
import MobileSearch from "./MobileSearch";
let MobileModalWindow = class MobileModalWindow extends React.Component {
    renderModalContent() {
        const viewState = this.props.viewState;
        const searchState = viewState.searchState;
        if (viewState.mobileView !== viewState.mobileViewOptions.data &&
            viewState.mobileView !== viewState.mobileViewOptions.preview &&
            searchState.showMobileLocationSearch &&
            searchState.locationSearchText.length > 0) {
            return (_jsx(MobileSearch, { terria: this.props.terria, viewState: this.props.viewState }));
        }
        switch (viewState.mobileView) {
            case viewState.mobileViewOptions.data:
                // No multiple catalogue tabs in mobile
                return (_jsx(DataCatalog, { terria: this.props.terria, viewState: this.props.viewState, items: this.props.terria.catalog.group.memberModels }));
            case viewState.mobileViewOptions.preview:
                return (_jsx(DataPreview, { terria: this.props.terria, viewState: this.props.viewState, previewed: this.props.viewState.previewedItem }));
            case viewState.mobileViewOptions.nowViewing:
                return (_jsx(WorkbenchList, { viewState: this.props.viewState, terria: this.props.terria }));
            default:
                return null;
        }
    }
    onClearMobileUI() {
        runInAction(() => {
            this.props.viewState.switchMobileView(null);
            this.props.viewState.explorerPanelIsVisible = false;
            this.props.viewState.searchState.showMobileLocationSearch = false;
            this.props.viewState.searchState.showMobileCatalogSearch = false;
            this.props.viewState.searchState.catalogSearchText = "";
        });
    }
    /* eslint-disable-next-line camelcase */
    UNSAFE_componentWillReceiveProps() {
        const numItems = this.props.terria.workbench.items.length;
        if ((numItems === undefined || numItems === 0) &&
            this.props.viewState.mobileView ===
                this.props.viewState.mobileViewOptions.nowViewing) {
            runInAction(() => {
                this.props.viewState.switchMobileView(null);
                this.props.viewState.explorerPanelIsVisible = false;
            });
        }
    }
    goBack() {
        this.props.viewState.switchMobileView(this.props.viewState.mobileViewOptions.data);
    }
    render() {
        const modalClass = classNames(Styles.mobileModal, {
            [Styles.isOpen]: this.props.viewState.explorerPanelIsVisible &&
                this.props.viewState.mobileView
        });
        const mobileView = this.props.viewState.mobileView;
        const { t } = this.props;
        return (_jsx("div", { className: modalClass, children: _jsxs(Box, { column: true, className: Styles.modalBg, children: [_jsxs("div", { className: Styles.modalTop, children: [this.props.viewState.explorerPanelIsVisible && mobileView && (_jsx("button", { type: "button", className: Styles.doneButton, onClick: () => this.onClearMobileUI(), children: t("mobile.doneBtnText") })), _jsx("button", { type: "button", disabled: mobileView !== this.props.viewState.mobileViewOptions.preview, className: classNames(Styles.backButton, {
                                    [Styles.backButtonInactive]: mobileView !== this.props.viewState.mobileViewOptions.preview
                                }), onClick: () => this.goBack(), children: _jsx(Icon, { className: Styles.iconBack, glyph: Icon.GLYPHS.left }) })] }), this.renderModalContent()] }) }));
    }
};
Object.defineProperty(MobileModalWindow, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object,
        viewState: PropTypes.object.isRequired,
        t: PropTypes.func.isRequired
    }
});
MobileModalWindow = __decorate([
    observer
], MobileModalWindow);
module.exports = withTranslation()(MobileModalWindow);
//# sourceMappingURL=MobileModalWindow.js.map