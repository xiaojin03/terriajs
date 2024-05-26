import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import classNames from "classnames";
import { withTranslation } from "react-i18next";
import Styles from "./file-input.scss";
// When uploading a file
// use an button element to have consistent stylying
const FileInput = createReactClass({
    propTypes: {
        onChange: PropTypes.func,
        accept: PropTypes.string,
        t: PropTypes.func.isRequired
    },
    getInitialState() {
        const { t } = this.props;
        return {
            value: t("addData.browse"),
            hovered: false
        };
    },
    handleChange(e) {
        this.setState({
            value: e.target.value.split(/(\\|\/)/g).pop()
        });
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    },
    render() {
        const { t } = this.props;
        return (_jsxs("form", { className: Styles.fileInput, onMouseEnter: () => this.setState({ hovered: true }), onMouseLeave: () => this.setState({ hovered: false }), children: [_jsx("input", { type: "file", onChange: this.handleChange, accept: this.props.accept, className: Styles.input }), _jsx("label", { className: classNames(Styles.btn, {
                        [Styles.btnHover]: this.state.hovered
                    }), children: this.state.value ? this.state.value : t("addData.browse") })] }));
    }
});
module.exports = withTranslation()(FileInput);
//# sourceMappingURL=FileInput.js.map