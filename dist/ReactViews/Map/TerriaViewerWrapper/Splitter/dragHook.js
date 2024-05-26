import { runInAction } from "mobx";
import { useCallback } from "react";
// Feature detect support for passive: true in event subscriptions.
// See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
let passiveSupported = false;
try {
    const options = Object.defineProperty({}, "passive", {
        get: function () {
            passiveSupported = true;
            return true;
        }
    });
    const callback = () => {
        return null;
    };
    window.addEventListener("test", callback, options);
    window.removeEventListener("test", callback, options);
}
catch (err) {
    /* eslint-disable-line no-empty */
}
const notPassive = passiveSupported ? { passive: false } : false;
export const useDragHook = (viewState, padding, thumbSize) => {
    const drag = useCallback((e) => {
        var _a, _b;
        let clientX = undefined;
        let clientY = undefined;
        if (e instanceof MouseEvent) {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        else {
            if (e.targetTouches && e.targetTouches.length > 0) {
                clientX = (_a = e.targetTouches.item(0)) === null || _a === void 0 ? void 0 : _a.clientX;
                clientY = (_b = e.targetTouches.item(0)) === null || _b === void 0 ? void 0 : _b.clientY;
            }
        }
        if (!clientX || !clientY)
            return;
        const viewer = viewState.terria.mainViewer.currentViewer;
        const container = viewer.getContainer();
        const mapRect = container === null || container === void 0 ? void 0 : container.getBoundingClientRect();
        if (!mapRect)
            return;
        let splitFractionX = computeSplitFraction(mapRect.left, mapRect.right, clientX, padding, thumbSize);
        let splitFractionY = computeSplitFraction(mapRect.top, mapRect.bottom, clientY, padding, thumbSize);
        // We compute the maximum and minium windows bounds as a percentage so that we can always apply the bounds
        // restriction as a percentage for consistency (we currently use absolute values for X and percentage values for
        // Y, but always apply the constraint as a percentage).
        // We use absolute pixel values for horizontal restriction because of the fixed UI elements which occupy an
        // absolute amount of screen relestate and 100 px seems like a fine amount for the current UI.
        const minX = computeSplitFraction(mapRect.left, mapRect.right, mapRect.left + 100, padding, thumbSize);
        const maxX = computeSplitFraction(mapRect.left, mapRect.right, mapRect.right - 100, padding, thumbSize);
        // Resctrict to within +/-30% of the center vertically (so we don't run into the top and bottom UI elements).
        const minY = 0.2;
        const maxY = 0.8;
        splitFractionX = Math.min(maxX, Math.max(minX, splitFractionX));
        splitFractionY = Math.min(maxY, Math.max(minY, splitFractionY));
        runInAction(() => {
            viewState.terria.splitPosition = splitFractionX;
            viewState.terria.splitPositionVertical = splitFractionY;
        });
        e.preventDefault();
        e.stopPropagation();
    }, [viewState]);
    const stopDrag = useCallback((e) => {
        dragUnsubscribe();
        const viewer = viewState.terria.currentViewer;
        // Ensure splitter stays in sync with map
        viewState.triggerResizeEvent();
        viewer.resumeMapInteraction();
        e.preventDefault();
        e.stopPropagation();
    }, [viewState]);
    const startDrag = useCallback((e) => {
        const viewer = viewState.terria.currentViewer;
        viewer.pauseMapInteraction();
        // While dragging is in progress, subscribe to document-level movement and up events.
        document.addEventListener("mousemove", drag, notPassive);
        document.addEventListener("touchmove", drag, notPassive);
        document.addEventListener("mouseup", stopDrag, notPassive);
        document.addEventListener("touchend", stopDrag, notPassive);
        e === null || e === void 0 ? void 0 : e.preventDefault();
        e === null || e === void 0 ? void 0 : e.stopPropagation();
    }, [drag, stopDrag, viewState]);
    const dragUnsubscribe = useCallback(() => {
        document.removeEventListener("mousemove", drag, notPassive);
        document.removeEventListener("touchmove", drag, notPassive);
        document.removeEventListener("mouseup", stopDrag, notPassive);
        document.removeEventListener("touchend", stopDrag, notPassive);
    }, [drag, stopDrag]);
    return { startDrag, dragUnsubscribe };
};
function computeSplitFraction(startBound, endBound, position, padding, thumbSize) {
    const difference = endBound - startBound;
    const fraction = (position - startBound) / difference;
    const min = startBound + padding + thumbSize * 0.5;
    const max = endBound - padding - thumbSize * 0.5;
    const minFraction = (min - startBound) / difference;
    const maxFraction = (max - startBound) / difference;
    return Math.min(maxFraction, Math.max(minFraction, fraction));
}
//# sourceMappingURL=dragHook.js.map