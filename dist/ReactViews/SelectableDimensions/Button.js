import { jsx as _jsx } from "react/jsx-runtime";
import { runInAction } from "mobx";
import CommonStrata from "../../Models/Definition/CommonStrata";
import { StyledIcon } from "../../Styled/Icon";
import Text from "../../Styled/Text";
import { parseCustomMarkdownToReactWithOptions } from "../Custom/parseCustomMarkdownToReact";
import Button from "../../Styled/Button";
import AnimatedSpinnerIcon from "../../Styled/AnimatedSpinnerIcon";
export const SelectableDimensionButton = ({ id, dim }) => {
    var _a;
    const iconGlyph = dim.icon;
    const iconProps = { light: true, styledWidth: "16px", styledHeight: "16px" };
    return (_jsx(Button, { onClick: () => runInAction(() => dim.setDimensionValue(CommonStrata.user, true)), activeStyles: true, shortMinHeight: true, renderIcon: () => iconGlyph === "spinner" ? (_jsx(AnimatedSpinnerIcon, { ...iconProps })) : iconGlyph ? (_jsx(StyledIcon, { glyph: iconGlyph, ...iconProps })) : undefined, style: { backgroundColor: "transparent" }, children: _jsx("div", { style: { display: "flex" }, children: _jsx(Text, { textLight: true, children: parseCustomMarkdownToReactWithOptions((_a = dim.value) !== null && _a !== void 0 ? _a : "", {
                    inline: true
                }) }) }) }));
};
//# sourceMappingURL=Button.js.map