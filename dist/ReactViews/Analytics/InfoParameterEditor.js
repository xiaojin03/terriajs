var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { observer } from "mobx-react";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
let InfoParameterEditor = class InfoParameterEditor extends React.Component {
    render() {
        return (_jsx("div", { children: this.props.parameter.value &&
                parseCustomMarkdownToReact(this.props.parameter.value) }));
    }
};
InfoParameterEditor = __decorate([
    observer
], InfoParameterEditor);
export default InfoParameterEditor;
//# sourceMappingURL=InfoParameterEditor.js.map