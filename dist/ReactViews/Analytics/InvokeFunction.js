var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import defined from "terriajs-cesium/Source/Core/defined";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import Loader from "../Loader";
import WarningBox from "../Preview/WarningBox";
import Styles from "./invoke-function.scss";
import ParameterEditor from "./ParameterEditor";
class FunctionViewModel {
    constructor(catalogFunction) {
        this.catalogFunction = catalogFunction;
        this._parameters = {};
    }
    getParameter(parameter) {
        let result = this._parameters[parameter.id];
        if (!result || result.parameter !== parameter) {
            result = this._parameters[parameter.id] = new ParameterViewModel(parameter);
        }
        return result;
    }
}
class ParameterViewModel {
    constructor(parameter) {
        Object.defineProperty(this, "parameter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "isValueValid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "wasEverBlurredWhileInvalid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        makeObservable(this);
        this.parameter = parameter;
    }
}
__decorate([
    observable
], ParameterViewModel.prototype, "userValue", void 0);
__decorate([
    observable
], ParameterViewModel.prototype, "isValueValid", void 0);
__decorate([
    observable
], ParameterViewModel.prototype, "wasEverBlurredWhileInvalid", void 0);
let InvokeFunction = class InvokeFunction extends React.Component {
    /* eslint-disable-next-line camelcase */
    UNSAFE_componentWillMount() {
        this.parametersViewModel = new FunctionViewModel(this.props.previewed);
    }
    /* eslint-disable-next-line camelcase */
    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if (nextProps.previewed !== this.parametersViewModel.catalogFunction) {
            // Clear previous parameters view model, because this is a different catalog function.
            this.parametersViewModel = new FunctionViewModel(nextProps.previewed);
        }
    }
    submit() {
        this.props.previewed.submitJob().catch((e) => {
            this.props.terria.raiseErrorToUser(e);
        });
        runInAction(() => {
            // Close modal window
            this.props.viewState.explorerPanelIsVisible = false;
            // mobile switch to nowvewing
            this.props.viewState.switchMobileView(this.props.viewState.mobileViewOptions.preview);
        });
    }
    getParams() {
        // Key should include the previewed item identifier so that
        // components are refreshed when different previewed items are
        // displayed
        return this.props.previewed.functionParameters.map((param, i) => (_jsx(ParameterEditor, { parameter: param, viewState: this.props.viewState, previewed: this.props.previewed, parameterViewModel: this.parametersViewModel.getParameter(param) }, param.id + this.props.previewed.uniqueId)));
    }
    validateParameter(parameter) {
        if (!parameter.isValid ||
            !this.parametersViewModel.getParameter(parameter).isValueValid) {
            // Editor says it's not valid, so it's not valid.
            return false;
        }
        // Verify that required parameters have a value.
        if (parameter.isRequired && !defined(parameter.value)) {
            return false;
        }
        return true;
    }
    render() {
        var _a, _b;
        if (this.props.previewed.isLoading) {
            return _jsx(Loader, {});
        }
        let invalidParameters = false;
        if (defined(this.props.previewed.parameters)) {
            invalidParameters = !this.props.previewed.functionParameters.every(this.validateParameter.bind(this));
        }
        const { t } = this.props;
        return (_jsxs("div", { className: Styles.invokeFunction, children: [_jsxs("div", { className: Styles.content, children: [_jsx("h3", { children: this.props.previewed.name }), ((_a = this.props.previewed.loadMetadataResult) === null || _a === void 0 ? void 0 : _a.error) && (_jsx(WarningBox, { error: (_b = this.props.previewed.loadMetadataResult) === null || _b === void 0 ? void 0 : _b.error, viewState: this.props.viewState })), _jsx("div", { className: Styles.description, children: parseCustomMarkdownToReact(this.props.previewed.description, {
                                catalogItem: this.props.previewed
                            }) }), this.getParams()] }), _jsx("div", { className: Styles.footer, children: _jsx("button", { type: "button", className: Styles.btn, onClick: () => this.submit(), disabled: invalidParameters, children: t("analytics.runAnalysis") }) })] }));
    }
};
Object.defineProperty(InvokeFunction, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        terria: PropTypes.object,
        previewed: PropTypes.object,
        viewState: PropTypes.object,
        t: PropTypes.func.isRequired
    }
});
InvokeFunction = __decorate([
    observer
], InvokeFunction);
module.exports = withTranslation()(InvokeFunction);
//# sourceMappingURL=InvokeFunction.js.map