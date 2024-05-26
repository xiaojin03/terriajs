import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from "prop-types";
const MediaQuery = require("react-responsive").default;
// This should come from some config some where
const small = 768;
const medium = 992;
const large = 1300;
// Use PropTypes and Typescript because this is widely used from JSX and TSX files
const BreakpointPropTypes = {
    children: PropTypes.node
};
export function ExtraSmall(props) {
    return _jsx(MediaQuery, { maxWidth: small, children: props.children });
}
export function Small(props) {
    return _jsx(MediaQuery, { maxWidth: small - 1, children: props.children });
}
export function Medium(props) {
    return _jsx(MediaQuery, { minWidth: small, children: props.children });
}
export function Large(props) {
    return _jsx(MediaQuery, { minWidth: medium, children: props.children });
}
export function ExtraLarge(props) {
    return _jsx(MediaQuery, { minWidth: large, children: props.children });
}
ExtraSmall.propTypes = BreakpointPropTypes;
Small.propTypes = BreakpointPropTypes;
Medium.propTypes = BreakpointPropTypes;
Large.propTypes = BreakpointPropTypes;
ExtraLarge.propTypes = BreakpointPropTypes;
//# sourceMappingURL=Responsive.js.map