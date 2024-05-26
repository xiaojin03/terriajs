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
import styled from "styled-components";
import defined from "terriajs-cesium/Source/Core/defined";
import MappableMixin from "../../ModelMixins/MappableMixin";
import Styles from "./tabs.scss";
import DataCatalogTab from "./Tabs/DataCatalogTab";
import MyDataTab from "./Tabs/MyDataTab/MyDataTab";
let Tabs = class Tabs extends React.Component {
    async onFileAddFinished(files) {
        const file = files.find((f) => MappableMixin.isMixedInto(f));
        if (file) {
            const result = await this.props.viewState.viewCatalogMember(file);
            if (result.error) {
                result.raiseError(this.props.terria);
            }
            else {
                if (!file.disableZoomTo) {
                    this.props.terria.currentViewer.zoomTo(file, 1);
                }
            }
        }
        this.props.viewState.myDataIsUploadView = false;
    }
    async onUrlAddFinished() {
        this.props.viewState.openAddData();
    }
    getTabs() {
        const { t } = this.props;
        // This can be passed in as prop
        if (this.props.tabs) {
            return this.props.tabs;
        }
        const myDataTab = {
            title: "my-data",
            name: t("addData.myData"),
            category: "my-data",
            panel: (_jsx(MyDataTab, { terria: this.props.terria, viewState: this.props.viewState, onFileAddFinished: (files) => this.onFileAddFinished(files), onUrlAddFinished: () => this.onUrlAddFinished() }))
        };
        if (this.props.terria.configParameters.tabbedCatalog) {
            return [].concat(this.props.terria.catalog.group.memberModels
                .filter((member) => member !== this.props.terria.catalog.userAddedDataGroup)
                .map((member, i) => ({
                name: member.nameInCatalog,
                title: `data-catalog-${member.name}`,
                category: "data-catalog",
                idInCategory: member.uniqueId,
                panel: (_jsx(DataCatalogTab, { terria: this.props.terria, viewState: this.props.viewState, items: member.memberModels || [member], searchPlaceholder: t("addData.searchPlaceholderWhole") }))
            })), [myDataTab]);
        }
        else {
            return [
                {
                    name: t("addData.dataCatalogue"),
                    title: "data-catalog",
                    category: "data-catalog",
                    panel: (_jsx(DataCatalogTab, { terria: this.props.terria, viewState: this.props.viewState, items: this.props.terria.catalog.group.memberModels, searchPlaceholder: t("addData.searchPlaceholder") }))
                },
                myDataTab
            ];
        }
    }
    async activateTab(category, idInCategory) {
        runInAction(() => {
            this.props.viewState.activeTabCategory = category;
            if (this.props.terria.configParameters.tabbedCatalog) {
                this.props.viewState.activeTabIdInCategory = idInCategory;
                if (category === "data-catalog") {
                    const member = this.props.terria.catalog.group.memberModels.filter((m) => m.uniqueId === idInCategory)[0];
                    // If member was found and member can be opened, open it (causes CkanCatalogGroups to fetch etc.)
                    if (defined(member)) {
                        this.props.viewState
                            .viewCatalogMember(member)
                            .then((result) => result.raiseError(this.props.viewState.terria));
                    }
                }
            }
        });
    }
    render() {
        const tabs = this.getTabs();
        const sameCategory = tabs.filter((t) => t.category === this.props.viewState.activeTabCategory);
        const currentTab = sameCategory.filter((t) => t.idInCategory === this.props.viewState.activeTabIdInCategory)[0] ||
            sameCategory[0] ||
            tabs[0];
        return (_jsxs("div", { className: Styles.tabs, children: [_jsx("ul", { className: Styles.tabList, role: "tablist", css: `
            background-color: ${(p) => p.theme.colorPrimary};
          `, children: tabs.map((item, i) => (_jsx("li", { id: "tablist--" + item.title, className: Styles.tabListItem, role: "tab", "aria-controls": "panel--" + item.title, "aria-selected": item === currentTab, children: _jsx(ButtonTab, { type: "button", onClick: this.activateTab.bind(this, item.category, item.idInCategory), className: classNames(Styles.btnTab, {
                                [Styles.btnSelected]: item === currentTab
                            }), isCurrent: item === currentTab, children: item.name }) }, i))) }), _jsx("section", { id: "panel--" + currentTab.title, className: classNames(Styles.tabPanel, Styles.isActive), "aria-labelledby": "tablist--" + currentTab.title, role: "tabpanel", tabIndex: "0", children: _jsx("div", { className: Styles.panelContent, children: currentTab.panel }) }, currentTab.title)] }));
    }
};
Object.defineProperty(Tabs, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        tabs: PropTypes.array,
        t: PropTypes.func.isRequired
    }
});
Tabs = __decorate([
    observer
], Tabs);
const ButtonTab = styled.button `
  ${(props) => `
    background: transparent;
    color: ${props.theme.textLight};
    &:hover,
    &:focus {
      background: ${props.theme.textLight};
      color: ${props.theme.colorPrimary};
    }
    ${props.isCurrent &&
    `
      background: ${props.theme.textLight};
      color: ${props.theme.colorPrimary};
    `}

  `}
`;
export default withTranslation()(Tabs);
//# sourceMappingURL=Tabs.js.map