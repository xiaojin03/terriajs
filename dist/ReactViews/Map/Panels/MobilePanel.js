import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// proptypes are in mixin.
/* eslint react/prop-types:0*/
import React from "react";
import createReactClass from "create-react-class";
import MobileMenuItem from "../../Mobile/MobileMenuItem";
import BaseOuterPanel from "./BaseOuterPanel";
import InnerPanel from "./InnerPanel";
import Styles from "./panel.scss";
const MobilePanel = createReactClass({
    displayName: "MobilePanel",
    mixins: [BaseOuterPanel],
    getInitialState() {
        return {
            localIsOpen: false
        };
    },
    render() {
        return (_jsxs("div", { children: [_jsx(MobileMenuItem, { onClick: this.openPanel, caption: this.props.btnText, icon: this.props.mobileIcon }), this.isOpen() && (_jsxs(_Fragment, { children: [_jsx("div", { className: Styles.overlay }), _jsx(InnerPanel, { theme: this.props.theme, caretOffset: "15px", doNotCloseFlag: this.getDoNotCloseFlag(), onDismissed: this.onDismissed, disableCloseOnFocusLoss: this.disableCloseOnFocusLoss, children: this.props.children })] }))] }));
    }
});
export default MobilePanel;
//# sourceMappingURL=MobilePanel.js.map