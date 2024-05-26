var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
// if we must use a placeholder image,
// do not bundle in the full res `wwwroot/images/bing-aerial-labels-wide.png`
// image as it's a 1.4mb png
// import bingAerialBackground from "../../wwwroot/images/bing-aerial-labels-wide-low-quality.jpg";
import styled, { withTheme } from "styled-components";
import Box from "../Styled/Box";
import Button from "../Styled/Button";
import Spacing from "../Styled/Spacing";
import Text from "../Styled/Text";
import parseCustomMarkdownToReact from "./Custom/parseCustomMarkdownToReact";
import { withViewState } from "./Context";
import FadeIn from "./Transitions/FadeIn/FadeIn";
const TopElementBox = styled(Box) `
  z-index: 99999;
  top: 0;
  right: 0;
`;
// background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
//   url(${bingAerialBackground});
const BackgroundImage = styled(Box) `
  background: rgba(0, 0, 0, 0.75);
  // background-size: cover;
  // background-repeat: no-repeat;
  // background-position: center;
  // filter: blur(10px);
  z-index: 0;
`;
const DisclaimerButton = styled(Button).attrs({
    textProps: {
        semiBold: true
    },
    rounded: true
}) `
  width: ${(props) => (props.fullWidth ? "100%" : "280px")};
`;
let Disclaimer = class Disclaimer extends React.Component {
    constructor(props) {
        super(props);
    }
    confirm(confirmCallbackFn) {
        if (confirmCallbackFn) {
            confirmCallbackFn();
        }
        this.props.viewState.hideDisclaimer();
    }
    deny(denyCallbackFn) {
        if (denyCallbackFn) {
            denyCallbackFn();
        }
        // Otherwise, do nothing for now?
    }
    render() {
        const disclaimer = this.props.viewState.disclaimerSettings;
        const disclaimerTitle = (disclaimer === null || disclaimer === void 0 ? void 0 : disclaimer.title) || "Disclaimer";
        const disclaimerConfirm = (disclaimer === null || disclaimer === void 0 ? void 0 : disclaimer.confirmText) || "Ok";
        const disclaimerDeny = (disclaimer === null || disclaimer === void 0 ? void 0 : disclaimer.denyText) || "Cancel";
        const disclaimerMessage = (disclaimer === null || disclaimer === void 0 ? void 0 : disclaimer.message) || "Disclaimer text goes here";
        const useSmallScreenInterface = this.props.viewState.useSmallScreenInterface;
        const renderDenyButton = !!(disclaimer === null || disclaimer === void 0 ? void 0 : disclaimer.denyAction);
        return disclaimer ? (_jsx(FadeIn, { isVisible: this.props.viewState.disclaimerVisible, children: _jsxs(TopElementBox, { position: "absolute", fullWidth: true, fullHeight: true, centered: true, children: [_jsx(BackgroundImage
                    // // Make the image slightly larger to deal with
                    // // image shrinking a tad bit when blurred
                    // styledWidth={"110%"}
                    // styledHeight={"110%"}
                    , { 
                        // // Make the image slightly larger to deal with
                        // // image shrinking a tad bit when blurred
                        // styledWidth={"110%"}
                        // styledHeight={"110%"}
                        fullWidth: true, fullHeight: true, position: "absolute" }), _jsxs(Box, { displayInlineBlock: true, left: true, styledWidth: useSmallScreenInterface ? "100%" : "613px", paddedRatio: 4, scroll: true, css: `
              max-height: 100%;
              overflow: auto;
            `, children: [_jsx(Text, { styledFontSize: "18px", styledLineHeight: "24px", bold: true, textLight: true, children: disclaimerTitle }), _jsx(Spacing, { bottom: 4 }), _jsx(Text, { styledLineHeight: "18px", textLight: true, css: (props) => `
                // not sure of the ideal way to deal with this
                a {
                  font-weight: 600;
                  color: ${props.theme.colorPrimary};
                  text-decoration: none;
                }
              `, children: parseCustomMarkdownToReact(disclaimerMessage) }), _jsx(Spacing, { bottom: 5 }), _jsxs(Box, { fullWidth: true, centered: true, displayInlineBlock: useSmallScreenInterface, children: [renderDenyButton && (_jsx(DisclaimerButton, { denyButton: true, onClick: () => this.deny(disclaimer.denyAction), fullWidth: useSmallScreenInterface, children: disclaimerDeny })), useSmallScreenInterface ? (_jsx(Spacing, { bottom: 3 })) : (_jsx(Spacing, { right: 3 })), _jsx(DisclaimerButton, { onClick: () => this.confirm(disclaimer.confirmAction), fullWidth: useSmallScreenInterface || !renderDenyButton, primary: true, children: disclaimerConfirm })] })] })] }) })) : null;
    }
};
Object.defineProperty(Disclaimer, "displayName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Disclaimer"
});
Object.defineProperty(Disclaimer, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        viewState: PropTypes.object,
        theme: PropTypes.object,
        t: PropTypes.func.isRequired
    }
});
Disclaimer = __decorate([
    observer
], Disclaimer);
export default withTranslation()(withViewState(withTheme(Disclaimer)));
//# sourceMappingURL=Disclaimer.js.map