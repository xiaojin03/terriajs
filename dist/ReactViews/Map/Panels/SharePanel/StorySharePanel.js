"use strict";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// proptypes are in mixin
/* eslint react/prop-types:0*/
import createReactClass from "create-react-class";
import React from "react";
import Button from "../../../../Styled/Button";
import Icon from "../../../../Styled/Icon";
import BaseOuterPanel from "../BaseOuterPanel";
import InnerPanel from "../InnerPanel";
import { StyledIcon } from "../../../../Styled/Icon";
const StorySharePanel = createReactClass({
    displayName: "StorySharePanel",
    mixins: [BaseOuterPanel],
    getInitialState() {
        return {
            localIsOpen: false,
            caretOffset: undefined,
            dropdownOffset: undefined
        };
    },
    onInnerMounted(innerElement) {
        if (innerElement) {
            this.setState({
                caretOffset: "0px",
                dropdownOffset: "0px"
            });
        }
        else {
            this.setState({
                caretOffset: undefined,
                dropdownOffset: undefined
            });
        }
    },
    /* eslint-disable-next-line camelcase */
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.forceClosed) {
            this.onDismissed();
        }
    },
    openWithUserClick(e) {
        if (this.props.onUserClick) {
            this.props.onUserClick();
        }
        this.openPanel(e);
    },
    onClose() {
        if (this.props.onUserClick) {
            this.props.onUserClick();
        }
        this.onDismissed();
    },
    render() {
        return (_jsxs(_Fragment, { children: [_jsx(Button, { fullWidth: true, disabled: this.props.btnDisabled, title: this.props.btnTitle, primary: true, renderIcon: () => (_jsx(StyledIcon, { glyph: Icon.GLYPHS.share, light: true, styledWidth: "20px" })), textProps: {
                        large: true
                    }, onClick: this.openWithUserClick, children: this.props.btnText ? this.props.btnText : "" }), this.isOpen() && (_jsx("div", { css: `
              margin-top: 35px;
              font-family: ${(p) => p.theme.fontBase};
            `, children: _jsx(InnerPanel, { showDropdownAsModal: this.props.showDropdownAsModal, modalWidth: this.props.modalWidth, onDismissed: this.onClose, innerRef: this.onInnerMounted, doNotCloseFlag: this.getDoNotCloseFlag(), theme: this.props.theme, caretOffset: this.state.caretOffset, dropdownOffset: this.state.dropdownOffset, children: this.props.children }) }))] }));
    }
});
export default StorySharePanel;
//# sourceMappingURL=StorySharePanel.js.map