var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import { Category, HelpAction } from "../../../../Core/AnalyticEvents/analyticEvents";
import Box from "../../../../Styled/Box";
import Button, { RawButton } from "../../../../Styled/Button";
import Icon, { StyledIcon } from "../../../../Styled/Icon";
import Spacing from "../../../../Styled/Spacing";
import Text from "../../../../Styled/Text";
import parseCustomMarkdownToReact from "../../../Custom/parseCustomMarkdownToReact";
import { withViewState } from "../../../Context";
import HelpPanelItem from "./HelpPanelItem";
export const HELP_PANEL_ID = "help";
let HelpPanel = class HelpPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAnimatingOpen: true
        };
    }
    componentDidMount() {
        // The animation timing is controlled in the CSS so the timeout can be 0 here.
        setTimeout(() => this.setState({ isAnimatingOpen: false }), 0);
    }
    componentWillUnmount() {
        // Make sure that retainSharePanel is set to false. This property is used to temporarily disable closing when Share Panel loses focus.
        // If the Share Panel is open underneath help panel, we now want to allow it to close normally.
        setTimeout(() => {
            this.props.viewState.setRetainSharePanel(false);
        }, 500); // We need to re-enable closing of share panel when loses focus.
    }
    render() {
        const { t } = this.props;
        const helpItems = this.props.viewState.terria.configParameters.helpContent;
        const isExpanded = this.props.viewState.helpPanelExpanded;
        const isAnimatingOpen = this.state.isAnimatingOpen;
        return (_jsxs(Box, { displayInlineBlock: true, backgroundColor: this.props.theme.textLight, styledWidth: "320px", fullHeight: true, onClick: () => this.props.viewState.setTopElement("HelpPanel"), css: `
          position: fixed;
          z-index: ${this.props.viewState.topElement === "HelpPanel"
                ? 99999
                : 110};
          transition: right 0.25s;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          right: ${isAnimatingOpen ? -320 : isExpanded ? 490 : 0}px;
        `, children: [_jsx(Box, { position: "absolute", paddedRatio: 3, topRight: true, children: _jsx(RawButton, { onClick: () => this.props.viewState.hideHelpPanel(), children: _jsx(StyledIcon, { styledWidth: "16px", fillColor: this.props.theme.textDark, opacity: "0.5", glyph: Icon.GLYPHS.closeLight }) }) }), _jsxs(Box, { centered: true, paddedHorizontally: 5, paddedVertically: 17, displayInlineBlock: true, css: `
            direction: ltr;
            min-width: 295px;
            padding-bottom: 0px;
          `, children: [_jsx(Text, { extraBold: true, heading: true, textDark: true, children: t("helpPanel.menuPaneTitle") }), _jsx(Spacing, { bottom: 4 }), _jsx(Text, { medium: true, textDark: true, highlightLinks: true, children: parseCustomMarkdownToReact(t("helpPanel.menuPaneBody", {
                                supportEmail: this.props.viewState.terria.supportEmail
                            })) }), _jsx(Spacing, { bottom: 5 }), _jsx(Box, { centered: true, children: _jsx(Button, { primary: true, rounded: true, styledMinWidth: "240px", onClick: () => {
                                    var _a;
                                    (_a = this.props.viewState.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.help, HelpAction.takeTour);
                                    runInAction(() => {
                                        this.props.viewState.hideHelpPanel();
                                        this.props.viewState.setTourIndex(0);
                                    });
                                }, renderIcon: () => (_jsx(StyledIcon, { light: true, styledWidth: "18px", glyph: Icon.GLYPHS.tour })), textProps: {
                                    large: true
                                }, css: `
                ${(p) => p.theme.addTerriaPrimaryBtnStyles(p)}
              `, children: t("helpPanel.takeTour") }) })] }), _jsx(Spacing, { bottom: 10 }), _jsx(Box, { centered: true, displayInlineBlock: true, fullWidth: true, styledPadding: "0 26px", children: helpItems &&
                        helpItems.map((item, i) => (_jsx(HelpPanelItem, { terria: this.props.viewState.terria, viewState: this.props.viewState, content: item }, i))) })] }));
    }
};
Object.defineProperty(HelpPanel, "displayName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "HelpPanel"
});
Object.defineProperty(HelpPanel, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        viewState: PropTypes.object.isRequired,
        theme: PropTypes.object,
        t: PropTypes.func.isRequired
    }
});
HelpPanel = __decorate([
    observer
], HelpPanel);
export default withTranslation()(withViewState(withTheme(HelpPanel)));
//# sourceMappingURL=HelpPanel.js.map