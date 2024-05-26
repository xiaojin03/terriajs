import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import Box from "../../../Styled/Box";
import { RawButton } from "../../../Styled/Button";
import Icon from "../../../Styled/Icon";
import { StoryIcon } from "./StoryButtons";
import Text from "../../../Styled/Text";
const FooterButton = styled(RawButton) `
  display: flex;
  align-items: center;
  padding: 15px;
  gap: 5px;
`;
const NavigationButton = styled(RawButton) `
  display: flex;
  align-items: center;
  flex: 1;
  padding: 15px 0;
  gap: 10px;
`;
const FooterBar = ({ goPrev, goNext, jumpToStory, zoomTo, currentHumanIndex, totalStories, listStories }) => {
    const isEnd = currentHumanIndex === totalStories;
    const { t } = useTranslation();
    const theme = useTheme();
    return (_jsxs(_Fragment, { children: [_jsx(Box, { flex: 1, children: totalStories > 1 && (_jsxs(NavigationButton, { disabled: currentHumanIndex === 1, onClick: goPrev, children: [_jsx(StoryIcon, { displayInline: true, styledWidth: "15px", fillColor: theme.grey, glyph: Icon.GLYPHS.left }), _jsx(Text, { medium: true, children: t("story.prev") })] })) }), _jsxs(Box, { flex: 1, centered: true, children: [_jsx(FooterButton, { onClick: listStories, children: _jsx(StoryIcon, { displayInline: true, styledWidth: "15px", glyph: Icon.GLYPHS.menu, fillColor: theme.grey }) }), _jsx(Box, { paddedRatio: 3, children: _jsxs(Text, { noWrap: true, children: [currentHumanIndex, " / ", totalStories] }) }), _jsx(FooterButton, { onClick: zoomTo, title: t("story.locationBtn"), children: _jsx(StoryIcon, { styledWidth: "16px", glyph: Icon.GLYPHS.location }) })] }), _jsx(Box, { flex: 1, right: true, children: totalStories > 1 && (_jsx(NavigationButton, { css: `
              justify-content: flex-end;
            `, onClick: isEnd ? () => jumpToStory(0) : goNext, children: isEnd ? (_jsxs(_Fragment, { children: [_jsx(Text, { children: t("story.restart") }), _jsx(StoryIcon, { displayInline: true, styledWidth: "15px", glyph: Icon.GLYPHS.revert, fillColor: theme.grey })] })) : (_jsxs(_Fragment, { children: [_jsx(Text, { medium: true, children: t("story.next") }), _jsx(StoryIcon, { displayInline: true, styledWidth: "15px", glyph: Icon.GLYPHS.right, fillColor: theme.grey })] })) })) })] }));
};
export default FooterBar;
//# sourceMappingURL=StoryFooterBar.js.map