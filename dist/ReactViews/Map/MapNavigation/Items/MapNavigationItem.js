var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import { applyTranslationIfExists } from "../../../../Language/languageHelpers";
import Box from "../../../../Styled/Box";
import Icon, { GLYPHS } from "../../../../Styled/Icon";
import MapIconButton from "../../../MapIconButton/MapIconButton";
let MapNavigationItemBase = class MapNavigationItemBase extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { closeTool = true, item, expandInPlace, i18n } = this.props;
        if (item.render)
            return (_jsx(Control, { ref: item.controller.itemRef, children: item.render }, item.id));
        return (_jsx(Control, { ref: item.controller.itemRef, children: _jsx(MapIconButton, { expandInPlace: expandInPlace === undefined ? true : expandInPlace, noExpand: item.noExpand, iconElement: () => _jsx(Icon, { glyph: item.controller.glyph }), title: applyTranslationIfExists(item.title || item.name, i18n), onClick: () => {
                    item.controller.handleClick();
                }, disabled: item.controller.disabled, primary: item.controller.active, closeIconElement: closeTool ? () => _jsx(Icon, { glyph: GLYPHS.closeTool }) : undefined, children: applyTranslationIfExists(item.name, i18n) }) }));
    }
};
MapNavigationItemBase = __decorate([
    observer
], MapNavigationItemBase);
export const Control = styled(Box).attrs({
    centered: true,
    column: true
}) `
  pointer-events: auto;
  @media (min-width: ${(props) => props.theme.sm}px) {
    margin: 0;
    padding-top: 10px;
    height: auto;
  }
  @media (max-width: ${(props) => props.theme.mobile}px) {
    padding-right: 10px;
    margin-bottom: 5px;
  }
  text-align: center;
`;
export const MapNavigationItem = withTranslation()(MapNavigationItemBase);
//# sourceMappingURL=MapNavigationItem.js.map