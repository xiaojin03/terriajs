import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { autorun } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import { applyTranslationIfExists } from "../../../Language/languageHelpers";
import Box, { BoxSpan } from "../../../Styled/Box";
import { StyledIcon } from "../../../Styled/Icon";
import Spacing from "../../../Styled/Spacing";
import Text from "../../../Styled/Text";
import { useViewState } from "../../Context";
import CloseButton from "../../Generic/CloseButton";
import { PrefaceBox } from "../../Generic/PrefaceBox";
import { filterViewerAndScreenSize } from "./filterViewerAndScreenSize";
const CollapsedNavigationBox = styled(Box).attrs({
    position: "absolute",
    styledWidth: "500px",
    styledMaxHeight: "320px",
    backgroundColor: "white",
    rounded: true,
    paddedRatio: 4,
    overflowY: "auto",
    scroll: true
}) `
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.12), 0 10px 20px 0 rgba(0, 0, 0, 0.05);
  @media (max-width: ${(props) => props.theme.mobile}px) {
    width: 100%;
  }
`;
const ButtonsBox = styled(Box).attrs({}) `
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  position: relative;
  margin-bottom: 10px;
  gap: 20px;
`;
const NavigationButton = styled(BoxSpan).attrs({
    boxShadow: true,
    centered: true,
    rounded: true
}) `
  cursor: pointer;
  &:hover {
    border: 2px solid ${(p) => p.theme.darkWithOverlay};
    svg {
      opacity: 0.9;
    }
  }
  :before {
    content: "";
    display: block;
    height: 0;
    width: 0;
    padding-bottom: 100%;
  }
  ${(props) => props.disabled &&
    `
    background-color: ${props.theme.grey};
    color: ${props.theme.grey};
    opacity: 0.7;
    svg {
      fill: ${props.theme.textLightDimmed};
    }
    &[disabled] {
      cursor: not-allowed;
    }
  `}
`;
const CollapsedNavigationPanel = observer((props) => {
    const viewState = useViewState();
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const items = props.items;
    return (_jsxs(CollapsedNavigationBox, { column: true, children: [_jsx(CloseButton, { color: theme.darkWithOverlay, topRight: true, onClick: () => viewState.closeCollapsedNavigation() }), _jsx(Text, { extraExtraLarge: true, bold: true, textDarker: true, children: t("mapNavigation.additionalTools") }), _jsx(Spacing, { bottom: 5 }), _jsx(ButtonsBox, { children: items.map((item) => (_jsx(NavigationButton, { title: applyTranslationIfExists(item.name, i18n), onClick: () => {
                        if (!item.controller.disabled) {
                            viewState.closeCollapsedNavigation();
                            item.controller.handleClick();
                        }
                    }, css: `
                ${item.controller.active &&
                        `border: 2px solid ${theme.colorPrimary};`}
              `, disabled: item.controller.disabled, children: _jsx(StyledIcon, { glyph: item.controller.glyph, styledWidth: "22px", dark: true }) }, item.id))) })] }));
});
const CollapsedNavigationDisplayName = "CollapsedNavigation";
export const CollapsedNavigation = observer(() => {
    const viewState = useViewState();
    useEffect(() => autorun(() => {
        if (viewState.showCollapsedNavigation &&
            viewState.topElement !== CollapsedNavigationDisplayName) {
            viewState.setTopElement(CollapsedNavigationDisplayName);
        }
    }));
    let items = viewState.terria.mapNavigationModel.items.filter((item) => item.controller.collapsed);
    items = items.filter((item) => filterViewerAndScreenSize(item, viewState));
    if (!viewState.showCollapsedNavigation || items.length === 0) {
        viewState.closeCollapsedNavigation();
        return null;
    }
    return (_jsxs(_Fragment, { children: [_jsx(PrefaceBox, { onClick: () => viewState.closeCollapsedNavigation(), role: "presentation", "aria-hidden": "true", pseudoBg: true }), _jsx(CollapsedNavigationPanel, { items: items })] }));
});
//# sourceMappingURL=CollapsedNavigation.js.map