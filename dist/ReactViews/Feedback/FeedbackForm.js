var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import { useUID } from "react-uid";
import styled, { withTheme } from "styled-components";
import sendFeedback from "../../Models/sendFeedback";
import Box from "../../Styled/Box";
import Button, { RawButton } from "../../Styled/Button";
import Checkbox from "../../Styled/Checkbox";
import { GLYPHS, StyledIcon } from "../../Styled/Icon";
import Input, { StyledTextArea } from "../../Styled/Input";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import parseCustomMarkdownToReact, { parseCustomMarkdownToReactWithOptions } from "../Custom/parseCustomMarkdownToReact";
import { withViewState } from "../Context";
import { applyTranslationIfExists } from "./../../Language/languageHelpers";
let FeedbackForm = class FeedbackForm extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                isSending: false,
                sendShareURL: true,
                name: "",
                email: "",
                comment: "",
                commentIsValid: false
            }
        });
        Object.defineProperty(this, "escKeyListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.escKeyListener = (e) => {
            if (e.keyCode === 27) {
                this.onDismiss();
            }
        };
        this.onDismiss = this.onDismiss.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.changeSendShareUrl = this.changeSendShareUrl.bind(this);
    }
    getInitialState() {
        return {
            isSending: false,
            sendShareURL: true,
            name: "",
            email: "",
            comment: ""
        };
    }
    componentDidMount() {
        window.addEventListener("keydown", this.escKeyListener, true);
        this.setState({
            commentIsValid: this.props.viewState.terria.configParameters.feedbackMinLength === 0
        });
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.escKeyListener, true);
    }
    resetState() {
        this.setState(this.getInitialState());
    }
    onDismiss() {
        runInAction(() => {
            this.props.viewState.feedbackFormIsVisible = false;
        });
        this.resetState();
    }
    updateName(e) {
        this.setState({
            name: e.target.value
        });
    }
    updateEmail(e) {
        this.setState({
            email: e.target.value
        });
    }
    updateComment(e) {
        this.setState({
            comment: e.target.value
        });
        if (this.state.comment.replace(/\s+/g, " ").length >=
            this.props.viewState.terria.configParameters.feedbackMinLength) {
            this.setState({
                commentIsValid: true
            });
        }
        else {
            this.setState({
                commentIsValid: false
            });
        }
    }
    changeSendShareUrl(e) {
        this.setState((prevState) => ({
            sendShareURL: !prevState.sendShareURL
        }));
    }
    onSubmit(e) {
        e.preventDefault();
        if (this.state.comment.length >=
            this.props.viewState.terria.configParameters.feedbackMinLength) {
            this.setState({
                isSending: true
            });
            sendFeedback({
                terria: this.props.viewState.terria,
                name: this.state.name,
                email: this.state.email,
                sendShareURL: this.state.sendShareURL,
                comment: this.state.comment
            }).then((succeeded) => {
                if (succeeded) {
                    this.setState({
                        isSending: false,
                        comment: ""
                    });
                    runInAction(() => {
                        this.props.viewState.feedbackFormIsVisible = false;
                    });
                }
                else {
                    this.setState({
                        isSending: false
                    });
                }
            });
        }
    }
    render() {
        const { t, i18n, viewState, theme } = this.props;
        const preamble = parseCustomMarkdownToReact(applyTranslationIfExists(viewState.terria.configParameters.feedbackPreamble ||
            "translate#feedback.feedbackPreamble", i18n));
        const postamble = viewState.terria.configParameters.feedbackPostamble
            ? parseCustomMarkdownToReact(applyTranslationIfExists(viewState.terria.configParameters.feedbackPostamble, i18n))
            : undefined;
        return (_jsxs(FormWrapper, { children: [_jsxs(Box, { backgroundColor: theme.darkLighter, paddedRatio: 2, children: [_jsx(Text, { textLight: true, textAlignCenter: true, semiBold: true, as: "h4", fullWidth: true, css: `
              margin: 0;
            `, children: t("feedback.title") }), _jsx(RawButton, { onClick: this.onDismiss, title: t("feedback.close"), children: _jsx(StyledIcon, { styledWidth: "15px", light: true, glyph: GLYPHS.close }) })] }), _jsxs(Form, { paddedRatio: 2, onSubmit: this.onSubmit.bind(this), column: true, children: [_jsx(Text, { textDarker: true, children: preamble }), _jsx(StyledLabel, { viewState: viewState, textProps: {
                                textDarker: true
                            }, label: t("feedback.yourName"), spacingBottom: true, children: _jsx(Input, { styledHeight: "34px", white: true, fieldBorder: theme.greyLighter, border: true, id: "name", type: "text", name: "name", value: this.state.name, onChange: this.updateName, autoComplete: "off" }) }), _jsx(StyledLabel, { viewState: viewState, textProps: {
                                textDarker: true
                            }, label: t("feedback.email"), spacingBottom: true, children: _jsx(Input, { styledHeight: "34px", white: true, fieldBorder: theme.greyLighter, border: true, id: "email", type: "text", name: "email", value: this.state.email, onChange: this.updateEmail, autoComplete: "off" }) }), _jsxs(StyledLabel, { viewState: viewState, textProps: {
                                textDarker: true
                            }, label: t("feedback.commentQuestion"), spacingBottom: true, children: [_jsx(TextArea, { lineHeight: "22px", styledMinHeight: "56px", styledMaxHeight: "120px", white: true, fieldBorder: theme.greyLighter, border: true, name: "comment", value: this.state.comment, valueIsValid: this.state.commentIsValid, onChange: this.updateComment, autoComplete: "off" }), !this.state.commentIsValid && (_jsx(WarningText, { children: t("feedback.minLength", {
                                        minLength: viewState.terria.configParameters.feedbackMinLength
                                    }) }))] }), _jsx(Checkbox, { isChecked: this.state.sendShareURL, value: "sendShareUrl", onChange: this.changeSendShareUrl, children: _jsx(Text, { children: t("feedback.shareWithDevelopers", {
                                    appName: this.props.viewState.terria.appName
                                }) }) }), _jsx(Spacing, { bottom: 2 }), postamble ? _jsx(Text, { textDarker: true, children: postamble }) : null, _jsxs(Box, { right: true, children: [_jsx(Button, { type: "button", denyButton: true, rounded: true, shortMinHeight: true, styledMinWidth: "80px", onClick: this.onDismiss, children: t("feedback.cancel") }), _jsx(Spacing, { right: 1 }), _jsx(Button, { type: "submit", primary: true, shortMinHeight: true, styledMinWidth: "80px", disabled: this.state.comment.length <
                                        viewState.terria.configParameters.feedbackMinLength ||
                                        this.state.isSending, children: this.state.isSending
                                        ? t("feedback.sending")
                                        : t("feedback.send") })] })] })] }));
    }
};
Object.defineProperty(FeedbackForm, "displayName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "FeedbackForm"
});
FeedbackForm = __decorate([
    observer
], FeedbackForm);
const WarningText = styled(Text) `
  color: red;
`;
const TextArea = (props) => {
    const { value, onChange, styledMaxHeight, styledMinHeight, valueIsValid, ...rest } = props;
    const textAreaRef = useRef(null);
    useEffect(() => {
        textAreaRef.current.style.setProperty("height", `${textAreaRef.current.scrollHeight + 2}px`);
    }, [value]);
    return (_jsx(StyledTextArea, { ...rest, ref: textAreaRef, rows: 1, styledHeight: styledMinHeight, styledMinHeight: styledMinHeight, styledMaxHeight: styledMaxHeight, onChange: (event) => {
            textAreaRef.current.style.setProperty("height", "auto");
            if (props.onChange) {
                props.onChange(event);
            }
        }, invalidValue: !valueIsValid }));
};
const StyledLabel = (props) => {
    const { viewState, label, textProps } = props;
    const id = useUID();
    const childrenWithId = React.Children.map(props.children, (child) => {
        // checking isValidElement is the safe way and avoids a typescript error too
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { id: id });
        }
        return child;
    });
    return (_jsxs(Box, { column: true, children: [label && (_jsx(Text, { as: "label", htmlFor: id, css: "p {margin: 0;}", ...textProps, children: parseCustomMarkdownToReactWithOptions(`${label}:`, {
                    injectTermsAsTooltips: true,
                    tooltipTerms: viewState.terria.configParameters.helpContentTerms
                }) })), childrenWithId, props.spacingBottom && _jsx(Spacing, { bottom: 2 })] }));
};
const Form = styled(Box).attrs({
    overflowY: "auto",
    scroll: true,
    as: "form"
}) ``;
const FormWrapper = styled(Box).attrs((props) => ({
    column: true,
    position: "absolute",
    styledMaxHeight: "60vh",
    styledMaxWidth: "400px",
    styledWidth: "350px",
    backgroundColor: props.theme.textLight
})) `
  z-index: ${(props) => props.theme.notificationWindowZIndex};
  border-radius: 5px;
  @media (min-width: ${(props) => props.theme.sm}px) {
    bottom: 75px;
    right: 20px;
    //max-height: 60vh;
  }
  @media (max-width: ${(props) => props.theme.sm}px) {
    right: 0;
    top: 50px;
    left: 0;
    max-height: calc(100vh - 50px);
    min-width: 100%;
  }
`;
export default withTranslation()(withViewState(withTheme(FeedbackForm)));
//# sourceMappingURL=FeedbackForm.js.map