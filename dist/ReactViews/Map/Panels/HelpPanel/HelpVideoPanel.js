var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import classNames from "classnames";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import Icon from "../../../../Styled/Icon";
import Styles from "./help-panel.scss";
import Spacing from "../../../../Styled/Spacing";
import Box from "../../../../Styled/Box";
import VideoGuide from "./VideoGuide";
import TrainerPane from "./TrainerPane";
import StyledHtml from "./StyledHtml";
import SatelliteGuide from "../../../Guide/SatelliteGuide";
const HELP_VIDEO_NAME = "helpVideo";
let HelpVideoPanel = class HelpVideoPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const helpItemType = this.props.paneMode || "videoAndContent"; // default is video panel
        const itemSelected = this.props.viewState.selectedHelpMenuItem === this.props.itemString;
        const isExpanded = this.props.viewState.selectedHelpMenuItem !== "";
        const className = classNames({
            [Styles.videoPanel]: true,
            [Styles.isVisible]: isExpanded,
            // when the help entire video panel is invisible (hidden away to the right)
            [Styles.shiftedToRight]: !isExpanded ||
                !this.props.viewState.showHelpMenu ||
                this.props.viewState.topElement !== "HelpPanel"
        });
        return (itemSelected && (_jsxs("div", { className: className, children: [_jsx(VideoGuide, { viewState: this.props.viewState, videoLink: this.props.videoUrl, background: this.props.placeholderImage, backgroundOpacity: this.props.videoCoverImageOpacity, videoName: HELP_VIDEO_NAME }), _jsxs(Box, { centered: true, fullWidth: true, fullHeight: true, displayInlineBlock: true, paddedHorizontally: 4, paddedVertically: 18, css: `
              overflow: auto;
              overflow-x: hidden;
              overflow-y: auto;
            `, scroll: true, children: [helpItemType === "videoAndContent" && (_jsxs(_Fragment, { children: [this.props.videoUrl && this.props.placeholderImage && (_jsxs("div", { children: [_jsx("div", { className: Styles.videoLink, style: {
                                                backgroundImage: `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)), url(${this.props.placeholderImage})`
                                            }, children: _jsx("button", { className: Styles.videoBtn, onClick: () => this.props.viewState.setVideoGuideVisible(HELP_VIDEO_NAME), children: _jsx(Icon, { glyph: Icon.GLYPHS.play }) }) }), _jsx(Spacing, { bottom: 5 })] }, "image")), this.props.markdownContent && (_jsx(StyledHtml, { viewState: this.props.viewState, markdown: this.props.markdownContent }, "markdownContent"))] })), helpItemType === "slider" && (_jsx(SatelliteGuide, { terria: this.props.terria, viewState: this.props.viewState })), helpItemType === "trainer" && (_jsx(TrainerPane, { content: this.props.content, terria: this.props.terria, viewState: this.props.viewState }))] })] })));
    }
};
Object.defineProperty(HelpVideoPanel, "displayName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "HelpVideoPanel"
});
Object.defineProperty(HelpVideoPanel, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        content: PropTypes.object.isRequired,
        itemString: PropTypes.string,
        paneMode: PropTypes.string,
        markdownContent: PropTypes.string,
        videoUrl: PropTypes.string,
        placeholderImage: PropTypes.string,
        videoCoverImageOpacity: PropTypes.number,
        theme: PropTypes.object,
        t: PropTypes.func.isRequired,
        i18n: PropTypes.object.isRequired
    }
});
HelpVideoPanel = __decorate([
    observer
], HelpVideoPanel);
export default withTranslation()(withTheme(HelpVideoPanel));
//# sourceMappingURL=HelpVideoPanel.js.map