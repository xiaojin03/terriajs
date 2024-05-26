import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { GLYPHS, StyledIcon } from "../../../../Styled/Icon";
import { useViewState } from "../../../Context";
import { useDragHook } from "./dragHook";
export const Splitter = observer(({ thumbSize = 42, padding = 0 }) => {
    const viewState = useViewState();
    const theme = useTheme();
    const { t } = useTranslation();
    const { startDrag, dragUnsubscribe } = useDragHook(viewState, padding, thumbSize);
    const onResize = useCallback(() => {
        const smallChange = viewState.terria.splitPosition < 0.5 ? 0.0001 : -0.0001; // Make sure never <0 or >1.
        runInAction(() => {
            viewState.terria.splitPosition += smallChange;
        });
    }, [viewState]);
    useEffect(() => {
        window.addEventListener("resize", onResize);
        return () => {
            dragUnsubscribe();
            window.removeEventListener("resize", onResize);
        };
    }, [onResize, dragUnsubscribe]);
    if (!viewState.terria.showSplitter ||
        !viewState.terria.currentViewer.canShowSplitter ||
        !viewState.terria.currentViewer.getContainer()) {
        return null;
    }
    const position = getPosition(viewState.terria);
    return (_jsxs("div", { children: [_jsx("div", { style: { position: "absolute", width: "100%", height: "100%" }, children: _jsx("div", { style: {
                        left: `${position.x}px`,
                        position: "absolute",
                        top: "0",
                        bottom: "0",
                        backgroundColor: viewState.terria.baseMapContrastColor,
                        width: "1px",
                        zIndex: 999
                    } }) }), _jsx("button", { style: {
                    position: "absolute",
                    left: `${position.x - thumbSize * 0.5}px`,
                    top: `${position.y - thumbSize * 0.5}px`,
                    width: `${thumbSize}px`,
                    height: `${thumbSize}px`,
                    borderRadius: `${thumbSize * 0.5}px`,
                    border: `1px solid ${theme.greyLighter}`,
                    padding: "8px",
                    zIndex: 999,
                    cursor: "ew-resize",
                    backgroundColor: "white"
                }, onClick: (e) => e.preventDefault(), onMouseDown: startDrag, onTouchStart: startDrag, title: t("splitterTool.title"), children: _jsx(StyledIcon, { glyph: GLYPHS.splitter, fillColor: "black" }) })] }));
});
const getPosition = (terria) => {
    var _a, _b;
    const canvasWidth = ((_a = terria.currentViewer.getContainer()) === null || _a === void 0 ? void 0 : _a.clientWidth) || 0;
    const canvasHeight = ((_b = terria.currentViewer.getContainer()) === null || _b === void 0 ? void 0 : _b.clientHeight) || 0;
    return {
        x: terria.splitPosition * canvasWidth,
        y: terria.splitPositionVertical * canvasHeight
    };
};
//# sourceMappingURL=Splitter.js.map