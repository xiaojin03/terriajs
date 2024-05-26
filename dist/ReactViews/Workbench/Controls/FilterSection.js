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
import { Range } from "rc-slider";
import React from "react";
import CommonStrata from "../../../Models/Definition/CommonStrata";
import Styles from "./filter-section.scss";
let FilterSection = class FilterSection extends React.Component {
    change(filter, values) {
        runInAction(() => {
            filter.setTrait(CommonStrata.user, "minimumShown", values[0]);
            filter.setTrait(CommonStrata.user, "maximumShown", values[1]);
        });
        this.props.item.terria.currentViewer.notifyRepaintRequired();
    }
    render() {
        const item = this.props.item;
        if (!item.filters || item.filters.length === 0) {
            return null;
        }
        return (_jsx("div", { className: Styles.filters, children: item.filters.map(this.renderFilter) }));
    }
    renderFilter(filter) {
        const values = [filter.minimumShown, filter.maximumShown];
        return (_jsxs("div", { className: Styles.filter, children: [_jsxs("label", { htmlFor: filter.property, children: ["Show ", filter.name, ": ", filter.minimumShown, " to ", filter.maximumShown] }), _jsx(Range, { value: values, allowCross: false, min: filter.minimumValue, max: filter.maximumValue, onChange: this.change.bind(this, filter) })] }, filter.property));
    }
};
Object.defineProperty(FilterSection, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        item: PropTypes.object.isRequired
    }
});
FilterSection = __decorate([
    observer
], FilterSection);
export default FilterSection;
//# sourceMappingURL=FilterSection.js.map