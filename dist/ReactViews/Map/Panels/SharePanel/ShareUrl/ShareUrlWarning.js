import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";
import { observer } from "mobx-react";
import { getName } from "../../../../../ModelMixins/CatalogMemberMixin";
import Box from "../../../../../Styled/Box";
import Ul, { Li } from "../../../../../Styled/List";
import Text from "../../../../../Styled/Text";
import { isShareable } from "../BuildShareLink";
const WarningBox = styled(Box).attrs({
    paddedRatio: 2,
    rounded: true,
    column: true
}) `
  background: #feb938;
  color: #552800;
`;
const WarningLink = styled.a `
  color: #552800;
  text-decoration: underline;
  cursor: pointer;
`;
export const ShareUrlWarning = observer(({ terria, viewState, callback }) => {
    const { t } = useTranslation();
    const unshareableItems = terria.catalog.userAddedDataGroup.memberModels.filter((model) => !isShareable(terria)(model.uniqueId || ""));
    if (unshareableItems.length === 0) {
        return null;
    }
    const addWebData = () => {
        viewState.openUserData();
        callback();
    };
    return (_jsxs(WarningBox, { children: [_jsxs(Trans, { t: t, i18nKey: "share.localDataNote", children: [_jsx(Text, { bold: true, children: _jsx("strong", { children: "Note:" }) }), _jsxs(Text, { children: ["The following data sources will NOT be shared because they include data from this local system. To share these data sources, publish their data on a web server and", " ", _jsx(WarningLink, { onClick: addWebData, children: "add them using a url" }), "."] })] }), _jsx(Ul, { css: `
            padding: 0;
          `, children: unshareableItems.map((item, i) => {
                    return (_jsx(Li, { children: _jsx("strong", { children: getName(item) }) }, i));
                }) })] }));
});
//# sourceMappingURL=ShareUrlWarning.js.map