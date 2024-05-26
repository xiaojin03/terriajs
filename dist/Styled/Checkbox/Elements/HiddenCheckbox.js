import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
export default React.forwardRef(function HiddenCheckbox({ isIndeterminate, ...props }, ref) {
    return (_jsx("input", { type: "checkbox", ref: ref, "aria-checked": isIndeterminate ? "mixed" : props.checked, css: {
            appearance: "none",
            clip: "rect(0 0 0 0)",
            overflow: "hidden",
            position: "absolute",
            width: 0,
            margin: 0,
            padding: 0,
            border: 0
        }, ...props }));
});
//# sourceMappingURL=HiddenCheckbox.js.map