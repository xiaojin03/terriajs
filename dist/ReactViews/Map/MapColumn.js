import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import Box from "../../Styled/Box";
import ActionBarPortal from "../ActionBar/ActionBarPortal";
import BottomDock from "../BottomDock/BottomDock";
import { useViewState } from "../Context";
import Loader from "../Loader";
import SlideUpFadeIn from "../Transitions/SlideUpFadeIn/SlideUpFadeIn";
import { BottomBar } from "./BottomBar";
import BottomLeftBar from "./BottomLeftBar/BottomLeftBar";
import { MapNavigation } from "./MapNavigation";
import MenuBar from "./MenuBar/MenuBar";
import { ProgressBar } from "./ProgressBar";
import { TerriaViewerWrapper } from "./TerriaViewerWrapper";
import Toast from "./Toast";
/**
 * Right-hand column that contains the map, controls that sit over the map and sometimes the bottom dock containing
 * the timeline and charts.
 */
export const MapColumn = observer(({ customFeedbacks, customElements, animationDuration }) => {
    const viewState = useViewState();
    const { t } = useTranslation();
    return (_jsxs(Box, { column: true, fullWidth: true, fullHeight: true, css: `
          * {
            box-sizing: border-box;
          }
        `, children: [_jsxs(Box, { column: true, fullWidth: true, fullHeight: true, children: [_jsx("div", { css: {
                            position: "absolute",
                            top: "0",
                            left: "0",
                            zIndex: 1,
                            width: "100%"
                        }, children: _jsx(ProgressBar, {}) }), !viewState.hideMapUi && (_jsxs("div", { css: `
                ${viewState.explorerPanelIsVisible && "opacity: 0.3;"}
              `, children: [_jsx(MenuBar
                            // @ts-ignore
                            , { 
                                // @ts-ignore
                                menuItems: customElements.menu, menuLeftItems: customElements.menuLeft, animationDuration: animationDuration, elementConfig: viewState.terria.elements.get("menu-bar") }), _jsx(MapNavigation, { viewState: viewState, navItems: customElements.nav, elementConfig: viewState.terria.elements.get("map-navigation") })] })), _jsx(Box, { position: "absolute", css: { top: "0", zIndex: 0 }, fullWidth: true, fullHeight: true, children: _jsx(TerriaViewerWrapper, {}) }), !viewState.hideMapUi && (_jsxs(_Fragment, { children: [_jsx(BottomLeftBar, {}), _jsx(ActionBarPortal, { show: viewState.isActionBarVisible }), _jsx(SlideUpFadeIn, { isVisible: viewState.isMapZooming, children: _jsx(Toast, { children: _jsx(Loader, { message: t("toast.mapIsZooming"), textProps: {
                                            style: {
                                                padding: "0 5px"
                                            }
                                        } }) }) }), _jsx(Box, { position: "absolute", fullWidth: true, css: { bottom: "0", left: "0" }, children: _jsx(BottomBar, {}) }), viewState.terria.configParameters.printDisclaimer && (_jsx("a", { css: `
                    display: none;
                    @media print {
                      display: block;
                      width: 100%;
                      clear: both;
                    }
                  `, href: viewState.terria.configParameters.printDisclaimer.url, children: viewState.terria.configParameters.printDisclaimer.text }))] }))] }), _jsx("div", { children: !viewState.hideMapUi && (_jsx(BottomDock, { terria: viewState.terria, viewState: viewState, elementConfig: viewState.terria.elements.get("bottom-dock") })) })] }));
});
export default MapColumn;
//# sourceMappingURL=MapColumn.js.map