import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from "prop-types";
/**
 * Higher-order component that hides element, depending on whether
 * element is available inside either "hidden" or "shown" lists passed
 * as prop
 */
export default (WrappedComponent) => {
    // eslint-disable-next-line require-jsdoc
    function WithControlledVisibility({ elementConfig, ...props }) {
        const isVisible = elementConfig ? elementConfig.visible : true;
        return isVisible ? _jsx(WrappedComponent, { ...props }) : null;
    }
    WithControlledVisibility.propTypes = {
        // Extend the wrapped components propTypes
        // because some methods like `processCustomElements` checks for propTypes
        // before deciding to forward certain props
        ...WrappedComponent.propTypes,
        elementConfig: PropTypes.object
    };
    return WithControlledVisibility;
};
//# sourceMappingURL=withControlledVisibility.js.map