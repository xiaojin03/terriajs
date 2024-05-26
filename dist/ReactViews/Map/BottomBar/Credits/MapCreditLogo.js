import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import CreditDisplay from "terriajs-cesium/Source/Scene/CreditDisplay";
import parseCustomHtmlToReact from "../../../Custom/parseCustomHtmlToReact";
export const MapCreditLogo = ({ currentViewer }) => {
    if (currentViewer.type === "Leaflet") {
        const prefix = currentViewer.attributionPrefix;
        if (prefix) {
            return _jsx(_Fragment, { children: parseCustomHtmlToReact(prefix) });
        }
        return null;
    }
    return parseCustomHtmlToReact(CreditDisplay.cesiumCredit.html, {
        disableExternalLinkIcon: true
    });
};
//# sourceMappingURL=MapCreditLogo.js.map