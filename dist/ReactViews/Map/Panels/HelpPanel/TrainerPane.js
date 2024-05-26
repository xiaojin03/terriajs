var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import styled from "styled-components";
import StyledHtml from "./StyledHtml";
import Box, { BoxSpan } from "../../../../Styled/Box";
import Button from "../../../../Styled/Button";
import Spacing from "../../../../Styled/Spacing";
import Text from "../../../../Styled/Text";
import { applyTranslationIfExists } from "../../../../Language/languageHelpers";
const UlTrainerItems = styled(Box).attrs({
    as: "ul"
}) `
  ${(p) => p.theme.removeListStyles()}
`;
const TrainerButton = styled(Button) ``;
let TrainerPane = class TrainerPane extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { content, i18n, viewState } = this.props;
        const { trainerItems, markdownText } = content;
        return (_jsx(Text, { textDark: true, noFontSize: true, children: _jsxs(Box, { column: true, children: [markdownText && (_jsx(StyledHtml, { viewState: viewState, markdown: markdownText })), (trainerItems === null || trainerItems === void 0 ? void 0 : trainerItems.map) && (_jsx(UlTrainerItems, { column: true, fullWidth: true, justifySpaceBetween: true, children: trainerItems.map((item, index) => (_jsxs("li", { children: [_jsx(TrainerButton, { secondary: true, fullWidth: true, onClick: () => {
                                        viewState.hideHelpPanel();
                                        viewState.setSelectedTrainerItem(content.itemName);
                                        viewState.setCurrentTrainerItemIndex(index);
                                        viewState.setTrainerBarVisible(true);
                                    }, children: _jsx(BoxSpan, { centered: true, children: _jsx(BoxSpan, { centered: true, children: applyTranslationIfExists(item.title, i18n) }) }) }), _jsx(Spacing, { bottom: 2 })] }, index))) }))] }) }));
    }
};
Object.defineProperty(TrainerPane, "displayName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "TrainerPane"
});
Object.defineProperty(TrainerPane, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        viewState: PropTypes.object.isRequired,
        content: PropTypes.object.isRequired,
        t: PropTypes.func,
        i18n: PropTypes.object.isRequired
    }
});
TrainerPane = __decorate([
    observer
], TrainerPane);
export default withTranslation()(withTheme(TrainerPane));
//# sourceMappingURL=TrainerPane.js.map