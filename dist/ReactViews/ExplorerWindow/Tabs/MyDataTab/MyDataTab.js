var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { observer } from "mobx-react";
import classNames from "classnames";
import Icon from "../../../../Styled/Icon";
import Box from "../../../../Styled/Box";
import PropTypes from "prop-types";
import DataPreview from "../../../Preview/DataPreview.jsx";
import AddData from "./AddData.jsx";
import { withTranslation, Trans } from "react-i18next";
import Styles from "./my-data-tab.scss";
import DataCatalogMember from "../../../DataCatalog/DataCatalogMember";
// My data tab include Add data section and preview section
let MyDataTab = class MyDataTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: null
        };
    }
    hasUserAddedData() {
        return this.props.terria.catalog.userAddedDataGroup.members.length > 0;
    }
    changeTab(active) {
        this.setState({
            activeTab: active
        });
    }
    resetTab() {
        this.setState({
            activeTab: null
        });
    }
    renderTabs() {
        const { t } = this.props;
        const tabs = [
            {
                id: "local",
                caption: t("addData.localTitle")
            },
            {
                id: "web",
                caption: t("addData.webTitle")
            }
        ];
        return (_jsx("ul", { className: Styles.tabList, children: tabs.map((tab) => (_jsx("li", { className: Styles.tabListItem, children: _jsxs("button", { type: "button", onClick: () => this.changeTab(tab.id), title: tab.caption, className: classNames(Styles.tabListBtn, {
                        [Styles.isActive]: this.state.activeTab === tab.id
                    }), css: `
                color: ${(p) => p.theme.colorPrimary};
                &:hover,
                &:focus {
                  color: ${(p) => p.theme.grey};
                }
                svg {
                  fill: ${(p) => p.theme.colorPrimary};
                }
              `, children: [_jsx(Icon, { glyph: Icon.GLYPHS[tab.id] }), tab.caption] }) }, tab.id))) }));
    }
    renderPromptBox() {
        if (this.hasUserAddedData()) {
            const { t } = this.props;
            return (_jsx("div", { className: Styles.dataTypeTab, children: _jsxs("div", { className: Styles.dndBox, children: [_jsx(Icon, { glyph: Icon.GLYPHS.upload }), t("addData.dragDrop")] }) }));
        }
        return (_jsxs("div", { className: Styles.dataTypeTab, children: [_jsxs("div", { className: Styles.dndBoxInfo, children: [_jsxs(Trans, { i18nKey: "addData.infoText", children: [_jsx("div", { children: "Drag and drop a file here to view it locally on the map" }), _jsx("div", { children: "(it won\u2019t be saved or uploaded to the internet)" })] }), _jsx("div", { className: Styles.tabCenter, children: this.renderTabs() })] }), _jsx("div", { className: Styles.dndBox, children: _jsx(Icon, { glyph: Icon.GLYPHS.upload }) })] }));
    }
    render() {
        const showTwoColumn = !!(this.hasUserAddedData() && !this.state.activeTab);
        const { t, className } = this.props;
        return (_jsxs(Box, { className: classNames(Styles.root, {
                [className]: className !== undefined
            }), children: [_jsxs("div", { className: classNames({
                        [Styles.leftCol]: showTwoColumn,
                        [Styles.oneCol]: !showTwoColumn
                    }), children: [this.state.activeTab && (_jsxs(_Fragment, { children: [_jsxs("button", { type: "button", onClick: () => this.resetTab(), className: Styles.btnBackToMyData, css: `
                  color: ${(p) => p.theme.colorPrimary};
                  &:hover,
                  &:focus {
                    border: 1px solid ${(p) => p.theme.colorPrimary};
                  }
                  svg {
                    fill: ${(p) => p.theme.colorPrimary};
                  }
                `, children: [_jsx(Icon, { glyph: Icon.GLYPHS.left }), t("addData.back")] }), _jsx(AddData, { terria: this.props.terria, viewState: this.props.viewState, activeTab: this.state.activeTab, resetTab: () => this.resetTab(), onFileAddFinished: this.props.onFileAddFinished, onUrlAddFinished: this.props.onUrlAddFinished, localDataTypes: this.props.localDataTypes, remoteDataTypes: this.props.remoteDataTypes })] })), showTwoColumn && (_jsxs(Box, { flexShrinkZero: true, column: true, children: [_jsx("p", { className: Styles.explanation, children: _jsxs(Trans, { i18nKey: "addData.note", children: [_jsx("strong", { children: "Note: " }), "Data added in this way is not saved or made visible to others."] }) }), _jsx("div", { className: Styles.tabLeft, children: this.renderTabs() }), _jsx("ul", { className: Styles.dataCatalog, children: this.props.terria.catalog.userAddedDataGroup.memberModels.map((item) => (_jsx(DataCatalogMember, { viewState: this.props.viewState, member: item, removable: true, terria: this.props.terria, isTopLevel: true }, item.uniqueId))) })] })), !this.state.activeTab && this.renderPromptBox()] }), showTwoColumn && (_jsx(Box, { styledWidth: "60%", children: _jsx(DataPreview, { terria: this.props.terria, viewState: this.props.viewState, previewed: this.props.viewState.userDataPreviewedItem }) }))] }));
    }
};
Object.defineProperty(MyDataTab, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object,
        viewState: PropTypes.object,
        onFileAddFinished: PropTypes.func.isRequired,
        onUrlAddFinished: PropTypes.func.isRequired,
        localDataTypes: PropTypes.arrayOf(PropTypes.object),
        remoteDataTypes: PropTypes.arrayOf(PropTypes.object),
        className: PropTypes.string,
        t: PropTypes.func.isRequired
    }
});
MyDataTab = __decorate([
    observer
], MyDataTab);
module.exports = withTranslation()(MyDataTab);
//# sourceMappingURL=MyDataTab.js.map