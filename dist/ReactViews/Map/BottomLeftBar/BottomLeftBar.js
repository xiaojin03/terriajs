import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import defined from "terriajs-cesium/Source/Core/defined";
import ViewerMode from "../../../Models/ViewerMode";
import Box from "../../../Styled/Box";
import Icon from "../../../Styled/Icon";
import Text from "../../../Styled/Text";
import MapDataCount from "../../BottomDock/MapDataCount";
import { useViewState } from "../../Context";
import parseCustomHtmlToReact from "../../Custom/parseCustomHtmlToReact";
import MapIconButton from "../../MapIconButton/MapIconButton";
const BottomLeftContainer = styled(Box) `
  position: absolute;
  bottom: 40px;
  @media (max-width: ${(props) => props.theme.mobile}px) {
    bottom: 35px;
  }
  display: flex;
`;
// Use padding to avoid other UI elements
const AttributionsContainer = styled(Text) `
  text-shadow: 0 0 2px #000000;
  padding-left: 8px;
  padding-right: 56px;
  @media (max-width: ${(props) => props.theme.mobile}px) {
    padding-right: 8px;
    padding-bottom: 32px;
  }
`;
const shouldShowPlayStoryButton = (viewState) => viewState.terria.configParameters.storyEnabled &&
    defined(viewState.terria.stories) &&
    viewState.terria.stories.length > 0 &&
    viewState.useSmallScreenInterface;
const BottomLeftBar = observer(() => {
    var _a;
    const { t } = useTranslation();
    const theme = useTheme();
    const viewState = useViewState();
    const screenDataAttributions = (_a = viewState.terria.cesium) === null || _a === void 0 ? void 0 : _a.cesiumScreenDataAttributions;
    const isNotificationActive = viewState.terria.notificationState.currentNotification;
    const isUsingGooglePhotorealistic3dTiles = viewState.terria.mainViewer.viewerMode === ViewerMode.Cesium &&
        viewState.terria.workbench.items
            .filter((i) => i.type === "3d-tiles")
            .some((i) => {
            var _a;
            return ((_a = i.url) === null || _a === void 0 ? void 0 : _a.startsWith("https://tile.googleapis.com/v1/3dtiles/root.json")) && i.show;
        });
    return (_jsxs(BottomLeftContainer, { theme: theme, children: [_jsx(MapDataCount, { terria: viewState.terria, viewState: viewState, elementConfig: viewState.terria.elements.get("map-data-count") }), shouldShowPlayStoryButton(viewState) ? (_jsx(Box, { paddedHorizontally: 2, children: _jsx(MapIconButton, { title: t("story.playStory"), neverCollapse: true, iconElement: () => _jsx(Icon, { glyph: Icon.GLYPHS.playStory }), onClick: () => viewState.runStories(), primary: !isNotificationActive, children: t("story.playStory") }) })) : null, isUsingGooglePhotorealistic3dTiles && (_jsx("img", { height: "18px", style: { paddingLeft: "8px" }, src: "build/TerriaJS/images/google_on_non_white_hdpi.png" })), !!(screenDataAttributions === null || screenDataAttributions === void 0 ? void 0 : screenDataAttributions.length) && (_jsx(AttributionsContainer, { textLight: true, mini: true, children: screenDataAttributions
                    .flatMap((attributionHtml, i) => [
                    _jsx("span", { children: parseCustomHtmlToReact(attributionHtml) }, attributionHtml),
                    _jsx("span", { children: " \u2022 " }, `delimiter-${i}`)
                ])
                    .slice(0, -1) }))] }));
});
export default BottomLeftBar;
//# sourceMappingURL=BottomLeftBar.js.map