import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { observer } from "mobx-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import Box, { BoxSpan } from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import { GLYPHS, StyledIcon } from "../../Styled/Icon";
export const Frame = observer((props) => {
    const theme = useTheme();
    const [t] = useTranslation();
    const [showChildren, setShowChildren] = useState(true);
    const { viewState } = props;
    return (_jsxs(Wrapper, { isMapFullScreen: viewState.isMapFullScreen, children: [_jsxs(Toggle, { paddedVertically: true, paddedHorizontally: 2, centered: true, justifySpaceBetween: true, backgroundColor: theme.toolPrimaryColor, children: [_jsx(Title, { title: props.title, icon: GLYPHS.search }), _jsxs(Box, { centered: true, css: "margin-right:-5px;", children: [_jsx(ToolCloseButton, { viewState: viewState, t: t }), _jsx(Spacing, { right: 4 }), _jsx(RawButton, { onClick: () => setShowChildren(!showChildren), children: _jsx(BoxSpan, { paddedRatio: 1, centered: true, children: _jsx(StyledIcon, { styledWidth: "12px", light: true, glyph: showChildren ? GLYPHS.opened : GLYPHS.closed }) }) })] })] }), showChildren && props.children] }));
});
export const Main = styled(Text) `
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow-y: auto;
  ${({ theme }) => theme.borderRadiusBottom(theme.radius40Button)}
  background-color: ${(p) => p.theme.darkWithOverlay};
  min-height: 350px;
`;
const Wrapper = styled(Box).attrs({
    column: true,
    position: "absolute",
    styledWidth: "340px"
    // charcoalGreyBg: true
}) `
  top: 70px;
  left: 0px;
  min-height: 220px;
  // background: ${(p) => p.theme.dark};
  margin-left: ${(props) => props.isMapFullScreen
    ? 16
    : parseInt(props.theme.workbenchWidth, 10) + 40}px;
  transition: margin-left 0.25s;
`;
const Toggle = styled(Box) `
  ${({ theme }) => theme.borderRadiusTop(theme.radius40Button)}
`;
const ToolCloseButton = (props) => {
    return (_jsx(RawButton, { onClick: () => props.viewState.closeTool(), children: _jsx(Text, { textLight: true, small: true, semiBold: true, uppercase: true, children: props.t("tool.exitBtnTitle") }) }));
};
const Title = (props) => {
    return (_jsxs(Box, { centered: true, children: [_jsx(Box, { children: props.icon && (_jsx(StyledIcon, { styledWidth: "20px", light: true, glyph: props.icon })) }), _jsx(Spacing, { right: 1 }), _jsx(TitleText, { textLight: true, semiBold: true, 
                // font-size is non standard with what we have so far in terria,
                // lineheight as well to hit nonstandard paddings
                styledFontSize: "17px", styledLineHeight: "30px", overflowEllipsis: true, overflowHide: true, noWrap: true, children: props.title })] }));
};
const TitleText = styled(Text) `
  flex-grow: 2;
  max-width: 220px;
`;
//# sourceMappingURL=ToolModal.js.map