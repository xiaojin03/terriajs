import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { observer } from "mobx-react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Box from "../../../../../Styled/Box";
import { Li } from "../../../../../Styled/List";
import Spacing from "../../../../../Styled/Spacing";
import Text from "../../../../../Styled/Text";
import parseCustomHtmlToReact from "../../../../Custom/parseCustomHtmlToReact";
import CloseButton from "../../../../Generic/CloseButton";
import { PrefaceBox } from "../../../../Generic/PrefaceBox";
const AttributionText = styled(Text).attrs(() => ({ medium: true })) `
  a {
    color: ${(props) => props.theme.textDark};
    text-decoration: underline;
    img {
      height: 19px;
      vertical-align: middle;
    }
  }
`;
const DataAttributionBox = styled(Box).attrs({
    position: "absolute",
    styledWidth: "500px",
    styledMaxHeight: "320px",
    backgroundColor: "white",
    rounded: true,
    paddedRatio: 4,
    overflowY: "auto",
    scroll: true,
    column: true
}) `
  z-index: 99989;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.12), 0 10px 20px 0 rgba(0, 0, 0, 0.05);
  @media (max-width: ${(props) => props.theme.mobile}px) {
    width: 100%;
  }

  /* Default cesium bing map logo is white on transparent which is rendered invisible
     on our modal with white background. This rule forces the background color of the
      bing imagery to grey so that it is visible.
  */
  ${AttributionText} img[title="Bing Imagery"] {
    filter: invert(1);
  }
`;
export const DataAttributionModal = observer(({ closeModal, attributions }) => {
    const { t } = useTranslation();
    if (!attributions || attributions.length === 0) {
        return null;
    }
    return ReactDOM.createPortal(_jsxs(_Fragment, { children: [_jsx(PrefaceBox, { onClick: closeModal, role: "presentation", "aria-hidden": "true", pseudoBg: true, css: { top: 0, left: 0, zIndex: 99989 } }), _jsxs(DataAttributionBox, { children: [_jsx(CloseButton, { color: "#red", topRight: true, onClick: closeModal }), _jsx(Text, { extraExtraLarge: true, bold: true, textDarker: true, children: t("map.extraCreditLinks.dataProvider") }), _jsx(Spacing, { bottom: 2 }), _jsx(Box, { paddedHorizontally: 4, children: _jsx("ul", { css: { padding: 0, margin: 0 }, children: attributions.map((attribution, index) => (_jsx(Li, { children: _jsx(AttributionText, { children: parseCustomHtmlToReact(attribution) }) }, index))) }) })] })] }), document.getElementById("map-data-attribution") || document.body);
});
//# sourceMappingURL=DataAttributionModal.js.map