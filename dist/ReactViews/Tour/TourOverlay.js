"use strict";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
import Styles from "../HelpScreens/obscure-overlay.scss";
import classNames from "classnames";
import defined from "terriajs-cesium/Source/Core/defined";
/**
 * Re-adapted from ObscureOverlay.jsx to be more general and not tied to viewState
 *
 * TourPortal.jsx should be the 'wrapper'/smart component
 *
 * This provides five panels. Four are rectangle elements that go above, left, right, and below the highlighted element
 * to grey out the rest of the screen. A fifth panel, which is clear, covers the whole screen to prevent the highlighted
 * element from being selectable.
 */
const TourOverlay = ({ rectangle, onCancel }) => {
    const advance = () => {
        // this.props.helpViewState.advance = true;
    };
    // const helpScreen = this.props.helpViewState.currentScreen;
    if (!defined(rectangle)) {
        console.log("no rectangle passed in, won't render overlay");
        return null;
    }
    // Top
    const topOverlayPositionLeft = 0 + "px";
    const topOverlayPositionTop = 0 + "px";
    const topOverlayHeight = rectangle.top + "px";
    const topOverlayWidth = "100%";
    // Left
    const leftOverlayPositionLeft = 0 + "px";
    const leftOverlayPositionTop = rectangle.top + "px";
    const leftOverlayHeight = rectangle.height + "px";
    const leftOverlayWidth = rectangle.left + "px";
    // Right
    const rightOverlayPositionLeft = rectangle.right + "px";
    const rightOverlayPositionTop = rectangle.top + "px";
    const rightOverlayHeight = rectangle.height + "px";
    const rightOverlayWidth = "100%";
    // Bottom
    const bottomOverlayPositionLeft = 0 + "px";
    const bottomOverlayPositionTop = rectangle.bottom + "px";
    const bottomOverlayHeight = "100%";
    const bottomOverlayWidth = "100%";
    const windowClass = classNames(Styles.window, {
        [Styles.isActive]: rectangle
    });
    return (_jsxs("div", { className: windowClass, children: [_jsx("div", { className: Styles.topOverlay, style: {
                    left: topOverlayPositionLeft,
                    top: topOverlayPositionTop,
                    width: topOverlayWidth,
                    height: topOverlayHeight
                }, onClick: onCancel }), _jsx("div", { className: Styles.leftOverlay, style: {
                    left: leftOverlayPositionLeft,
                    top: leftOverlayPositionTop,
                    width: leftOverlayWidth,
                    height: leftOverlayHeight
                }, onClick: onCancel }), _jsx("div", { className: Styles.rightOverlay, style: {
                    left: rightOverlayPositionLeft,
                    top: rightOverlayPositionTop,
                    width: rightOverlayWidth,
                    height: rightOverlayHeight
                }, onClick: onCancel }), _jsx("div", { className: Styles.bottomOverlay, style: {
                    left: bottomOverlayPositionLeft,
                    top: bottomOverlayPositionTop,
                    width: bottomOverlayWidth,
                    height: bottomOverlayHeight
                }, onClick: onCancel }), _jsx("div", { className: Styles.clearOverlay, onClick: advance })] }));
};
TourOverlay.propTypes = {
    rectangle: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};
module.exports = TourOverlay;
//# sourceMappingURL=TourOverlay.js.map