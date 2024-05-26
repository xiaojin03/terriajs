var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Trans, useTranslation, withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import Box from "../../Styled/Box";
import Button, { RawButton } from "../../Styled/Button";
import Icon, { StyledIcon } from "../../Styled/Icon";
import Spacing from "../../Styled/Spacing";
import Text, { TextSpan } from "../../Styled/Text";
import { ExplorerWindowElementName } from "../ExplorerWindow/ExplorerWindow";
import { useKeyPress } from "../Hooks/useKeyPress.js";
import VideoGuide from "../Map/Panels/HelpPanel/VideoGuide";
import { withViewState } from "../Context";
import { TourPortalDisplayName } from "../Tour/TourPortal";
import FadeIn from "../Transitions/FadeIn/FadeIn";
import SlideUpFadeIn from "../Transitions/SlideUpFadeIn/SlideUpFadeIn";
export const WELCOME_MESSAGE_NAME = "welcomeMessage";
export const LOCAL_PROPERTY_KEY = `${WELCOME_MESSAGE_NAME}Prompted`;
const WELCOME_MESSAGE_VIDEO = "welcomeMessageVideo";
const WelcomeModalWrapper = styled(Box) `
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.75);
`;
function WelcomeMessageButton(props) {
    return (_jsx(Button, { primary: true, rounded: true, fullWidth: true, onClick: props.onClick, children: _jsxs(Box, { centered: true, children: [props.buttonIcon && (_jsx(StyledIcon, { light: true, styledWidth: "22px", glyph: props.buttonIcon })), _jsx(Spacing, { right: 2 }), props.buttonText && (_jsx(TextSpan, { textLight: true, extraLarge: true, children: props.buttonText }))] }) }));
}
WelcomeMessageButton.propTypes = {
    buttonText: PropTypes.string,
    buttonIcon: PropTypes.object,
    onClick: PropTypes.func
};
let WelcomeMessage = class WelcomeMessage extends React.Component {
    constructor(props) {
        super(props);
        const viewState = this.props.viewState;
        const shouldShow = (viewState.terria.configParameters.showWelcomeMessage &&
            !viewState.terria.getLocalProperty(LOCAL_PROPERTY_KEY)) ||
            false;
        this.props.viewState.setShowWelcomeMessage(shouldShow);
    }
    render() {
        const viewState = this.props.viewState || {};
        return (_jsx(WelcomeMessagePure, { showWelcomeMessage: viewState.showWelcomeMessage, setShowWelcomeMessage: (bool) => this.props.viewState.setShowWelcomeMessage(bool), isTopElement: this.props.viewState.topElement === "WelcomeMessage", viewState: this.props.viewState }));
    }
};
Object.defineProperty(WelcomeMessage, "displayName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "WelcomeMessage"
});
Object.defineProperty(WelcomeMessage, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        viewState: PropTypes.object,
        theme: PropTypes.object,
        t: PropTypes.func.isRequired
    }
});
WelcomeMessage = __decorate([
    observer
], WelcomeMessage);
export const WelcomeMessagePure = (props) => {
    const { showWelcomeMessage, setShowWelcomeMessage, viewState } = props;
    const { t } = useTranslation();
    // This is required so we can do nested animations
    const [welcomeVisible, setWelcomeVisible] = useState(showWelcomeMessage);
    const [shouldTakeTour, setShouldTakeTour] = useState(false);
    const [shouldExploreData, setShouldExploreData] = useState(false);
    const [shouldOpenHelp, setShouldOpenHelp] = useState(false);
    const [shouldOpenSearch, setShouldOpenSearch] = useState(false);
    // const {
    //   WelcomeMessagePrimaryBtnClick,
    //   WelcomeMessageSecondaryBtnClick
    // } = viewState.terria.overrides;
    const handleClose = (persist = false) => {
        setShowWelcomeMessage(false);
        setShouldOpenHelp(false);
        setShouldOpenSearch(false);
        if (persist) {
            viewState.terria.setLocalProperty(LOCAL_PROPERTY_KEY, true);
        }
    };
    useKeyPress("Escape", () => {
        if (showWelcomeMessage && viewState.videoGuideVisible === "") {
            handleClose(false);
        }
    });
    return (_jsx(FadeIn, { isVisible: showWelcomeMessage, onEnter: () => setWelcomeVisible(true), transitionProps: {
            onExiting: () => setWelcomeVisible(false),
            onExited: () => {
                if (shouldTakeTour) {
                    setShouldTakeTour(false);
                    viewState.setTourIndex(0);
                    viewState.setShowTour(true);
                    viewState.setTopElement(TourPortalDisplayName);
                }
                if (shouldExploreData) {
                    setShouldExploreData(false);
                    viewState.openAddData();
                    viewState.setTopElement(ExplorerWindowElementName);
                }
                if (shouldOpenHelp) {
                    setShouldOpenHelp(false);
                    viewState.showHelpPanel();
                }
                if (shouldOpenSearch) {
                    setShouldOpenSearch(false);
                    runInAction(() => (viewState.searchState.showMobileLocationSearch = true));
                }
                // Show where help is when never previously prompted
                if (!viewState.terria.getLocalProperty("helpPrompted")) {
                    runInAction(() => {
                        viewState.toggleFeaturePrompt("help", true, false);
                    });
                }
            }
        }, children: _jsx(WelcomeModalWrapper, { fullWidth: true, fullHeight: true, position: "absolute", right: true, onClick: () => handleClose(false), children: _jsxs(Box, { styledWidth: viewState.isMapFullScreen || viewState.useSmallScreenInterface
                    ? "100%"
                    : "calc(100% - 350px)", fullHeight: true, centered: true, children: [_jsx(VideoGuide, { viewState: viewState, videoLink: viewState.terria.configParameters.welcomeMessageVideo.videoUrl, background: viewState.terria.configParameters.welcomeMessageVideo
                            .placeholderImage, videoName: WELCOME_MESSAGE_VIDEO }), _jsx(SlideUpFadeIn, { isVisible: welcomeVisible, children: _jsxs(Box, { styledWidth: "667px", styledMinHeight: "504px", displayInlineBlock: true, paddedRatio: viewState.useSmallScreenInterface ? 2 : 6, onClick: (e) => {
                                viewState.setTopElement("WelcomeMessage");
                                e.stopPropagation();
                            }, children: [_jsx(RawButton, { onClick: handleClose.bind(null, false), css: `
                  float: right;
                `, children: _jsx(StyledIcon, { styledWidth: "24px", light: true, glyph: Icon.GLYPHS.closeLight }) }), _jsx(Spacing, { bottom: 7 }), _jsxs(Box, { displayInlineBlock: true, styledWidth: viewState.useSmallScreenInterface ? "100%" : "83.33333%", children: [_jsx(Text, { bold: true, textLight: true, styledFontSize: viewState.useSmallScreenInterface ? "26px" : "36px", textAlignCenter: viewState.useSmallScreenInterface, styledLineHeight: "49px", children: t("welcomeMessage.title") }), _jsx(Spacing, { bottom: 3 }), _jsxs(Text, { textLight: true, medium: true, textAlignCenter: viewState.useSmallScreenInterface, children: [viewState.useSmallScreenInterface === false && (_jsxs(Trans, { i18nKey: "welcomeMessage.welcomeMessage", children: ["Interested in data discovery and exploration?", _jsx("br", {}), "Dive right in and get started or check the following help guide options."] })), viewState.useSmallScreenInterface === true && (_jsx(Trans, { i18nKey: "welcomeMessage.welcomeMessageOnMobile", children: "Interested in data discovery and exploration?" }))] })] }), _jsx(Spacing, { bottom: 6 }), !viewState.useSmallScreenInterface && (_jsxs(_Fragment, { children: [_jsx(Text, { bold: true, textLight: true, extraLarge: true, children: viewState.terria.configParameters.welcomeMessageVideo
                                                .videoTitle }), _jsx(Spacing, { bottom: 2 })] })), _jsxs(Box, { fullWidth: true, styledMinHeight: "160px", children: [!viewState.useSmallScreenInterface && (_jsxs(_Fragment, { children: [_jsx(Box, { col6: true, centered: true, backgroundImage: viewState.terria.configParameters.welcomeMessageVideo
                                                        .placeholderImage, backgroundBlackOverlay: "50%", children: _jsx(RawButton, { fullWidth: true, fullHeight: true, onClick: () => viewState.setVideoGuideVisible(WELCOME_MESSAGE_VIDEO), children: _jsx(StyledIcon, { styledWidth: "48px", light: true, glyph: Icon.GLYPHS.playInverted, css: `
                            margin: auto;
                          ` }) }) }), _jsx(Spacing, { right: 5 })] })), _jsxs(Box, { styledMargin: "0 auto", displayInlineBlock: true, children: [!viewState.useSmallScreenInterface && (_jsxs(_Fragment, { children: [_jsx(WelcomeMessageButton, { onClick: () => {
                                                                handleClose(false);
                                                                // not sure if we should wait for the exit animation,
                                                                // if we don't, we have a flicker due to the difference
                                                                // in overlay darkness - but if we wait, it goes
                                                                // dark -> light -> dark anyway..
                                                                setShouldTakeTour(true);
                                                                viewState.setTourIndex(0);
                                                                viewState.setShowTour(true);
                                                                viewState.setTopElement(TourPortalDisplayName);
                                                            }, buttonText: t("welcomeMessage.tourBtnText"), buttonIcon: Icon.GLYPHS.tour }), _jsx(Spacing, { bottom: 4 }), _jsx(WelcomeMessageButton, { buttonText: t("welcomeMessage.helpBtnText"), buttonIcon: Icon.GLYPHS.newHelp, onClick: () => {
                                                                handleClose(false);
                                                                setShouldOpenHelp(true);
                                                            } })] })), _jsx(Spacing, { bottom: 4 }), _jsx(WelcomeMessageButton, { buttonText: t("welcomeMessage.exploreDataBtnText"), buttonIcon: Icon.GLYPHS.add, onClick: () => {
                                                        handleClose(false);
                                                        setShouldExploreData(true);
                                                    } }), viewState.useSmallScreenInterface && (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 4 }), _jsx(WelcomeMessageButton, { buttonText: t("welcomeMessage.searchBtnText"), buttonIcon: Icon.GLYPHS.search, onClick: () => {
                                                                handleClose(false);
                                                                setShouldOpenSearch(true);
                                                            } })] }))] })] }), !viewState.useSmallScreenInterface && _jsx(Spacing, { bottom: 13 }), _jsx(Box, { fullWidth: true, centered: true, children: _jsx(RawButton, { onClick: handleClose.bind(null, true), children: _jsx(TextSpan, { textLight: true, isLink: true, children: t("welcomeMessage.dismissText") }) }) })] }) })] }) }) }));
};
WelcomeMessagePure.propTypes = {
    showWelcomeMessage: PropTypes.bool.isRequired,
    setShowWelcomeMessage: PropTypes.func.isRequired,
    isTopElement: PropTypes.bool.isRequired,
    viewState: PropTypes.object.isRequired
};
export default withTranslation()(withViewState(withTheme(WelcomeMessage)));
//# sourceMappingURL=WelcomeMessage.js.map