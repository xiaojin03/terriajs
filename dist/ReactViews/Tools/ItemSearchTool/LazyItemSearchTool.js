import { jsx as _jsx } from "react/jsx-runtime";
import i18next from "i18next";
import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import AnimatedSpinnerIcon from "../../../Styled/AnimatedSpinnerIcon";
import RaiseToUserErrorBoundary from "../../Errors/RaiseToUserErrorBoundary";
import { Frame, Main } from "../ToolModal";
const ItemSearchTool = React.lazy(() => import("./ItemSearchTool"));
/**
 * Lazily loads the item search tool while showing a the search window and an animated spinner.
 */
const LazyItemSearchTool = (props) => {
    const { viewState, item } = props;
    const itemName = CatalogMemberMixin.isMixedInto(item) ? item.name : "Item";
    const [t] = useTranslation();
    return (_jsx(Suspense, { fallback: _jsx(Frame, { viewState: viewState, title: t("itemSearchTool.title", { itemName }), children: _jsx(Wrapper, { children: _jsx(AnimatedSpinnerIcon, { light: true, styledWidth: "25px", styledHeight: "25px" }) }) }), children: _jsx(RaiseToUserErrorBoundary, { viewState: viewState, terriaErrorOptions: {
                title: i18next.t("itemSearchTool.toolLoadError")
            }, children: _jsx(ItemSearchTool, { ...props }) }) }));
};
const Wrapper = styled(Main) `
  align-items: center;
  justify-content: center;
`;
export default LazyItemSearchTool;
//# sourceMappingURL=LazyItemSearchTool.js.map