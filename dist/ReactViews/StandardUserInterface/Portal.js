import { jsx as _jsx } from "react/jsx-runtime";
import { action } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import { useViewState } from "../Context";
/**
 * Defines a portal with given id that can be attached by calling <PortalChild portalId={id} />
 */
export const Portal = ({ id, className }) => {
    const viewState = useViewState();
    useEffect(action(() => {
        viewState.portals.set(id, document.getElementById(id));
        return action(() => {
            viewState.portals.delete(id);
        });
    }), [id, className]);
    return _jsx("div", { id: id, className: className });
};
/**
 * Attach children to the <Portal> identified by portalId
 */
export const PortalChild = observer(({ viewState, portalId, children }) => {
    const container = viewState.portals.get(portalId);
    return container ? ReactDOM.createPortal(children, container) : null;
});
//# sourceMappingURL=Portal.js.map