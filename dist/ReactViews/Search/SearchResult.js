import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled, { useTheme } from "styled-components";
import { Li } from "../../Styled/List";
import Icon, { StyledIcon } from "../../Styled/Icon";
import highlightKeyword from "../ReactViewHelpers/highlightKeyword";
import Box, { BoxSpan } from "../../Styled/Box";
import { TextSpan } from "../../Styled/Text";
import Spacing, { SpacingSpan } from "../../Styled/Spacing";
import { RawButton } from "../../Styled/Button";
import Hr from "../../Styled/Hr";
// Not sure how to generalise this or if it should be kept in stlyed/Button.jsx
// Initially had this as border bottom on the button, but need a HR given it's not a full width border
// // ${p => !p.isLastResult && `border-bottom: 1px solid ${p.theme.greyLighter};`}
const RawButtonAndHighlight = styled(RawButton) `
  ${(p) => `
  &:hover, &:focus {
    background-color: ${p.theme.greyLighter};
    ${StyledIcon} {
      fill-opacity: 1;
    }
  }`}
`;
const SearchResult = (props) => {
    const theme = useTheme();
    const highlightedResultName = highlightKeyword(props.name, props.locationSearchText);
    const isLightTheme = true;
    const isDarkTheme = false;
    return (_jsx(Li, { children: _jsx(Box, { fullWidth: true, column: true, children: _jsxs(RawButtonAndHighlight, { type: "button", onClick: props.clickAction, fullWidth: true, children: [_jsxs(BoxSpan, { children: [_jsx(SpacingSpan, { right: 2 }), _jsx(Hr, { size: 1, fullWidth: true, borderBottomColor: theme.greyLighter }), _jsx(SpacingSpan, { right: 2 })] }), _jsx(TextSpan, { breakWord: true, large: true, textDark: isLightTheme, children: _jsxs(BoxSpan, { paddedRatio: 2, paddedVertically: 3, centered: true, justifySpaceBetween: true, children: [props.icon && (_jsx(StyledIcon
                                // (You need light text on a dark theme, and vice versa)
                                , { 
                                    // (You need light text on a dark theme, and vice versa)
                                    fillColor: isLightTheme && theme.textDarker, light: isDarkTheme, styledWidth: "16px", 
                                    // @ts-ignore
                                    glyph: Icon.GLYPHS[props.icon] })), _jsx(Spacing, { right: 2 }), _jsx(BoxSpan, { fullWidth: true, children: _jsx(TextSpan, { noFontSize: true, textAlignLeft: true, children: highlightedResultName }) }), _jsx(StyledIcon
                                // (You need light text on a dark theme, and vice versa)
                                , { 
                                    // (You need light text on a dark theme, and vice versa)
                                    fillColor: isLightTheme && theme.textDarker, light: isDarkTheme, styledWidth: "14px", css: "fill-opacity:0;", glyph: Icon.GLYPHS.right2 })] }) })] }) }) }));
};
export default SearchResult;
//# sourceMappingURL=SearchResult.js.map