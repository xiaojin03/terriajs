import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import Spacing from "../../../../Styled/Spacing";
import Text from "../../../../Styled/Text";
import Box from "../../../../Styled/Box";
import styled from "styled-components";
import { applyTranslationIfExists } from "../../../../Language/languageHelpers";
import { parseCustomMarkdownToReactWithOptions } from "../../../Custom/parseCustomMarkdownToReact";
const Numbers = styled(Text) `
  width: 22px;
  height: 22px;
  line-height: 22px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.textDarker};
`;
const renderOrderedList = function (contents) {
    return contents.map((content, i) => (_jsxs(Box, { paddedVertically: true, children: [_jsxs(Box, { alignItemsFlexStart: true, children: [_jsx(Numbers, { textLight: true, textAlignCenter: true, darkBg: true, children: i + 1 }), _jsx(Spacing, { right: 3 })] }), _jsx(Text, { medium: true, textDark: true, children: content })] }, i)));
};
export class StyledHtmlRaw extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { viewState, injectTooltips, i18n } = this.props;
        const styledTextProps = this.props.styledTextProps || {};
        const markdownToParse = applyTranslationIfExists(this.props.markdown, i18n);
        const parsed = parseCustomMarkdownToReactWithOptions(markdownToParse, {
            injectTermsAsTooltips: injectTooltips,
            tooltipTerms: viewState.terria.configParameters.helpContentTerms
        });
        const content = Array.isArray(parsed.props.children)
            ? parsed.props.children
            : [parsed.props.children];
        return (_jsx("div", { children: (content === null || content === void 0 ? void 0 : content.map) &&
                content.map((item, i) => {
                    if (!item)
                        return null;
                    /* Either a header or paragraph tag */
                    if (/(h[0-6]|p)/i.test(item.type)) {
                        return (_jsx(Text, { as: item.type, textDark: true, medium: item.type === "p", ...styledTextProps, children: item.props.children }, i));
                    }
                    else if (item.type === "ol") {
                        return (_jsxs(_Fragment, { children: [renderOrderedList(item.props.children.map((point) => point.props.children)), _jsx(Spacing, { bottom: 4 })] }));
                        /* If it's none of the above tags, just render as
                            normal html but with the same text formatting.
                            We can style more tags as necessary */
                    }
                    else {
                        return (_jsx(Text, { textDark: true, medium: true, ...styledTextProps, children: item }, i));
                    }
                }) }));
    }
}
Object.defineProperty(StyledHtmlRaw, "displayName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "StyledHtml"
});
Object.defineProperty(StyledHtmlRaw, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        markdown: PropTypes.string.isRequired,
        viewState: PropTypes.object.isRequired,
        theme: PropTypes.object,
        styledTextProps: PropTypes.object,
        injectTooltips: PropTypes.bool,
        t: PropTypes.func.isRequired,
        i18n: PropTypes.object.isRequired
    }
});
Object.defineProperty(StyledHtmlRaw, "defaultProps", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        injectTooltips: true
    }
});
export default withTranslation()(withTheme(observer(StyledHtmlRaw)));
//# sourceMappingURL=StyledHtml.js.map