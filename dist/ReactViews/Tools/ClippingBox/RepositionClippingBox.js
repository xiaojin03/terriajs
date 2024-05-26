import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { action } from "mobx";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import ScreenSpaceEventHandler from "terriajs-cesium/Source/Core/ScreenSpaceEventHandler";
import ScreenSpaceEventType from "terriajs-cesium/Source/Core/ScreenSpaceEventType";
import CommonStrata from "../../../Models/Definition/CommonStrata";
import Text from "../../../Styled/Text";
import LatLonHeightTraits from "../../../Traits/TraitsClasses/LatLonHeightTraits";
const pickScratch = new Cartesian3();
/**
 * A tool for repositioning the clipping box.
 *
 * It moves the clipping box to follow the mouse and places it where the user has clicked.
 * Action can be cancelled by pressing Escape button.
 */
const RepositionClippingBox = observer(({ cesium, item }) => {
    const promptRef = useRef(null);
    // End repositioning
    const endRepositioning = action((item) => {
        item.repositionClippingBoxTrigger = false;
        // A hacky way to re-compute the boxDrawing so that it gets reset to the
        // saved trait position.
        item.clippingBox.setTrait(CommonStrata.user, "showClippingBox", false);
        window.setTimeout(action(() => item.clippingBox.setTrait(CommonStrata.user, "showClippingBox", true)), 100);
    });
    // Move the clipping box and cursor prompt to follow the mouse
    const moveItem = (item, canvasCursorPos, cesium) => {
        var _a;
        const prompt = promptRef.current;
        if (prompt === null) {
            return;
        }
        const pickPosition = pickGlobePosition(canvasCursorPos, cesium.scene, pickScratch);
        if (!pickPosition) {
            return;
        }
        const rect = cesium.scene.canvas.getBoundingClientRect();
        const offset = 10; // 10px away from the cursor
        const left = canvasCursorPos.x + rect.left + offset;
        const top = canvasCursorPos.y + rect.top + offset;
        if (left <= rect.left) {
            return;
        }
        prompt.style.left = `${left}px`;
        prompt.style.top = `${top}px`;
        const boxDrawing = item.clippingBoxDrawing;
        // A hacky way to set boxDrawing position without setting the traits and
        // consequently triggering expensive recomputation
        boxDrawing.setPosition(pickPosition);
        (_a = boxDrawing.onChange) === null || _a === void 0 ? void 0 : _a.call(boxDrawing, {
            isFinished: false,
            modelMatrix: boxDrawing.modelMatrix,
            translationRotationScale: boxDrawing.trs
        });
    };
    // Place the clipping box at the screen position
    const placeItem = (item, screenPosition, cesium) => {
        const position = pickGlobePosition(screenPosition, cesium.scene, pickScratch);
        if (!position) {
            return false;
        }
        LatLonHeightTraits.setFromCartesian(item.clippingBox.position, CommonStrata.user, position);
        return true;
    };
    // Init effect that sets up the event handlers etc.
    useEffect(action(function init() {
        const canvas = cesium.scene.canvas;
        const boxDrawing = item.clippingBoxDrawing;
        boxDrawing.stopInteractions();
        boxDrawing.enableScaling = false;
        boxDrawing.enableRotation = false;
        setCursor(canvas, "crosshair");
        cesium.isFeaturePickingPaused = true;
        if (promptRef.current)
            setCursor(promptRef.current, "grabbing");
        const inputHandler = new ScreenSpaceEventHandler(canvas);
        inputHandler.setInputAction(({ endPosition }) => {
            moveItem(item, endPosition, cesium);
        }, ScreenSpaceEventType.MOUSE_MOVE);
        inputHandler.setInputAction(({ position }) => placeItem(item, position, cesium) && endRepositioning(item), ScreenSpaceEventType.LEFT_CLICK);
        const escapeKeyHandler = (ev) => ev.key === "Escape" && endRepositioning(item);
        document.addEventListener("keydown", escapeKeyHandler);
        return function destroy() {
            var _a, _b;
            inputHandler.destroy();
            setCursor(canvas, "auto");
            if (promptRef.current)
                setCursor(promptRef.current, "auto");
            if ((_b = (_a = item.clippingBoxDrawing) === null || _a === void 0 ? void 0 : _a.dataSource) === null || _b === void 0 ? void 0 : _b.show) {
                item.clippingBoxDrawing.startInteractions();
            }
            document.removeEventListener("keydown", escapeKeyHandler);
            cesium.isFeaturePickingPaused = false;
            endRepositioning(item);
        };
    }), [item, cesium]);
    const initialX = window.innerWidth / 2;
    const initualY = window.innerHeight / 2;
    return (_jsxs(CursorPrompt, { ref: promptRef, x: initialX, y: initualY, children: [_jsx(Text, { medium: true, bold: true, style: { marginBottom: "5px" }, children: "Click on map to position clipping box" }), _jsx(Text, { small: true, textAlignCenter: true, children: "Press ESC to cancel" })] }));
});
const CursorPrompt = styled.div.attrs(({ x, y }) => ({
    style: {
        left: x + 10,
        top: y + 10
    }
})) `
  position: absolute;
  overflow: visible;
  white-space: nowrap;
  max-width: 500px;
  background-color: #2563eb;
  color: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0px 10px 15px -3px #0000001a;
`;
function setCursor(el, cursorName) {
    el.style.cursor = cursorName;
}
function truncate(text, length) {
    return text.length <= length ? text : `${text.slice(0, length)}...`;
}
function pickGlobePosition(screenCoords, scene, result) {
    const pickRay = scene.camera.getPickRay(screenCoords);
    return pickRay ? scene.globe.pick(pickRay, scene, result) : undefined;
}
export default RepositionClippingBox;
//# sourceMappingURL=RepositionClippingBox.js.map