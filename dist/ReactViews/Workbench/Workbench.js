var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { action, runInAction, makeObservable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import getPath from "../../Core/getPath";
import Box from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import { TextSpan } from "../../Styled/Text";
import BadgeBar from "../BadgeBar";
import Icon, { StyledIcon } from "../../Styled/Icon";
import WorkbenchList from "./WorkbenchList";
import { Category, DataSourceAction } from "../../Core/AnalyticEvents/analyticEvents";
let Workbench = class Workbench extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this);
    }
    collapseAll() {
        runInAction(() => {
            this.props.terria.workbench.collapseAll();
        });
    }
    expandAll() {
        runInAction(() => {
            this.props.terria.workbench.expandAll();
        });
    }
    removeAll() {
        this.props.terria.workbench.items.forEach((item) => {
            var _a;
            (_a = this.props.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.dataSource, DataSourceAction.removeAllFromWorkbench, getPath(item));
            this.props.terria.removeSelectedFeaturesForModel(item);
        });
        this.props.terria.workbench.removeAll();
        this.props.terria.timelineStack.items.clear();
    }
    render() {
        const { t } = this.props;
        const shouldExpandAll = this.props.terria.workbench.shouldExpandAll;
        return (_jsxs(Box, { column: true, fullWidth: true, styledMinHeight: "0", children: [_jsxs(BadgeBar, { label: t("workbench.label"), badge: this.props.terria.workbench.items.length, children: [_jsxs(RawButton, { onClick: this.removeAll, css: `
              display: flex;
              align-items: center;
              padding: 0 5px;
              svg {
                vertical-align: middle;
                padding-right: 4px;
              }
            `, children: [_jsx(StyledIcon, { glyph: Icon.GLYPHS.remove, light: true, styledWidth: "12px", displayInline: true }), _jsx(TextSpan, { textLight: true, small: true, children: t("workbench.removeAll") })] }), shouldExpandAll ? (_jsx(RawButton, { onClick: this.expandAll, css: `
                display: flex;
                align-items: center;
                padding-left: 5px;
              `, children: _jsx(TextSpan, { textLight: true, small: true, children: t("workbench.expandAll") }) })) : (_jsx(RawButton, { onClick: this.collapseAll, css: `
                display: flex;
                align-items: center;
                padding-left: 5px;
              `, children: _jsx(TextSpan, { textLight: true, small: true, children: t("workbench.collapseAll") }) }))] }), _jsx(WorkbenchList, { viewState: this.props.viewState, terria: this.props.terria })] }));
    }
};
__decorate([
    action.bound
], Workbench.prototype, "collapseAll", null);
__decorate([
    action.bound
], Workbench.prototype, "expandAll", null);
__decorate([
    action.bound
], Workbench.prototype, "removeAll", null);
Workbench = __decorate([
    observer
], Workbench);
export default withTranslation()(Workbench);
//# sourceMappingURL=Workbench.js.map