import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
import FadeIn from "../Transitions/FadeIn/FadeIn";
import Box from "../../Styled/Box";
import Spacing from "../../Styled/Spacing";
import { TextSpan } from "../../Styled/Text";
import { RawButton } from "../../Styled/Button";
import { withTheme } from "styled-components";
import Caret from "../Generic/Caret";
class Prompt extends React.PureComponent {
    // Tried to keep/make use of the original story prompt css properties
    render() {
        return (_jsx(FadeIn, { isVisible: this.props.isVisible, children: _jsxs(Box, { displayInlineBlock: true, rounded: true, position: "absolute", backgroundColor: this.props.theme.colorPrimary, paddedRatio: 3, styledWidth: `${this.props.promptWidth || 200}px`, css: `
            top: ${this.props.promptTopOffset || 50}px;
            left: ${this.props.promptLeftOffset || -140}px;
            pointer-events: auto;
          `, children: [_jsx(Caret, { style: {
                            top: `${this.props.caretTopOffset || -8}px`,
                            left: `${this.props.caretLeftOffset || 160}px`
                        }, size: this.props.caretSize || 18, background: this.props.theme.colorPrimary }), this.props.content, _jsx(Spacing, { bottom: 3 }), _jsx(Box, { fullWidth: true, centered: this.props.centered, children: _jsx(RawButton, { title: this.props.dismissText, onClick: this.props.dismissAction, children: _jsx(TextSpan, { isLink: true, medium: true, textLight: true, children: this.props.dismissText }) }) })] }) }));
    }
}
Prompt.propTypes = {
    content: PropTypes.object,
    dismissText: PropTypes.string,
    dismissAction: PropTypes.func,
    displayDelay: PropTypes.number,
    promptWidth: PropTypes.number,
    promptTopOffset: PropTypes.number,
    promptLeftOffset: PropTypes.number,
    caretTopOffset: PropTypes.number,
    caretLeftOffset: PropTypes.number,
    caretSize: PropTypes.number,
    centered: PropTypes.bool,
    isVisible: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired
};
export default withTheme(Prompt);
//# sourceMappingURL=Prompt.js.map