import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import i18next from "i18next";
import { runInAction } from "mobx";
import TerriaError from "../../Core/TerriaError";
import Box from "../../Styled/Box";
import Spacing from "../../Styled/Spacing";
import { Text } from "../../Styled/Text";
import Collapsible from "../Custom/Collapsible/Collapsible";
import FeedbackLinkCustomComponent, { FeedbackLink } from "../Custom/FeedbackLinkCustomComponent";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
const ErrorsBox = (props) => {
    return (_jsx(_Fragment, { children: props.errors.map((error, idx) => {
            var _a, _b;
            return (_jsx(Box, { displayInlineBlock: true, css: {
                    paddingLeft: "6px",
                    borderLeft: "solid 1px rgba(255,255,255,.1)"
                }, children: error instanceof TerriaError ? (_jsx(TerriaErrorBox, { error: error, viewState: props.viewState })) : (
                // Show error.message (as well as error.stack) if error.stack is defined
                _jsxs("div", { children: [error.stack ? _jsx("pre", { children: error.message }) : null, _jsx("pre", { children: (_b = (_a = error.stack) !== null && _a !== void 0 ? _a : error.message) !== null && _b !== void 0 ? _b : error.toString() })] })) }, idx));
        }) }));
};
const TerriaErrorBox = (props) => {
    return (_jsxs(_Fragment, { children: [_jsx(Text, { css: `
          p {
            margin: 5px 0px;
          }
        `, textLight: true, children: parseCustomMarkdownToReact(props.error.message, {
                    viewState: props.viewState,
                    terria: props.viewState.terria
                }) }), _jsx(Spacing, { bottom: 1 }), Array.isArray(props.error.originalError) &&
                props.error.originalError.length > 0 ? (_jsx(ErrorsBox, { errors: props.error.originalError, viewState: props.viewState })) : null] }));
};
export const terriaErrorNotification = (error) => function TerriaErrorNotification(viewState) {
    // Get "detailed" errors - these can be expanded if the user wants to see more "detail"
    let detailedErrors;
    // If the top level error is the highestImportanceError, then don't show it in detailedErrors (as it will just duplicate the top level error message)
    if (error.message !== error.highestImportanceError.message) {
        detailedErrors = [error];
    }
    else if (error.originalError) {
        detailedErrors = Array.isArray(error.originalError)
            ? error.originalError
            : [error.originalError];
    }
    // We only show FeedbackLink if the error message doesn't include the <feedbacklink> custom component (so we don't get duplicates)
    const includesFeedbackLink = error.highestImportanceError.message.includes(`<${FeedbackLinkCustomComponent.componentName}`);
    return (_jsxs(_Fragment, { children: [_jsx(Text, { css: `
            p {
              margin: 5px 0px;
            }
            // Fix feedback button color
            button {
              color: ${(p) => p.theme.textLight};
            }
          `, textLight: true, children: parseCustomMarkdownToReact(error.highestImportanceError.message, {
                    viewState: viewState,
                    terria: viewState.terria
                }) }), detailedErrors ? (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 2 }), _jsx(Collapsible, { btnRight: true, title: i18next.t("models.raiseError.developerDetails"), titleTextProps: { large: true }, bodyBoxProps: { padded: true }, isOpen: error.showDetails, onToggle: (show) => {
                            runInAction(() => (error.showDetails = show));
                        }, children: _jsx(ErrorsBox, { errors: detailedErrors, viewState: viewState }) })] })) : null, !includesFeedbackLink ? _jsx(FeedbackLink, { viewState: viewState }) : null] }));
};
//# sourceMappingURL=terriaErrorNotification.js.map