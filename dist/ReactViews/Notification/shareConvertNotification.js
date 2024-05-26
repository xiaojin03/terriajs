import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import i18next from "i18next";
import { runInAction } from "mobx";
import isDefined from "../../Core/isDefined";
import Collapsible from "../Custom/Collapsible/Collapsible";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import Text, { TextSpan } from "../../Styled/Text";
import { RawButton } from "../../Styled/Button";
import Spacing from "../../Styled/Spacing";
export const shareConvertNotification = (messages) => function shareConvertNotification(viewState) {
    const messagesForPath = {};
    messages === null || messages === void 0 ? void 0 : messages.forEach((message) => {
        var _a;
        let pathString = (_a = message.path) === null || _a === void 0 ? void 0 : _a.join(": ");
        if (!pathString || pathString === null || pathString === "")
            pathString = "root";
        isDefined(messagesForPath[pathString])
            ? messagesForPath[pathString].push(message.message)
            : (messagesForPath[pathString] = [message.message]);
    });
    const rootMessages = messagesForPath["root"];
    delete messagesForPath["root"];
    const showHelp = () => {
        viewState.showHelpPanel();
        viewState.selectHelpMenuItem("storymigration");
        viewState.terria.notificationState.dismissCurrentNotification();
    };
    const showFeedback = () => {
        runInAction(() => {
            viewState.feedbackFormIsVisible = true;
        });
        viewState.terria.notificationState.dismissCurrentNotification();
    };
    return (_jsxs(_Fragment, { children: [_jsx(Text, { children: parseCustomMarkdownToReact(i18next.t("share.convertNotificationMessage")) }), _jsx(RawButton, { fullWidth: true, onClick: showHelp, css: `
            text-align: left;
          `, children: _jsx(TextSpan, { textLight: true, bold: true, medium: true, children: parseCustomMarkdownToReact(i18next.t("share.convertNotificationHelp")) }) }), _jsx(RawButton, { fullWidth: true, onClick: showFeedback, css: `
            text-align: left;
          `, children: _jsx(TextSpan, { textLight: true, bold: true, medium: true, children: parseCustomMarkdownToReact(i18next.t("share.convertNotificationFeedback")) }) }), _jsx(Spacing, { bottom: 2 }), _jsxs(Collapsible, { btnRight: true, title: i18next.t("share.convertNotificationWarningsTitle"), titleTextProps: { large: true }, bodyBoxProps: { padded: true }, children: [rootMessages && (_jsxs(_Fragment, { children: [_jsx("ul", { children: rootMessages.map((message, i) => (_jsx("li", { children: message }, i))) }), _jsx(Spacing, { bottom: 1 })] })), Object.entries(messagesForPath).map(([path, messages]) => (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 1 }), _jsx(Collapsible, { btnRight: true, title: path && path !== ""
                                    ? path
                                    : i18next.t("share.convertNotificationWarningsTitle"), children: _jsx("ul", { children: messages.map((message, i) => (_jsx("li", { children: message }, i))) }) })] })))] })] }));
};
//# sourceMappingURL=shareConvertNotification.js.map