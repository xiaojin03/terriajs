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
import { withTheme } from "styled-components";
import Box from "../../../../Styled/Box";
import FadeIn from "../../../Transitions/FadeIn/FadeIn";
import Loader from "../../../Loader";
import { useKeyPress } from "../../../Hooks/useKeyPress.js";
import { RawButton } from "../../../../Styled/Button";
import Icon, { StyledIcon } from "../../../../Styled/Icon";
const VideoWrapperBox = (props) => {
    const { viewState } = props;
    const handleClose = () => viewState.setVideoGuideVisible("");
    useKeyPress("Escape", () => {
        handleClose();
    });
    return (_jsxs(Box, { centered: true, onClick: (e) => {
            e.stopPropagation();
            handleClose();
        }, css: `
        position: fixed;
        z-index: 99999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.75);
      `, children: [_jsx(Box, { paddedRatio: 4, position: "absolute", topRight: true, children: _jsx(RawButton, { onClick: handleClose.bind(null), children: _jsx(StyledIcon, { styledWidth: "22px", light: true, glyph: Icon.GLYPHS.closeLight }) }) }), props.children] }));
};
VideoWrapperBox.propTypes = {
    viewState: PropTypes.object.isRequired,
    children: PropTypes.node
};
let VideoGuide = class VideoGuide extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const backgroundOpacity = this.props.backgroundOpacity;
        const backgroundBlackOverlay = backgroundOpacity === undefined ? undefined : 1.0 - backgroundOpacity;
        return (_jsx(FadeIn, { isVisible: this.props.viewState.videoGuideVisible === this.props.videoName, children: _jsx(VideoWrapperBox, { viewState: this.props.viewState, children: _jsxs(Box, { centered: true, col11: true, styledHeight: "87%", backgroundImage: this.props.background, backgroundBlackOverlay: backgroundBlackOverlay, css: `
              svg {
                fill: #fff;
                width: 60px;
                height: 60px;
                top: -30px;
                left: -30px;
              }
            `, onClick: (e) => e.stopPropagation(), children: [_jsx(Loader, { message: ` ` }), _jsx("iframe", { src: this.props.videoLink, allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture", css: `
                border: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              ` })] }) }) }));
    }
};
Object.defineProperty(VideoGuide, "displayName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "VideoGuide"
});
Object.defineProperty(VideoGuide, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        viewState: PropTypes.object.isRequired,
        videoName: PropTypes.string.isRequired,
        videoLink: PropTypes.string,
        background: PropTypes.string,
        // A number between 0 and 1.0
        backgroundOpacity: PropTypes.number,
        theme: PropTypes.object,
        t: PropTypes.func
    }
});
VideoGuide = __decorate([
    observer
], VideoGuide);
export default withTranslation()(withTheme(VideoGuide));
//# sourceMappingURL=VideoGuide.js.map