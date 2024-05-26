import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { observer } from "mobx-react";
import React from "react";
import { Translation, withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import { PaneMode } from "../../../ReactViewModels/defaultHelpContent";
import Box from "../../../Styled/Box";
import Button, { RawButton } from "../../../Styled/Button";
import { GLYPHS, StyledIcon } from "../../../Styled/Icon";
import Select from "../../../Styled/Select";
import Spacing from "../../../Styled/Spacing";
import Text, { TextSpan } from "../../../Styled/Text";
import measureElement from "../../HOCs/measureElement";
import { withViewState } from "../../Context";
import { applyTranslationIfExists } from "./../../../Language/languageHelpers";
const StyledHtml = require("../../Map/Panels/HelpPanel/StyledHtml").default;
const CloseButton = require("../../Generic/CloseButton").default;
const TrainerBarWrapper = styled(Box) `
  top: 0;
  left: ${(p) => (p.isMapFullScreen ? 0 : Number(p.theme.workbenchWidth))}px;
  z-index: ${(p) => Number(p.theme.frontComponentZIndex) + 100};
`;
// Help with discoverability
const BoxTrainerExpandedSteps = styled(Box) ``;
const getSelectedTrainerFromHelpContent = (viewState, helpContent) => {
    const selected = viewState.selectedTrainerItem;
    const found = helpContent.find((item) => item.itemName === selected);
    // Try and find the item that we selected, otherwise find the first trainer pane
    return (found || helpContent.find((item) => item.paneMode === PaneMode.trainer));
};
// Ripped from StyledHtml.jsx
const Numbers = styled(Text) `
  width: 22px;
  height: 22px;
  line-height: 22px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.textLight};
`;
const StepText = styled(Text).attrs({}) `
  ol,
  ul {
    padding: 0;
    margin: 0;
    // Dislike these arbitrary aligned numbers but leaving it in for now
    padding-left: 17px;
  }
  li {
    padding-left: 8px;
  }
`;
const renderStep = (step, number, viewState, options = {
    renderDescription: true,
    comfortable: false,
    footerComponent: undefined
}) => {
    var _a;
    return (_jsxs(Box, { paddedVertically: true, children: [_jsxs(Box, { alignItemsFlexStart: true, children: [_jsx(Numbers, { textDarker: true, textAlignCenter: true, darkBg: true, children: number }), _jsx(Spacing, { right: 3 })] }), _jsxs(Box, { column: true, children: [_jsx(Translation, { children: (t, { i18n }) => (_jsx(Text, { textLight: true, extraExtraLarge: true, semiBold: true, children: applyTranslationIfExists(step.title, i18n) })) }), options.renderDescription && (step === null || step === void 0 ? void 0 : step.markdownDescription) && (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: options.comfortable ? 2 : 1 }), _jsx(StepText, { medium: true, textLightDimmed: true, children: _jsx(StyledHtml, { viewState: viewState, styledTextProps: { textDark: false, textLightDimmed: true }, markdown: step.markdownDescription }) })] })), (_a = options.footerComponent) === null || _a === void 0 ? void 0 : _a.call(options)] })] }, number));
};
const renderOrderedStepList = function (steps, viewState) {
    return steps.map((step, index) => (_jsxs(React.Fragment, { children: [renderStep(step, index + 1, viewState), index + 1 !== steps.length && _jsx(Spacing, { bottom: 3 })] }, index)));
};
// Originally written as a SFC but measureElement only supports class components at the moment
class StepAccordionRaw extends React.Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "refToMeasure", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    render() {
        const { viewState, selectedTrainerSteps, t, theme, selectedTrainer, isShowingAllSteps, setIsShowingAllSteps, isExpanded, setIsExpanded, heightFromMeasureElementHOC } = this.props;
        return (_jsxs(Box, { centered: !isExpanded, fullWidth: true, justifySpaceBetween: true, children: [_jsx(Box, { paddedHorizontally: 4, column: true, "aria-hidden": isExpanded, overflow: "hidden", css: `
            max-height: 64px;
            pointer-events: none;
          `, ref: (component) => {
                        if (!isExpanded)
                            this.refToMeasure = component;
                    }, children: renderStep(selectedTrainerSteps[viewState.currentTrainerStepIndex], viewState.currentTrainerStepIndex + 1, viewState, { renderDescription: false, comfortable: true }) }), isExpanded && (_jsx(Box, { paddedHorizontally: 4, column: true, position: "absolute", fullWidth: true, css: `
              top: 0;
              padding-bottom: 20px;
              // This padding forces the absolutely positioned box to align with
              // the relative width in its clone
              padding-right: 60px;
            `, backgroundColor: theme.textBlack, ref: (component) => (this.refToMeasure = component), children: renderStep(selectedTrainerSteps[viewState.currentTrainerStepIndex], viewState.currentTrainerStepIndex + 1, viewState, {
                        renderDescription: true,
                        comfortable: true,
                        footerComponent: () => (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 3 }), _jsx(RawButton, { onClick: () => setIsShowingAllSteps(!isShowingAllSteps), title: isShowingAllSteps
                                        ? t("trainer.hideAllSteps")
                                        : t("trainer.showAllSteps"), children: _jsx(TextSpan, { medium: true, primary: true, isLink: true, textAlignLeft: true, children: isShowingAllSteps
                                            ? t("trainer.hideAllSteps")
                                            : t("trainer.showAllSteps") }) })] }))
                    }) })), _jsx(Box, { paddedHorizontally: 2, children: _jsx(RawButton, { onClick: () => setIsExpanded(!isExpanded), 
                        // onMouseOver={() => setIsPeeking(true)}
                        // onFocus={() => setIsPeeking(true)}
                        title: isExpanded
                            ? t("trainer.collapseTrainer")
                            : t("trainer.expandTrainer"), 
                        // onBlur={() => {
                        //   if (!isExpanded) setIsPeeking(false);
                        // }}
                        css: "z-index:2;", children: _jsx(StyledIcon, { styledWidth: "26px", light: true, glyph: isExpanded ? GLYPHS.accordionClose : GLYPHS.accordionOpen }) }) }), isShowingAllSteps && (_jsxs(BoxTrainerExpandedSteps, { column: true, position: "absolute", backgroundColor: theme.textBlack, fullWidth: true, paddedRatio: 4, overflowY: "auto", css: `
              // top: 32px;
              padding-bottom: 10px;
              top: ${heightFromMeasureElementHOC}px;
              max-height: calc(100vh - ${heightFromMeasureElementHOC}px - 20px);
            `, children: [renderOrderedStepList(selectedTrainerSteps, viewState), selectedTrainer.footnote ? (_jsxs(_Fragment, { children: [_jsx(Spacing, { bottom: 3 }), _jsx(Text, { medium: true, textLightDimmed: true, children: _jsx(StyledHtml, { viewState: viewState, styledTextProps: { textDark: false, textLightDimmed: true }, markdown: selectedTrainer.footnote }) })] })) : (_jsx(Spacing, { bottom: 3 }))] }))] }));
    }
}
const StepAccordion = withTranslation()(withViewState(measureElement(StepAccordionRaw)));
export const TrainerBar = observer((props) => {
    const { i18n, t, theme, viewState } = props;
    const terria = viewState.terria;
    const { helpContent } = terria.configParameters;
    // All these null guards are because we are rendering based on nested
    // map-owner defined (helpContent)content which could be malformed
    if (!viewState.trainerBarVisible || !helpContent) {
        return null;
    }
    const selectedTrainer = getSelectedTrainerFromHelpContent(viewState, helpContent);
    const selectedTrainerItems = selectedTrainer === null || selectedTrainer === void 0 ? void 0 : selectedTrainer.trainerItems;
    if (!selectedTrainerItems) {
        return null;
    }
    const trainerItemIndex = viewState.currentTrainerItemIndex <= selectedTrainerItems.length
        ? viewState.currentTrainerItemIndex
        : 0;
    const selectedTrainerItem = selectedTrainerItems[trainerItemIndex];
    const selectedTrainerSteps = selectedTrainerItem === null || selectedTrainerItem === void 0 ? void 0 : selectedTrainerItem.steps;
    if (!selectedTrainerSteps) {
        return null;
    }
    const isMapFullScreen = viewState.isMapFullScreen;
    return (_jsx(TrainerBarWrapper, { centered: true, position: "absolute", styledWidth: isMapFullScreen
            ? "100%"
            : `calc(100% - ${Number(theme.workbenchWidth)}px)`, isMapFullScreen: isMapFullScreen, onClick: () => viewState.setTopElement("TrainerBar"), children: _jsxs(Box, { fullWidth: true, fullHeight: true, centered: true, justifySpaceBetween: true, backgroundColor: theme.textBlack, children: [_jsx(Box, { css: "min-height: 64px;", children: _jsx(Select, { css: `
              // Overrides on normal select here as we are using a non-normal
              // nowhere-else-in-app usage of select
              width: 290px;
              @media (max-width: ${(p) => p.theme.lg}px) {
                width: 84px;
                // hack to effectively visually disable the current option
                // without minimising select click target
                color: transparent;
              }
            `, paddingForLeftIcon: "45px", leftIcon: () => (_jsx(StyledIcon, { css: "padding-left:15px;", light: true, styledWidth: "21px", glyph: GLYPHS.oneTwoThree })), onChange: (e) => viewState.setCurrentTrainerItemIndex(Number(e.target.value)), value: viewState.currentTrainerItemIndex, children: selectedTrainerItems.map((item, index) => (_jsx("option", { value: index, children: applyTranslationIfExists(item.title, i18n) }, item.title))) }) }), _jsx(StepAccordion, { selectedTrainerSteps: selectedTrainerSteps, isShowingAllSteps: viewState.trainerBarShowingAllSteps, setIsShowingAllSteps: (bool) => viewState.setTrainerBarShowingAllSteps(bool), isExpanded: viewState.trainerBarExpanded, setIsExpanded: (bool) => viewState.setTrainerBarExpanded(bool), selectedTrainer: selectedTrainerItem, theme: theme }), _jsx(Spacing, { right: 4 }), _jsxs(Box, { children: [_jsx(Button, { secondary: true, shortMinHeight: true, css: `
              background: transparent;
              color: ${theme.textLight};
              border-color: ${theme.textLight};
              ${viewState.currentTrainerStepIndex === 0 &&
                                `visibility: hidden;`}
            `, onClick: () => {
                                viewState.setCurrentTrainerStepIndex(viewState.currentTrainerStepIndex - 1);
                            }, children: t("general.back") }), _jsx(Spacing, { right: 2 }), _jsx(Button, { primary: true, shortMinHeight: true, css: `
              ${viewState.currentTrainerStepIndex ===
                                selectedTrainerSteps.length - 1 && `visibility: hidden;`}
            `, onClick: () => {
                                viewState.setCurrentTrainerStepIndex(viewState.currentTrainerStepIndex + 1);
                            }, children: t("general.next") }), _jsx(Spacing, { right: 5 }), _jsx(Box, { centered: true, children: _jsx(CloseButton, { noAbsolute: true, 
                                // topRight
                                color: theme.textLight, onClick: () => viewState.setTrainerBarVisible(false) }) }), _jsx(Spacing, { right: 6 })] })] }) }));
});
export default withTranslation()(withViewState(withTheme(TrainerBar)));
//# sourceMappingURL=TrainerBar.js.map