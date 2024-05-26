import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Box from "../../../Styled/Box";
import { useViewState } from "../../Context";
import { MapCredits } from "./Credits";
import { DistanceLegend } from "./DistanceLegend";
import { LocationBar } from "./LocationBar";
export const BottomBar = () => {
    var _a;
    const viewState = useViewState();
    return (_jsxs(Box, { fullWidth: true, justifySpaceBetween: true, css: `
        background: linear-gradient(180deg, #000000 0%, #000000 100%);
        font-size: 0.7rem;
        opacity: 0.75;
      `, children: [_jsx(MapCredits, { hideTerriaLogo: !!viewState.terria.configParameters.hideTerriaLogo, credits: (_a = viewState.terria.configParameters.extraCreditLinks) === null || _a === void 0 ? void 0 : _a.slice(), currentViewer: viewState.terria.mainViewer.currentViewer }), _jsxs(Box, { paddedHorizontally: 4, gap: 2, children: [_jsx(LocationBar, { mouseCoords: viewState.terria.currentViewer.mouseCoords }), _jsx(DistanceLegend, {})] })] }));
};
//# sourceMappingURL=BottomBar.js.map