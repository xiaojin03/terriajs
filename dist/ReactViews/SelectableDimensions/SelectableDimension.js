import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { isButton, isCheckbox, isCheckboxGroup, isColor, isEnum, isGroup, isNumeric, isText, isMultiEnum } from "../../Models/SelectableDimensions/SelectableDimensions";
import Box from "../../Styled/Box";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import { parseCustomMarkdownToReactWithOptions } from "../Custom/parseCustomMarkdownToReact";
import { SelectableDimensionButton } from "./Button";
import { SelectableDimensionCheckbox } from "./Checkbox";
import { SelectableDimensionColor } from "./Color";
import { SelectableDimensionGroup } from "./Group";
import { SelectableDimensionNumeric } from "./Numeric";
import { SelectableDimensionEnum, SelectableDimensionEnumMulti as SelectableDimensionMultiEnum } from "./Select";
import { SelectableDimensionText } from "./Text";
const SelectableDimension = ({ id, dim }) => {
    return (_jsxs(Box, { displayInlineBlock: true, fullWidth: true, styledPadding: "5px 0", children: [dim.name && dim.type !== "group" ? (_jsxs(_Fragment, { children: [_jsx("label", { htmlFor: id, children: _jsxs(Text, { textLight: true, medium: true, as: "span", children: [parseCustomMarkdownToReactWithOptions(dim.name, {
                                    inline: true
                                }), ":"] }) }), _jsx(Spacing, { bottom: 1 })] })) : null, isCheckbox(dim) && _jsx(SelectableDimensionCheckbox, { id: id, dim: dim }), isEnum(dim) && _jsx(SelectableDimensionEnum, { id: id, dim: dim }), isMultiEnum(dim) && _jsx(SelectableDimensionMultiEnum, { id: id, dim: dim }), (isGroup(dim) || isCheckboxGroup(dim)) && (_jsx(SelectableDimensionGroup, { id: id, dim: dim })), isNumeric(dim) && _jsx(SelectableDimensionNumeric, { id: id, dim: dim }), isText(dim) && _jsx(SelectableDimensionText, { id: id, dim: dim }), isButton(dim) && _jsx(SelectableDimensionButton, { id: id, dim: dim }), isColor(dim) && _jsx(SelectableDimensionColor, { id: id, dim: dim })] }));
};
export default SelectableDimension;
//# sourceMappingURL=SelectableDimension.js.map