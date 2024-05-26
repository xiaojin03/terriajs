import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import Icon from "../../../../Styled/Icon";
import { useViewState } from "../../../Context";
import MapIconButton from "../../../MapIconButton/MapIconButton";
export const CloseToolButton = () => {
    var _a, _b;
    const { t } = useTranslation();
    const viewState = useViewState();
    const closeText = t("tool.closeButtonTitle", {
        toolName: (_a = viewState.currentTool) === null || _a === void 0 ? void 0 : _a.toolName
    });
    const toolIsDifference = ((_b = viewState.currentTool) === null || _b === void 0 ? void 0 : _b.toolName) === "Difference";
    return (_jsx(MapIconButton, { css: `
        svg {
          width: 13px;
          height: 13px;
        }
      `, title: closeText, splitter: toolIsDifference, expandInPlace: true, iconElement: () => _jsx(Icon, { glyph: Icon.GLYPHS.closeLight }), onClick: () => viewState.closeTool(), children: closeText }));
};
//# sourceMappingURL=CloseToolButton.js.map