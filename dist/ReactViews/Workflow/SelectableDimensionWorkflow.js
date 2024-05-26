import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { action } from "mobx";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { getName } from "../../ModelMixins/CatalogMemberMixin";
import { filterSelectableDimensions } from "../../Models/SelectableDimensions/SelectableDimensions";
import SelectableDimension from "../SelectableDimensions/SelectableDimension";
import { useViewState } from "../Context";
import WorkbenchItemControls, { hideAllControls } from "../Workbench/Controls/WorkbenchItemControls";
import { Panel } from "./Panel";
import { PanelMenu } from "./PanelMenu";
import WorkflowPanel from "./WorkflowPanel";
/** Two main components:
 * - Title panel with `title`, item `WorkbenchItemControls` and menu
 * - Panel for each top-level selectable dimension
 */
const SelectableDimensionWorkflow = observer(() => {
    const viewState = useViewState();
    const terria = viewState.terria;
    const [t] = useTranslation();
    return terria.selectableDimensionWorkflow ? (_jsxs(WorkflowPanel, { viewState: viewState, icon: terria.selectableDimensionWorkflow.icon, title: terria.selectableDimensionWorkflow.name, closeButtonText: t("compare.done"), onClose: action(() => {
            terria.selectableDimensionWorkflow = undefined;
        }), footer: terria.selectableDimensionWorkflow.footer, children: [_jsx(Panel, { title: getName(terria.selectableDimensionWorkflow.item), menuComponent: terria.selectableDimensionWorkflow.menu ? (_jsx(PanelMenu, { ...terria.selectableDimensionWorkflow.menu })) : undefined, children: _jsx(WorkbenchItemControls, { item: terria.selectableDimensionWorkflow.item, viewState: viewState, controls: {
                        ...hideAllControls,
                        opacity: true,
                        timer: true,
                        dateTime: true,
                        shortReport: true
                    } }) }), terria.selectableDimensionWorkflow.selectableDimensions.map((groupDim, i) => {
                var _a, _b, _c;
                if (groupDim.disable)
                    return null;
                const childDims = filterSelectableDimensions()(groupDim.selectableDimensions);
                if (childDims.length === 0)
                    return null;
                return (_jsx(Panel, { title: (_a = groupDim.name) !== null && _a !== void 0 ? _a : groupDim.id, isOpen: (_b = groupDim.isOpen) !== null && _b !== void 0 ? _b : true, onToggle: groupDim.onToggle, collapsible: true, children: childDims.map((childDim) => {
                        var _a, _b;
                        return (_jsx(SelectableDimension, { id: `${(_a = terria.selectableDimensionWorkflow) === null || _a === void 0 ? void 0 : _a.item.uniqueId}-${childDim.id}`, dim: childDim }, `${(_b = terria.selectableDimensionWorkflow) === null || _b === void 0 ? void 0 : _b.item.uniqueId}-${childDim.id}-fragment`));
                    }) }, (_c = groupDim.name) !== null && _c !== void 0 ? _c : groupDim.id));
            })] })) : null;
});
export default SelectableDimensionWorkflow;
//# sourceMappingURL=SelectableDimensionWorkflow.js.map