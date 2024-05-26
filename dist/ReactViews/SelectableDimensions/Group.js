import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import CommonStrata from "../../Models/Definition/CommonStrata";
import { filterSelectableDimensions, isCheckboxGroup, isGroup } from "../../Models/SelectableDimensions/SelectableDimensions";
import Box from "../../Styled/Box";
import Text from "../../Styled/Text";
import Collapsible from "../Custom/Collapsible/Collapsible";
import SelectableDimension from "./SelectableDimension";
/**
 * Component to render a SelectableDimensionGroup or DimensionSelectorCheckboxGroup.
 */
export const SelectableDimensionGroup = ({ id, dim }) => {
    var _a, _b, _c, _d, _e;
    const { t } = useTranslation();
    const childDims = filterSelectableDimensions(dim.placement)(dim.selectableDimensions);
    // Hide static groups with empty children.
    // We still show checkbox groups with empty children as they are stateful.
    if (isGroup(dim) && childDims.length === 0)
        return null;
    return (_jsx(GroupContainer, { children: _jsx(Collapsible, { title: dim.type === "group"
                ? (_b = (_a = dim.name) !== null && _a !== void 0 ? _a : dim.id) !== null && _b !== void 0 ? _b : ""
                : (_e = (_d = (_c = dim.options) === null || _c === void 0 ? void 0 : _c.find((opt) => opt.id === dim.selectedId)) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : (dim.selectedId === "true"
                    ? t("selectableDimensions.enabled")
                    : t("selectableDimensions.disabled")), bodyBoxProps: {
                displayInlineBlock: true,
                fullWidth: true
            }, bodyTextProps: { large: true }, isOpen: dim.type === "group" ? dim.isOpen : dim.selectedId === "true", onToggle: dim.type === "group"
                ? dim.onToggle
                : (isOpen) => dim.setDimensionValue(CommonStrata.user, isOpen ? "true" : "false"), btnStyle: dim.type === "checkbox-group" ? "checkbox" : undefined, btnRight: dim.type === "group", children: _jsxs(Box, { displayInlineBlock: true, fullWidth: true, styledPadding: "5px 0 0 20px", children: [isCheckboxGroup(dim) && childDims.length === 0 && dim.emptyText && (_jsx(Text, { children: dim.emptyText })), childDims.map((nestedDim) => (_jsx(SelectableDimension, { id: `${id}-${nestedDim.id}`, dim: nestedDim }, `${id}-${nestedDim.id}`)))] }) }) }));
};
const GroupContainer = styled.div `
  padding: 10px 12px;
  border-radius: 6px;
  background: ${(p) => p.theme.overlay};
`;
//# sourceMappingURL=Group.js.map