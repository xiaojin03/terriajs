import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * A generic Guide component, look at
 * `satellite-guidance.js` && `SatelliteGuide.jsx`
 * for example data / usage
 *
 * consume something like:

  <Guide
    hasIntroSlide
    // Use this as guide won't track viewstate
    isTopElement={viewState.topElement === "Guide"}
    terria={terria}
    guideKey={SATELLITE_GUIDE_KEY}
    guideData={SatelliteGuideData}
    showGuide={viewState.showSatelliteGuidance}
    setShowGuide={bool => {
      viewState.showSatelliteGuidance = bool;
      // If we're closing for any reason, set prompted to true
      if (!bool) {
        viewState.toggleFeaturePrompt("satelliteGuidance", true, true);
      }
    }}
  />

 *
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Styles from "./guide.scss";
// import createReactClass from "create-react-class";
// // import knockout from "terriajs-cesium/Source/ThirdParty/knockout";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import { useTranslation } from "react-i18next";
import Button from "../../Styled/Button";
import Box from "../../Styled/Box";
import { Category, GuideAction } from "../../Core/AnalyticEvents/analyticEvents";
const GuideProgress = (props) => {
    // doesn't work for IE11
    // const countArray = Array.from(Array(props.maxStepCount).keys()).map(e => e++);
    const countArray = [];
    for (let i = 0; i < props.maxStepCount; i++) {
        countArray.push(i);
    }
    const currentStep = props.currentStep;
    return (_jsx("div", { className: Styles.indicatorWrapper, children: countArray.map((count) => {
            return (_jsx("div", { className: classNames(Styles.indicator, {
                    [Styles.indicatorEnabled]: count < currentStep
                }) }, count));
        }) }));
};
GuideProgress.propTypes = {
    maxStepCount: PropTypes.number.isRequired,
    currentStep: PropTypes.number.isRequired
};
export const analyticsSetShowGuide = (isOpen, index, guideKey, terria, options = {
    setCalledFromInside: false
}) => {
    var _a;
    const action = options.setCalledFromInside
        ? isOpen
            ? GuideAction.openInModal
            : GuideAction.closeInModal
        : isOpen
            ? GuideAction.open
            : GuideAction.close;
    (_a = terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.guide, action, `At index: ${index}, Guide: ${guideKey}`);
};
export const GuidePure = ({ terria, guideKey, hasIntroSlide = false, guideData, setShowGuide }) => {
    // Handle index locally for now (unless we do a "open guide at X point" in the future?)
    const [currentGuideIndex, setCurrentGuideIndex] = useState(0);
    const handlePrev = () => {
        var _a;
        const newIndex = currentGuideIndex - 1;
        (_a = terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.guide, GuideAction.navigatePrev, `New index: ${newIndex}, Guide: ${guideKey}`);
        if (currentGuideIndex === 0) {
            handleSetShowGuide(false);
        }
        else {
            setCurrentGuideIndex(newIndex);
        }
    };
    const handleNext = () => {
        var _a;
        const newIndex = currentGuideIndex + 1;
        if (guideData[newIndex]) {
            (_a = terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.guide, GuideAction.navigateNext, `New index: ${newIndex}, Guide: ${guideKey}`);
            setCurrentGuideIndex(newIndex);
        }
        else {
            handleSetShowGuide(false);
        }
    };
    const { t } = useTranslation();
    const handleSetShowGuide = (bool) => {
        analyticsSetShowGuide(bool, currentGuideIndex, guideKey, terria, {
            setCalledFromInside: true
        });
        setShowGuide(bool);
    };
    const currentGuide = guideData[currentGuideIndex] || {};
    const hidePrev = currentGuide.hidePrev || false;
    const hideNext = currentGuide.hideNext || false;
    const prevButtonText = currentGuide.prevText || t("general.prev");
    const nextButtonText = currentGuide.nextText || t("general.next");
    const maxStepCount = hasIntroSlide ? guideData.length - 1 : guideData.length;
    const currentStepCount = hasIntroSlide
        ? currentGuideIndex
        : currentGuideIndex + 1;
    return (_jsxs(Box, { displayInlineBlock: true, children: [_jsx(Box, { fullWidth: true, styledHeight: "254px", backgroundImage: currentGuide.imageSrc }), _jsx(Spacing, { bottom: 5 }), _jsxs(Box, { paddedHorizontally: 1, displayInlineBlock: true, children: [_jsx(Text, { textDark: true, bold: true, subHeading: true, children: currentGuide.title }), _jsx(Spacing, { bottom: 5 }), _jsx(Box, { styledMinHeight: "100px", fullWidth: true, children: _jsx(Text, { textDark: true, medium: true, children: currentGuide.body }) }), _jsx(Spacing, { bottom: 7 }), _jsxs(Box, { children: [_jsx(Box, { css: `
              margin-right: auto;
            `, children: _jsx(GuideProgress, { currentStep: currentStepCount, maxStepCount: maxStepCount }) }), !hidePrev && (_jsx(Button, { secondary: true, onClick: () => handlePrev(), styledMinWidth: "94px", children: prevButtonText })), _jsx(Spacing, { right: 2 }), _jsx(Button, { primary: true, onClick: () => handleNext(), styledMinWidth: "94px", css: hideNext && `visibility: hidden;`, children: nextButtonText })] })] })] }));
};
GuidePure.propTypes = {
    terria: PropTypes.object.isRequired,
    guideKey: PropTypes.string.isRequired,
    guideData: PropTypes.array.isRequired,
    setShowGuide: PropTypes.func.isRequired,
    guideClassName: PropTypes.string,
    hasIntroSlide: PropTypes.bool
};
export default GuidePure;
//# sourceMappingURL=Guide.js.map