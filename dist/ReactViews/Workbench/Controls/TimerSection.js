var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import defined from "terriajs-cesium/Source/Core/defined";
import Timer from "../../Generic/Timer/Timer";
import { withTranslation } from "react-i18next";
import Styles from "./timer-section.scss";
let TimerSection = class TimerSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            secondsLeft: 0
        };
    }
    isEnabled() {
        return (defined(this.props.item) &&
            this.props.item.isPolling &&
            defined(this.props.item.nextScheduledUpdateTime) &&
            this.props.item.refreshInterval < 30 * 60 * 1000 // only show refresh timer for refresh intervals less than 30 minutes
        );
    }
    getCountdownDuration() {
        // How many seconds until our next update?
        return Math.round((this.props.item.nextScheduledUpdateTime.getTime() -
            new Date().getTime()) /
            1000);
    }
    getTimerStartTime() {
        return new Date(this.props.item.nextScheduledUpdateTime -
            this.props.item.refreshInterval * 1000);
    }
    // Ticks down the countdown clock
    countdown() {
        if (this.state.secondsLeft > 0) {
            this.setState((state) => {
                return {
                    secondsLeft: state.secondsLeft - 1
                };
            });
        }
        else {
            // Stop.
            clearInterval(this.interval);
        }
    }
    startCountdown() {
        this.setState({
            secondsLeft: this.getCountdownDuration()
        });
        this.interval = setInterval(() => this.countdown(), 1000);
    }
    getCountdownString() {
        const date = new Date(null);
        date.setSeconds(this.state.secondsLeft);
        const addLeadingZeroIfRequired = (numString) => numString.length < 2 ? "0" + numString : numString;
        const minutes = addLeadingZeroIfRequired(date.getMinutes().toString());
        const seconds = addLeadingZeroIfRequired(date.getSeconds().toString());
        return `00:${minutes}:${seconds}`;
    }
    componentDidUpdate() {
        if (!this.isEnabled()) {
            return;
        }
        if (this.nextUpdate !== this.props.item.nextScheduledUpdateTime) {
            if (defined(this.interval)) {
                clearInterval(this.interval);
            }
            this.startCountdown();
            this.nextUpdate = this.props.item.nextScheduledUpdateTime;
        }
    }
    componentDidMount() {
        if (!this.isEnabled()) {
            return;
        }
        this.startCountdown();
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        const { t } = this.props;
        return this.isEnabled() ? (_jsxs("div", { className: Styles.section, children: [_jsx("div", { className: Styles.timerContainer, children: _jsx(Timer, { tooltipText: t("timer.nextScheduledUpdateTime", {
                            scheduledUpdateTime: this.props.item.nextScheduledUpdateTime
                        }), radius: 10, start: this.getTimerStartTime().getTime(), stop: this.props.item.nextScheduledUpdateTime.getTime() }) }), _jsx("span", { children: t("timer.nextScheduledUpdateCountdown", {
                        timeCountdown: this.getCountdownString()
                    }) })] })) : null;
    }
};
Object.defineProperty(TimerSection, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        item: PropTypes.object.isRequired,
        t: PropTypes.func.isRequired
    }
});
TimerSection = __decorate([
    observer
], TimerSection);
export default withTranslation()(TimerSection);
//# sourceMappingURL=TimerSection.js.map