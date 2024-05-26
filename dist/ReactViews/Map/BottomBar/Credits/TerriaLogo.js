import { jsx as _jsx } from "react/jsx-runtime";
import Box from "../../../../Styled/Box";
const logo = require("../../../../../wwwroot/images/terria-watermark.svg");
export const TerriaLogo = () => {
    return (_jsx(Box, { as: "a", target: "_blank", rel: "noopener noreferrer", href: "https://terria.io/", children: _jsx("img", { css: { height: "24px" }, src: logo, title: "Built with Terria" }) }));
};
//# sourceMappingURL=TerriaLogo.js.map