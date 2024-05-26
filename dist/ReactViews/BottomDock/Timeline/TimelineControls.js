"use strict";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import ClockRange from "terriajs-cesium/Source/Core/ClockRange";
import { withTranslation } from "react-i18next";
import Styles from "./timeline-controls.scss";
import Icon from "../../../Styled/Icon";
import { Category, TimeLineAction } from "../../../Core/AnalyticEvents/analyticEvents";
const TimelineControls = createReactClass({
    propTypes: {
        clock: PropTypes.object.isRequired,
        analytics: PropTypes.object.isRequired,
        currentViewer: PropTypes.object.isRequired,
        locale: PropTypes.object,
        t: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            currentTimeString: ""
        };
    },
    gotoStart() {
        var _a;
        (_a = this.props.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.timeLine, TimeLineAction.gotoStart);
        this.props.clock.currentTime = this.props.clock.startTime;
        this.props.currentViewer.notifyRepaintRequired();
    },
    togglePlay() {
        var _a;
        (_a = this.props.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.timeLine, TimeLineAction.togglePlay);
        this.props.clock.tick();
        if (this.props.clock.multiplier < 0) {
            this.props.clock.multiplier = -this.props.clock.multiplier;
        }
        this.props.clock.shouldAnimate = !this.props.clock.shouldAnimate;
        this.props.currentViewer.notifyRepaintRequired();
    },
    playSlower() {
        var _a;
        (_a = this.props.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.timeLine, TimeLineAction.playSlower);
        this.props.clock.tick();
        this.props.clock.multiplier /= 2;
        this.props.clock.shouldAnimate = true;
        this.props.currentViewer.notifyRepaintRequired();
    },
    playFaster() {
        var _a;
        (_a = this.props.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.timeLine, TimeLineAction.playFaster);
        this.props.clock.tick();
        this.props.clock.multiplier *= 2;
        this.props.clock.shouldAnimate = true;
        this.props.currentViewer.notifyRepaintRequired();
    },
    toggleLoop() {
        var _a;
        (_a = this.props.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.timeline, TimeLineAction.toggleLoop);
        if (this.isLooping()) {
            this.props.clock.clockRange = ClockRange.CLAMPED;
        }
        else {
            this.props.clock.clockRange = ClockRange.LOOP_STOP;
        }
    },
    isLooping() {
        return this.props.clock.clockRange === ClockRange.LOOP_STOP;
    },
    isPlaying() {
        return this.props.clock.shouldAnimate;
    },
    render() {
        const { t } = this.props;
        return (_jsxs("div", { className: Styles.controls, children: [_jsx("button", { type: "button", className: Styles.timelineControl, onClick: this.gotoStart, title: t("dateTime.timeline.gotoStart"), children: _jsx(Icon, { glyph: Icon.GLYPHS.backToStart }) }), _jsx("button", { type: "button", className: Styles.timelineControl, onClick: this.togglePlay, title: t("dateTime.timeline.togglePlay"), children: this.isPlaying() ? (_jsx(Icon, { glyph: Icon.GLYPHS.pause })) : (_jsx(Icon, { glyph: Icon.GLYPHS.play })) }), _jsx("button", { type: "button", className: Styles.timelineControl, onClick: this.playSlower, title: t("dateTime.timeline.playSlower"), children: _jsx(Icon, { glyph: Icon.GLYPHS.backward }) }), _jsx("button", { type: "button", className: Styles.timelineControl, onClick: this.playFaster, title: t("dateTime.timeline.playFaster"), children: _jsx(Icon, { glyph: Icon.GLYPHS.forward }) })] }));
    }
});
export default withTranslation()(TimelineControls);
//# sourceMappingURL=TimelineControls.js.map