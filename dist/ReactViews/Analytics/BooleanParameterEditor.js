var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { action, makeObservable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import CommonStrata from "../../Models/Definition/CommonStrata";
import Icon from "../../Styled/Icon";
import Styles from "./parameter-editors.scss";
let BooleanParameterEditor = class BooleanParameterEditor extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this);
    }
    onClick() {
        this.props.parameter.setValue(CommonStrata.user, !this.props.parameter.value);
    }
    renderCheckbox() {
        const value = this.props.parameter.value;
        const name = this.props.parameter.name;
        const description = this.props.parameter.description;
        return (_jsx("div", { children: _jsxs("button", { type: "button", className: Styles.btnRadio, title: description, onClick: this.onClick.bind(this), children: [value && _jsx(Icon, { glyph: Icon.GLYPHS.checkboxOn }), !value && _jsx(Icon, { glyph: Icon.GLYPHS.checkboxOff }), name] }) }));
    }
    renderRadio(state) {
        let name;
        let description;
        const value = this.props.parameter.value === state;
        if (state === true) {
            name = this.props.parameter.trueName || this.props.parameter.name;
            description =
                this.props.parameter.trueDescription ||
                    this.props.parameter.description;
        }
        else {
            name = this.props.parameter.falseName || this.props.parameter.name;
            description =
                this.props.parameter.falseDescription ||
                    this.props.parameter.description;
        }
        return (_jsx("div", { children: _jsxs("button", { type: "button", className: Styles.btnRadio, title: description, onClick: this.onClick.bind(this), children: [value && _jsx(Icon, { glyph: Icon.GLYPHS.radioOn }), !value && _jsx(Icon, { glyph: Icon.GLYPHS.radioOff }), name] }) }));
    }
    render() {
        return (_jsxs("div", { children: [!this.props.parameter.hasNamedStates && this.renderCheckbox(), this.props.parameter.hasNamedStates && (_jsxs("div", { children: [this.renderRadio(true), this.renderRadio(false)] }))] }));
    }
};
__decorate([
    action
], BooleanParameterEditor.prototype, "onClick", null);
BooleanParameterEditor = __decorate([
    observer
], BooleanParameterEditor);
export default BooleanParameterEditor;
//# sourceMappingURL=BooleanParameterEditor.js.map