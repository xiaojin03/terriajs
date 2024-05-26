import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Prompt.tsx - don't use without guarding on useSmallScreenInterface - it won't look pretty!
 */
import { useState } from "react";
import { useTheme } from "styled-components";
import FadeIn from "../Transitions/FadeIn/FadeIn";
import SlideUpFadeIn from "../Transitions/SlideUpFadeIn/SlideUpFadeIn";
const TourExplanationBox = require("../Tour/TourExplanationBox").default;
const TourPrefaceBox = require("../Tour/TourPrefaceBox").default;
import CloseButton from "../Generic/CloseButton";
import Text from "../../Styled/Text";
import Box from "../../Styled/Box";
import Button from "../../Styled/Button";
import Spacing from "../../Styled/Spacing";
export const HelpPrompt = ({ title, content, dismissLabel, acceptLabel, onDismiss, onAccept, isVisible }) => {
    const theme = useTheme();
    // This is required so we can do nested animations
    const [childrenVisible, setChildrenVisible] = useState(isVisible);
    return (_jsx(FadeIn, { isVisible: isVisible, onEnter: () => setChildrenVisible(true), transitionProps: {
            onExiting: () => setChildrenVisible(false)
        }, children: _jsxs(Box, { fullWidth: true, fullHeight: true, position: "absolute", css: `
          z-index: ${(p) => Number(p.theme.frontComponentZIndex) + 100};
        `, children: [_jsx(TourPrefaceBox, { onClick: onDismiss, role: "presentation", "aria-hidden": "true", pseudoBg: true }), _jsx(SlideUpFadeIn, { isVisible: childrenVisible, children: _jsxs(TourExplanationBox, { longer: true, paddedRatio: 4, column: true, style: {
                            right: 25,
                            bottom: 45
                        }, children: [_jsx(CloseButton, { color: theme.darkWithOverlay, topRight: true, onClick: () => onDismiss() }), _jsx(Spacing, { bottom: 2 }), _jsx(Text, { extraExtraLarge: true, bold: true, textDarker: true, children: title }), _jsx(Spacing, { bottom: 3 }), _jsx(Text, { light: true, medium: true, textDarker: true, children: content }), _jsx(Spacing, { bottom: 4 }), _jsx(Text, { medium: true, children: _jsxs(Box, { centered: true, children: [_jsx(Button, { secondary: true, fullWidth: true, shortMinHeight: true, onClick: (e) => {
                                                e.stopPropagation();
                                                onDismiss();
                                            }, children: dismissLabel }), _jsx(Spacing, { right: 3 }), _jsx(Button, { primary: true, fullWidth: true, shortMinHeight: true, textProps: { noFontSize: true }, onClick: (e) => {
                                                e.stopPropagation();
                                                onAccept();
                                            }, children: acceptLabel })] }) }), _jsx(Spacing, { bottom: 1 })] }) })] }) }));
};
export default HelpPrompt;
//# sourceMappingURL=HelpPrompt.js.map