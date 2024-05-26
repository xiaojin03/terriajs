import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { debounce } from "lodash-es";
import { action, runInAction } from "mobx";
import { observer } from "mobx-react";
import { useState } from "react";
import { ChromePicker } from "react-color";
import { useTranslation } from "react-i18next";
import isDefined from "../../Core/isDefined";
import CommonStrata from "../../Models/Definition/CommonStrata";
import { RawButton } from "../../Styled/Button";
import { TextSpan } from "../../Styled/Text";
const debounceSetColorDimensionValue = debounce(action((dim, value) => {
    // Only update value if it has changed
    dim.value !== value
        ? dim.setDimensionValue(CommonStrata.user, value)
        : null;
}), 100);
export const SelectableDimensionColor = observer(({ id, dim }) => {
    var _a;
    const [open, setIsOpen] = useState(false);
    const { t } = useTranslation();
    return (_jsxs("div", { children: [dim.value ? (_jsx("div", { css: {
                    padding: "5px",
                    background: "#fff",
                    borderRadius: "1px",
                    boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
                    display: "inline-block",
                    cursor: "pointer"
                }, onClick: () => setIsOpen(true), children: _jsx("div", { css: {
                        width: "36px",
                        height: "14px",
                        borderRadius: "2px",
                        background: (_a = dim.value) !== null && _a !== void 0 ? _a : "#aaa"
                    } }) })) : null, !dim.value ? (_jsxs(_Fragment, { children: ["\u00A0", _jsx(RawButton, { onClick: () => runInAction(() => dim.setDimensionValue(CommonStrata.user, "#000000")), activeStyles: true, fullHeight: true, children: _jsx(TextSpan, { textLight: true, small: true, light: true, css: { margin: 0 }, children: t("selectableDimensions.colorAdd") }) })] })) : null, dim.value && dim.allowUndefined ? (_jsxs(_Fragment, { children: ["\u00A0", _jsx(RawButton, { onClick: () => runInAction(() => dim.setDimensionValue(CommonStrata.user, undefined)), activeStyles: true, fullHeight: true, children: _jsx(TextSpan, { textLight: true, small: true, light: true, css: { margin: 0 }, children: t("selectableDimensions.colorRemove") }) })] })) : null, open ? (_jsxs("div", { css: {
                    position: "absolute",
                    zIndex: 2
                }, children: [_jsx("div", { css: {
                            position: "fixed",
                            top: "0px",
                            right: "0px",
                            bottom: "0px",
                            left: "0px",
                            width: "340px"
                        }, onClick: () => setIsOpen(false) }), _jsx(ChromePicker, { css: { transform: "translate(50px, -50%);" }, color: dim.value, onChangeComplete: (evt) => {
                            const colorString = isDefined(evt.rgb.a)
                                ? `rgba(${evt.rgb.r},${evt.rgb.g},${evt.rgb.b},${evt.rgb.a})`
                                : `rgb(${evt.rgb.r},${evt.rgb.g},${evt.rgb.b})`;
                            debounceSetColorDimensionValue(dim, colorString);
                        } })] })) : null] }));
});
//# sourceMappingURL=Color.js.map