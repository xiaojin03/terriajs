var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { observer } from "mobx-react";
import Styles from "./parameter-editors.scss";
import { action, makeObservable } from "mobx";
import CommonStrata from "../../Models/Definition/CommonStrata";
import isDefined from "../../Core/isDefined";
let EnumerationParameterEditor = class EnumerationParameterEditor extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this);
    }
    onChange(e) {
        this.props.parameter.setValue(CommonStrata.user, e.target.value);
    }
    render() {
        const value = this.props.parameter.value;
        return (_jsxs("select", { className: Styles.field, onChange: this.onChange.bind(this), value: value, children: [(!isDefined(value) || !this.props.parameter.isRequired) && (_jsx("option", { value: "", children: "Not specified" }, "__undefined__")), isDefined(value) &&
                    !this.props.parameter.options.find((option) => option.id === value) && (_jsxs("option", { value: value, children: ["Invalid value (", value, ")"] }, "__invalid__")), this.props.parameter.options.map((v, i) => {
                    var _a;
                    return (_jsx("option", { value: v.id, children: (_a = v.name) !== null && _a !== void 0 ? _a : v.id }, i));
                })] }));
    }
};
__decorate([
    action
], EnumerationParameterEditor.prototype, "onChange", null);
EnumerationParameterEditor = __decorate([
    observer
], EnumerationParameterEditor);
export default EnumerationParameterEditor;
//# sourceMappingURL=EnumerationParameterEditor.js.map