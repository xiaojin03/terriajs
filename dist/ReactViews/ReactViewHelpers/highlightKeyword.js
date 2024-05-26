import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
// Really really lightweight highlight without pulling in react-highlight-words
// pros: lightweight
// cons: ???
export default function highlightKeyword(searchResult, keywordToHighlight) {
    if (!keywordToHighlight)
        return searchResult;
    const parts = searchResult.split(new RegExp(`(${keywordToHighlight})`, "gi"));
    return (_jsx(_Fragment, { children: parts.map((part, i) => (_jsx("span", { style: part.toLowerCase() === keywordToHighlight.toLowerCase()
                ? { fontWeight: "bold" }
                : {}, children: part }, i))) }));
}
//# sourceMappingURL=highlightKeyword.js.map