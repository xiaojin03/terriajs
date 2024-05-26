import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Box from "../../../Styled/Box";
import Text from "../../../Styled/Text";
import { CollapseBtn, ExitBtn } from "./StoryButtons";
const TitleContainer = styled(Box).attrs({
    fullWidth: true,
    flex: 1,
    verticalCenter: true
}) ``;
const ClampedTitle = styled(Text).attrs({ as: "h3", bold: true }) `
  /* clamp fallback */
  white-space: nowrap;
  text-overflow: ellipsis;

  overflow: hidden;
  padding: 0;
  margin: 0;

  @supports (-webkit-line-clamp: 2) {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: unset;
  }
`;
const TitleBar = ({ title, isCollapsed, collapseHandler, closeHandler }) => {
    const { t } = useTranslation();
    return (_jsxs(Box, { fullWidth: true, gap: 4, paddedRatio: 0, paddedVertically: 2, css: `
        padding-top: 0;
      `, children: [_jsx(TitleContainer, { children: _jsx(ClampedTitle, { children: title ? title : t("story.untitled") }) }), _jsx(CollapseBtn, { isCollapsed: isCollapsed, onClick: collapseHandler }), _jsx(ExitBtn, { onClick: closeHandler })] }));
};
export default TitleBar;
//# sourceMappingURL=TitleBar.js.map