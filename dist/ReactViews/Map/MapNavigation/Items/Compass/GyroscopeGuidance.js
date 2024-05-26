import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Icon from "../../../../../Styled/Icon";
import Box from "../../../../../Styled/Box";
import { TextSpan } from "../../../../../Styled/Text";
import { RawButton } from "../../../../../Styled/Button";
import Spacing from "../../../../../Styled/Spacing";
import MapIconButton from "../../../../MapIconButton/MapIconButton";
// import MenuPanel from "../StandardUserInterface/customizable/MenuPanel";
import CleanDropdownPanel from "../../../../CleanDropdownPanel/CleanDropdownPanel";
import { COMPASS_LOCAL_PROPERTY_KEY } from "./Compass";
GyroscopeGuidance.propTypes = {
    viewState: PropTypes.object.isRequired,
    handleHelp: PropTypes.func,
    onClose: PropTypes.func.isRequired
};
const Text = styled(TextSpan).attrs({
    textAlignLeft: true,
    noFontSize: true
}) ``;
const CompassWrapper = styled(Box).attrs({
    centered: true,
    styledWidth: "64px",
    styledHeight: "64px"
}) `
  flex-shrink: 0;

  svg {
    fill: ${(props) => props.theme.textDarker};
  }
`;
const CompassPositioning = `

`;
const CompassIcon = styled(Icon) `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${(props) => props.inner
    ? `
      fill: ${props.theme.textDarker};
      width: 26px;
      height: 26px;
    `
    : `
      fill: ${props.theme.textLight};
      width: 64px;
      height: 64px;
    `}
  ${(props) => props.darken &&
    `
      opacity: 0.2;
    `}
`;
function GyroscopeGuidancePanel(props) {
    const { t } = useTranslation();
    return (_jsxs(Box, { column: true, paddedRatio: 4, css: `
        direction: ltr;
        min-width: 295px;
      `, children: [_jsx(Text, { large: true, children: t("compass.guidance.title") }), _jsx(Spacing, { bottom: 4 }), _jsxs(Text, { medium: true, children: [_jsxs(Box, { children: [_jsxs(CompassWrapper, { children: [_jsx(CompassIcon, { glyph: Icon.GLYPHS.compassOuterEnlarged }), _jsx(CompassIcon, { glyph: Icon.GLYPHS.compassInnerArrows, inner: true, darken: true })] }), _jsx(Spacing, { right: 2 }), _jsxs(Box, { column: true, children: [_jsx(Text, { bold: true, uppercase: true, children: t("compass.guidance.outerRingTitle") }), _jsx(Spacing, { bottom: 1 }), _jsx(Text, { children: t("compass.guidance.outerRingDescription") })] })] }), _jsx(Spacing, { bottom: 4 }), _jsxs(Box, { children: [_jsxs(CompassWrapper, { children: [_jsx(CompassIcon, { glyph: Icon.GLYPHS.compassOuterEnlarged, css: CompassPositioning, darken: true }), _jsx(CompassIcon, { glyph: Icon.GLYPHS.compassInnerArrows, inner: true }), _jsx(Spacing, { right: 2 })] }), _jsx(Spacing, { right: 2 }), _jsxs(Box, { column: true, children: [_jsx(Text, { bold: true, uppercase: true, children: t("compass.guidance.innerCircleTitle") }), _jsx(Spacing, { bottom: 1 }), _jsx(Text, { children: t("compass.guidance.innerCircleDescription1") }), _jsx(Spacing, { bottom: 2 }), _jsx(Text, { children: t("compass.guidance.innerCircleDescription2") })] })] }), _jsx(Spacing, { bottom: 4 }), _jsx(Text, { children: t("compass.guidance.ctrlDragDescription") }), _jsx(Spacing, { bottom: 4 }), _jsx(RawButton, { onClick: props.onClose, children: _jsx(TextSpan, { displayBlock: true, primary: true, isLink: true, children: t("compass.guidance.dismissText") }) })] })] }));
}
GyroscopeGuidancePanel.propTypes = {
    onClose: PropTypes.func.isRequired
};
export function GyroscopeGuidance(props) {
    const [controlPanelOpen, setControlPanelOpen] = useState(false);
    const controlsMapIcon = useRef();
    const { t } = useTranslation();
    return (_jsxs("div", { css: `
        position: relative;
      `, children: [_jsx(MapIconButton, { roundLeft: true, buttonRef: controlsMapIcon, neverCollapse: true, iconElement: () => _jsx(Icon, { glyph: Icon.GLYPHS.questionMark }), onClick: () => setControlPanelOpen(!controlPanelOpen), inverted: true, css: `
          svg {
            margin: 0px;
            width: 25px;
            height: 25px;
          }
        ` }), _jsx("div", { onClick: (e) => e.preventDefault(), css: `
          position: relative;
        `, children: _jsx(CleanDropdownPanel
                // theme={dropdownTheme}
                // While opacity at this level is not ideal, it's the only way
                // to get the background to be transparent - another step up
                // is setting the opacity layer underneath, and a
                // pseudo-panel on top of it to keep the opacity on top.
                // but that's a lot to do right now
                //   - for a component that is still using sass
                //   - for 0.85 where the contrast is still great.
                , { 
                    // theme={dropdownTheme}
                    // While opacity at this level is not ideal, it's the only way
                    // to get the background to be transparent - another step up
                    // is setting the opacity layer underneath, and a
                    // pseudo-panel on top of it to keep the opacity on top.
                    // but that's a lot to do right now
                    //   - for a component that is still using sass
                    //   - for 0.85 where the contrast is still great.
                    cleanDropdownPanelStyles: css `
            opacity: 0.85;
            .tjs-sc-InnerPanel,
            .tjs-sc-InnerPanel__caret {
              background: ${(p) => p.theme.textBlack};
            }
          `, refForCaret: controlsMapIcon, isOpen: controlPanelOpen, onOpenChanged: () => controlPanelOpen, 
                    // onDismissed={() => setControlPanelOpen(false)}
                    btnTitle: t("compass.guidanceBtnTitle"), btnText: t("compass.guidanceBtnText"), viewState: props.viewState, smallScreen: props.viewState.useSmallScreenInterface, children: _jsx(GyroscopeGuidancePanel, { onClose: () => {
                            setControlPanelOpen(false);
                            props.onClose();
                            props.viewState.terria.setLocalProperty(COMPASS_LOCAL_PROPERTY_KEY, true);
                        } }) }) })] }));
}
//# sourceMappingURL=GyroscopeGuidance.js.map