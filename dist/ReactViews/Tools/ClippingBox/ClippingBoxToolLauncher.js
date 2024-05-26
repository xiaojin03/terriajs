import { action } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import ClippingMixin from "../../../ModelMixins/ClippingMixin";
import RepositionClippingBox from "./RepositionClippingBox";
const TOOL_NAME = "reposition-clipping-box";
/**
 * A component that launches the clipping box repositioning tool when it gets
 *  triggerred by the user.
 */
const ClippingBoxToolLauncher = observer(({ viewState }) => {
    const item = findItemRequiringRepositioning(viewState.terria.workbench);
    const cesium = viewState.terria.cesium;
    useEffect(function init() {
        if (!item || !cesium) {
            return;
        }
        viewState.openTool({
            toolName: TOOL_NAME,
            getToolComponent: () => RepositionClippingBox,
            params: { viewState, item, cesium },
            showCloseButton: false
        });
        return action(function cleanup() {
            var _a;
            const currentTool = viewState.currentTool;
            if (currentTool &&
                currentTool.toolName === TOOL_NAME &&
                ((_a = currentTool.params) === null || _a === void 0 ? void 0 : _a.item) === item) {
                item.repositionClippingBoxTrigger = false;
                viewState.closeTool();
            }
        });
    }, [item, cesium]);
    return null;
});
/**
 * Find a workbench item that requires clipping box respositioning
 */
function findItemRequiringRepositioning(workbench) {
    return workbench.items.find((it) => ClippingMixin.isMixedInto(it) &&
        it.clippingBoxDrawing &&
        it.repositionClippingBoxTrigger);
}
export default ClippingBoxToolLauncher;
//# sourceMappingURL=ClippingBoxToolLauncher.js.map