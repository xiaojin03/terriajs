"use strict";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import defined from "terriajs-cesium/Source/Core/defined";
import classNames from "classnames";
import Styles from "./dropdown.scss";
// Use this as drop down rather than the html <select> tag so we have more consistent styling
// Uses the contents of the element as the name of the dropdown if none selected.
const Dropdown = createReactClass({
    propTypes: {
        theme: PropTypes.object,
        options: PropTypes.array,
        selected: PropTypes.object,
        selectOption: PropTypes.func,
        textProperty: PropTypes.string,
        matchWidth: PropTypes.bool,
        children: PropTypes.any,
        disabled: PropTypes.bool
    },
    getDefaultProps() {
        return {
            options: [],
            selected: undefined,
            textProperty: "name",
            align: "left",
            disabled: false,
            theme: {}
        };
    },
    getInitialState() {
        return {
            isOpen: false
        };
    },
    /* eslint-disable-next-line camelcase */
    UNSAFE_componentWillMount() {
        // this._element is updated by the ref callback attribute, https://facebook.github.io/react/docs/more-about-refs.html
        this.buttonElement = undefined;
    },
    componentWillUnmount() {
        this.removeListeners();
        this.dismounted = true;
    },
    hideList() {
        this.setState({
            isOpen: false
        });
        this.removeListeners();
    },
    removeListeners() {
        var _a;
        document.body.removeEventListener("click", this.hideList);
        (_a = this.buttonElement) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.nativeButtonListener);
        this.nativeButtonListener = undefined;
        (this.scrollListeners || []).forEach((listenerElement) => listenerElement === null || listenerElement === void 0 ? void 0 : listenerElement.removeEventListener("scroll", this.hideList));
        this.scrollListeners = undefined;
    },
    showList() {
        // Add a listener to every ancestor capable of scrolling that will close the dropdown when this occurs.
        const addScrollListeners = (element, listeningToSoFar) => {
            if (element.scrollHeight > element.clientHeight) {
                element.addEventListener("scroll", this.hideList);
                listeningToSoFar.push(element);
            }
            if (element !== document.body) {
                return addScrollListeners(element.parentNode, listeningToSoFar);
            }
            else {
                return listeningToSoFar;
            }
        };
        this.scrollListeners = addScrollListeners(this.buttonElement, []);
        this.setState({
            isOpen: true
        });
        // Add the listener to be triggered when a click happens anywhere on the body (including the toggle button)
        // or the outer panel is scrolled.
        document.body.addEventListener("click", this.hideList);
        // Unfortunately we need to add a native event listener because the native event hits document.body before
        // the react event ever gets triggered.
        this.nativeButtonListener = (event) => {
            event.stopPropagation();
            this.hideList();
        };
        this.buttonElement.addEventListener("click", this.nativeButtonListener);
    },
    select(option, index) {
        this.props.selectOption(option, index);
        this.hideList();
    },
    onButtonClicked() {
        if (!this.state.isOpen) {
            this.showList();
        }
        else {
            this.hideList();
        }
    },
    render() {
        const isOpenStyle = Styles.isOpen + " " + (this.props.theme.isOpen || "");
        return (_jsxs("div", { className: classNames(Styles.dropdown, this.props.theme.dropdown), children: [_jsxs("button", { type: "button", onClick: this.onButtonClicked, className: classNames(this.props.theme.button, Styles.btnDropdown), ref: (element) => {
                        this.buttonElement = element;
                    }, disabled: this.props.disabled, children: [defined(this.props.selected)
                            ? this.props.selected[this.props.textProperty]
                            : this.props.children, defined(this.props.theme.icon) ? this.props.theme.icon : null] }), _jsx("ul", { className: classNames(Styles.list, this.props.theme.list, {
                        [isOpenStyle]: this.state.isOpen
                    }), children: this.props.options.map((option, i) => (_jsx("li", { children: option.href ? (_jsx("a", { href: option.href, target: "_blank", rel: "noopener noreferrer", className: classNames(Styles.btnOption, this.props.theme.btnOption || "", { [Styles.isSelected]: option === this.props.selected }), download: option.download, children: option[this.props.textProperty] })) : (_jsx("button", { type: "button", className: classNames(Styles.btnOption, this.props.theme.btnOption || "", { [Styles.isSelected]: option === this.props.selected }), onClick: () => this.select(option, i), children: option[this.props.textProperty] })) }, option[this.props.textProperty]))) })] }));
    }
});
module.exports = Dropdown;
//# sourceMappingURL=Dropdown.js.map