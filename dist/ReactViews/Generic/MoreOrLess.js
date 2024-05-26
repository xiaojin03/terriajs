import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import Icon from "../../Styled/Icon";
const MoreOrLess = createReactClass({
    getInitialState: function () {
        return { isOpen: this.props.initialopen };
    },
    displayName: "MoreOrLess",
    propTypes: {
        initialopen: PropTypes.bool,
        myclass: PropTypes.string
    },
    toggleIcon: function () {
        this.setState({ isOpen: !this.state.isOpen });
    },
    render: function () {
        return (_jsx("button", { type: "button", onClick: this.toggleIcon, className: this.props.myclass, children: _jsx(Icon, { glyph: this.state.isOpen ? Icon.GLYPHS.showLess : Icon.GLYPHS.showMore }) }));
    }
});
module.exports = MoreOrLess;
//# sourceMappingURL=MoreOrLess.js.map