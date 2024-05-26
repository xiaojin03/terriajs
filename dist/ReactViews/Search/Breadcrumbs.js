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
import Box from "../../Styled/Box";
import { getParentGroups } from "../../Core/getPath";
import Text, { TextSpan } from "../../Styled/Text";
import Icon, { StyledIcon } from "../../Styled/Icon";
import Spacing from "../../Styled/Spacing";
import { RawButton } from "../../Styled/Button";
import styled from "styled-components";
import getAncestors from "../../Models/getAncestors";
import getDereferencedIfExists from "../../Core/getDereferencedIfExists";
import { runInAction } from "mobx";
import CommonStrata from "../../Models/Definition/CommonStrata";
const RawButtonAndUnderline = styled(RawButton) `
  ${(props) => `
  &:hover, &:focus {
    text-decoration: underline ${props.theme.textDark};
  }`}
`;
let Breadcrumbs = class Breadcrumbs extends React.Component {
    async openInCatalog(items) {
        items.forEach((item) => {
            runInAction(() => {
                item.setTrait(CommonStrata.user, "isOpen", true);
            });
        });
        (await this.props.viewState.viewCatalogMember(items[0])).raiseError(this.props.viewState.terria);
        this.props.viewState.changeSearchState("");
    }
    renderCrumb(parent, i, parentGroups) {
        const ancestors = getAncestors(this.props.previewed).map((ancestor) => getDereferencedIfExists(ancestor));
        /* No link when it's the current member */
        if (i === parentGroups.length - 1) {
            return (_jsx(Text, { small: true, textDark: true, children: parent }));
            /* The first and last two groups use the full name */
        }
        else if (i <= 1 || i >= parentGroups.length - 2) {
            return (_jsx(RawButtonAndUnderline, { type: "button", onClick: () => this.openInCatalog(ancestors.slice(i, i + 1)), children: _jsx(TextSpan, { small: true, textDark: true, children: parent }) }));
            /* The remainder are just '..' to prevent/minimise overflowing */
        }
        else if (i > 1 && i < parentGroups.length - 2) {
            return (_jsx(Text, { small: true, textDark: true, children: "..." }));
        }
        return null;
    }
    render() {
        const parentGroups = this.props.previewed
            ? getParentGroups(this.props.previewed)
            : undefined;
        return (
        // Note: should it reset the text if a person deletes current search and starts a new search?
        _jsxs(Box, { left: true, styledMinHeight: "32px", fullWidth: true, backgroundColor: this.props.theme.greyLighter, paddedHorizontally: 2.4, paddedVertically: 1, wordBreak: "break-all", children: [_jsx(StyledIcon, { styledWidth: "16px", fillColor: this.props.theme.textDark, glyph: Icon.GLYPHS.globe }), _jsx(Spacing, { right: 1.2 }), _jsx(Box, { flexWrap: true, children: parentGroups &&
                        parentGroups.map((parent, i) => (_jsxs(React.Fragment, { children: [this.renderCrumb(parent, i, parentGroups), i !== parentGroups.length - 1 && (_jsx(Box, { paddedHorizontally: 1, children: _jsx(Text, { small: true, textDark: true, children: ">" }) }))] }, i))) })] }));
    }
};
Object.defineProperty(Breadcrumbs, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object,
        viewState: PropTypes.object,
        previewed: PropTypes.object,
        theme: PropTypes.object,
        t: PropTypes.func.isRequired
    }
});
Breadcrumbs = __decorate([
    observer
], Breadcrumbs);
export default withTranslation()(withTheme(Breadcrumbs));
//# sourceMappingURL=Breadcrumbs.js.map