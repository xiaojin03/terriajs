import { jsx as _jsx } from "react/jsx-runtime";
import { filterSelectableDimensions } from "../../../Models/SelectableDimensions/SelectableDimensions";
import Box from "../../../Styled/Box";
import SelectableDimensionComponent from "../../SelectableDimensions/SelectableDimension";
const GeneratedControlSection = ({ item, controls, placement }) => {
    const enabledDimensions = filterSelectableDimensions(placement)(controls);
    if (enabledDimensions.length === 0) {
        return null;
    }
    return (_jsx(Box, { displayInlineBlock: true, fullWidth: true, children: enabledDimensions.map((dim, i) => (_jsx(SelectableDimensionComponent, { id: `${item.uniqueId}-generated-control-${dim.id}`, dim: dim }, `${item.uniqueId}-generated-control-${dim.id}-fragment`))) }));
};
export default GeneratedControlSection;
//# sourceMappingURL=GeneratedControlSection.js.map