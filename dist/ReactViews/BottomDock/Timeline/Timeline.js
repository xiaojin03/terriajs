var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import dateFormat from "dateformat";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import defined from "terriajs-cesium/Source/Core/defined";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import CommonStrata from "../../../Models/Definition/CommonStrata";
import withControlledVisibility from "../../HOCs/withControlledVisibility";
import CesiumTimeline from "./CesiumTimeline";
import { formatDateTime } from "./DateFormats";
import DateTimePicker from "./DateTimePicker";
import Styles from "./timeline.scss";
import TimelineControls from "./TimelineControls";
let Timeline = class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPickerOpen: false
        };
    }
    componentDidMount() {
        this.props.terria.timelineStack.activate();
    }
    componentWillUnmount() {
        this.props.terria.timelineStack.deactivate();
    }
    changeDateTime(time) {
        this.props.terria.timelineClock.currentTime = JulianDate.fromDate(new Date(time));
        this.props.terria.timelineStack.syncToClock(CommonStrata.user);
        this.props.terria.currentViewer.notifyRepaintRequired();
    }
    onOpenPicker() {
        this.setState({
            isPickerOpen: true
        });
    }
    onClosePicker() {
        this.setState({
            isPickerOpen: false
        });
    }
    render() {
        const terria = this.props.terria;
        const catalogItem = terria.timelineStack.top;
        if (!defined(catalogItem) ||
            !defined(catalogItem.currentTimeAsJulianDate)) {
            return null;
        }
        const { t } = this.props;
        const jsDate = JulianDate.toDate(catalogItem.currentTimeAsJulianDate);
        const timelineStack = this.props.terria.timelineStack;
        let currentTime;
        if (defined(timelineStack.top) && defined(timelineStack.top.dateFormat)) {
            currentTime = dateFormat(jsDate, this.props.terria.timelineStack.top.dateFormat);
        }
        else {
            currentTime = formatDateTime(jsDate, this.props.locale);
        }
        const discreteTimes = catalogItem.discreteTimesAsSortedJulianDates;
        const objectifiedDates = catalogItem.objectifiedDates;
        const currentDiscreteJulianDate = catalogItem.currentDiscreteJulianDate;
        return (_jsxs("div", { className: Styles.timeline, children: [_jsx("div", { className: Styles.textRow, css: `
            background: ${(p) => p.theme.dark};
          `, children: _jsxs("div", { className: Styles.textCell, title: t("dateTime.timeline.textCell"), children: [_jsx("div", { className: Styles.layerNameTruncated, children: catalogItem.name }), currentTime] }) }), _jsxs("div", { className: Styles.controlsRow, children: [_jsx(TimelineControls, { clock: terria.timelineClock, analytics: terria.analytics, currentViewer: terria.currentViewer }), defined(discreteTimes) &&
                            discreteTimes.length !== 0 &&
                            defined(currentDiscreteJulianDate) && (_jsx(DateTimePicker, { currentDate: JulianDate.toDate(currentDiscreteJulianDate), dates: objectifiedDates, onChange: () => this.changeDateTime(), openDirection: "up", isOpen: this.state.isPickerOpen, onOpen: () => this.onOpenPicker(), onClose: () => this.onClosePicker(), dateFormat: catalogItem.dateFormat })), _jsx(CesiumTimeline, { terria: terria })] })] }));
    }
};
Object.defineProperty(Timeline, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object.isRequired,
        locale: PropTypes.object,
        t: PropTypes.func.isRequired
    }
});
Timeline = __decorate([
    observer
], Timeline);
export default withControlledVisibility(withTranslation()(Timeline));
//# sourceMappingURL=Timeline.js.map