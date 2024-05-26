import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import i18next from "i18next";
import { runInAction } from "mobx";
import { RawButton } from "../../Styled/Button";
import Text from "../../Styled/Text";
import CustomComponent from "./CustomComponent";
import parseCustomMarkdownToReact from "./parseCustomMarkdownToReact";
function showFeedback(viewState) {
    runInAction(() => {
        viewState.feedbackFormIsVisible = true;
        viewState.terria.notificationState.dismissCurrentNotification();
    });
}
export const FeedbackLink = (props) => 
// If we have feedbackUrl = show button to open feedback dialog
props.viewState.terria.configParameters.feedbackUrl ? (_jsx(RawButton, { fullWidth: true, onClick: () => showFeedback(props.viewState), css: `
        text-align: left;
      `, children: _jsx(Text, { bold: true, children: parseCustomMarkdownToReact(props.feedbackMessage
            ? props.feedbackMessage
            : i18next.t("models.raiseError.notificationFeedback")) }) })) : (
// If we only have supportEmail - show message and the email address
_jsx(_Fragment, { children: parseCustomMarkdownToReact(props.emailMessage
        ? `${props.emailMessage} ${props.viewState.terria.supportEmail}`
        : i18next.t("models.raiseError.notificationFeedbackEmail", {
            email: props.viewState.terria.supportEmail
        })) }));
/**
 * A `<feedbacklink>` custom component, which displays a feedback button (if the feature is enabled), or an email address.
 */
class FeedbackLinkCustomComponent extends CustomComponent {
    get name() {
        return FeedbackLinkCustomComponent.componentName;
    }
    get attributes() {
        return ["email-message", "feedback-message"];
    }
    processNode(context, node, children) {
        var _a, _b;
        if (!context.viewState)
            return undefined;
        return (_jsx(FeedbackLink, { viewState: context.viewState, emailMessage: (_a = node.attribs) === null || _a === void 0 ? void 0 : _a["email-message"], feedbackMessage: (_b = node.attribs) === null || _b === void 0 ? void 0 : _b["feedback-message"] }));
    }
}
Object.defineProperty(FeedbackLinkCustomComponent, "componentName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "feedbacklink"
});
export default FeedbackLinkCustomComponent;
//# sourceMappingURL=FeedbackLinkCustomComponent.js.map