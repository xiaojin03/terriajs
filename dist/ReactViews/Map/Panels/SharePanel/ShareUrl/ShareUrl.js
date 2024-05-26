import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Spacing from "../../../../../Styled/Spacing";
import { TextSpan } from "../../../../../Styled/Text";
import { buildShareLink, buildShortShareLink } from "../BuildShareLink";
import { ShareUrlWarning } from "./ShareUrlWarning";
import Clipboard from "../../../../Clipboard";
import Input from "../../../../../Styled/Input";
import { Category, ShareAction } from "../../../../../Core/AnalyticEvents/analyticEvents";
export const ShareUrl = forwardRef(function ShareUrl({ terria, viewState, includeStories, shouldShorten, children, theme, inputTheme, rounded, callback }, forwardRef) {
    const { t } = useTranslation();
    const [shareUrl, setShareUrl] = useState("");
    const [shorteningInProgress, setShorteningInProgress] = useState(false);
    const [placeholder, setPlaceholder] = useState();
    useImperativeHandle(forwardRef, () => ({
        url: shareUrl,
        shorteningInProgress: shorteningInProgress
    }), [forwardRef, shareUrl, shorteningInProgress]);
    useEffect(() => {
        if (shouldShorten) {
            setPlaceholder(t("share.shortLinkShortening"));
            setShorteningInProgress(true);
            buildShortShareLink(terria, viewState, {
                includeStories
            })
                .then((shareUrl) => setShareUrl(shareUrl))
                .catch(() => {
                setShareUrl(buildShareLink(terria, viewState, {
                    includeStories
                }));
            })
                .finally(() => setShorteningInProgress(false));
        }
        else {
            setShareUrl(buildShareLink(terria, viewState, {
                includeStories
            }));
        }
    }, [terria, viewState, shouldShorten, includeStories]);
    return (_jsxs(_Fragment, { children: [_jsx(Explanation, { textDark: theme === "light", children: t("clipboard.shareExplanation") }), _jsx(Spacing, { bottom: 1 }), _jsx(Clipboard, { theme: theme, text: shareUrl, source: _jsx(Input, { light: inputTheme === "light", dark: inputTheme === "dark", large: true, type: "text", value: shareUrl, placeholder: placeholder !== null && placeholder !== void 0 ? placeholder : t("share.shortLinkShortening"), readOnly: true, onClick: (e) => e.currentTarget.select(), css: `
              ${rounded ? `border-radius:  32px 0 0 32px;` : ""}
            `, id: "share-url" }), id: "share-url", rounded: rounded, onCopy: (text) => {
                    var _a;
                    return (_a = terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.share, ShareAction.storyCopy, text);
                } }), children, _jsx(Spacing, { bottom: 2 }), _jsx(ShareUrlWarning, { terria: terria, viewState: viewState, callback: callback || (() => { }) })] }));
});
const Explanation = styled(TextSpan) `
  opacity: 0.8;
`;
//# sourceMappingURL=ShareUrl.js.map