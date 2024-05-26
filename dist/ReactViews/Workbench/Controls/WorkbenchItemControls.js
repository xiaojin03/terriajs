import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { observer } from "mobx-react";
import TerriaError from "../../../Core/TerriaError";
import DiscretelyTimeVaryingMixin from "../../../ModelMixins/DiscretelyTimeVaryingMixin";
import hasTraits from "../../../Models/Definition/hasTraits";
import { DEFAULT_PLACEMENT } from "../../../Models/SelectableDimensions/SelectableDimensions";
import WebMapServiceCatalogItemTraits from "../../../Traits/TraitsClasses/WebMapServiceCatalogItemTraits";
import ChartItemSelector from "./ChartItemSelector";
import ColorScaleRangeSection from "./ColorScaleRangeSection";
import DateTimeSelectorSection from "./DateTimeSelectorSection";
import FilterSection from "./FilterSection";
import GeneratedControlSection from "./GeneratedControlSection";
import LeftRightSection from "./LeftRightSection";
import Legend from "./Legend";
import OpacitySection from "./OpacitySection";
import SatelliteImageryTimeFilterSection from "./SatelliteImageryTimeFilterSection";
import { ScaleWorkbenchInfo } from "./ScaleWorkbenchInfo";
import DimensionSelectorSection from "./SelectableDimensionSection";
import ShortReport from "./ShortReport";
import TimerSection from "./TimerSection";
import ViewingControls from "./ViewingControls";
export const defaultControls = {
    viewingControls: true,
    opacity: true,
    scaleWorkbench: true,
    splitter: true,
    timer: true,
    chartItems: true,
    filter: true,
    dateTime: true,
    timeFilter: true,
    selectableDimensions: true,
    colorScaleRange: true,
    shortReport: true,
    legend: true
};
export const hideAllControls = {
    viewingControls: false,
    opacity: false,
    scaleWorkbench: false,
    splitter: false,
    timer: false,
    chartItems: false,
    filter: false,
    dateTime: false,
    timeFilter: false,
    selectableDimensions: false,
    colorScaleRange: false,
    shortReport: false,
    legend: false
};
const WorkbenchItemControls = observer(({ item, viewState, controls: controlsWithoutDefaults }) => {
    // Apply controls from props on top of defaultControls
    const controls = { ...defaultControls, ...controlsWithoutDefaults };
    const { generatedControls, error } = generateControls(viewState, item);
    if (error) {
        error.log();
    }
    return (_jsxs(_Fragment, { children: [(controls === null || controls === void 0 ? void 0 : controls.viewingControls) ? (_jsx(ViewingControls, { item: item, viewState: viewState })) : null, (controls === null || controls === void 0 ? void 0 : controls.opacity) ? _jsx(OpacitySection, { item: item }) : null, (controls === null || controls === void 0 ? void 0 : controls.scaleWorkbench) ? _jsx(ScaleWorkbenchInfo, { item: item }) : null, (controls === null || controls === void 0 ? void 0 : controls.timer) ? _jsx(TimerSection, { item: item }) : null, (controls === null || controls === void 0 ? void 0 : controls.splitter) ? _jsx(LeftRightSection, { item: item }) : null, (controls === null || controls === void 0 ? void 0 : controls.chartItems) ? _jsx(ChartItemSelector, { item: item }) : null, (controls === null || controls === void 0 ? void 0 : controls.filter) ? _jsx(FilterSection, { item: item }) : null, (controls === null || controls === void 0 ? void 0 : controls.dateTime) && DiscretelyTimeVaryingMixin.isMixedInto(item) ? (_jsx(DateTimeSelectorSection, { item: item })) : null, (controls === null || controls === void 0 ? void 0 : controls.timeFilter) ? (_jsx(SatelliteImageryTimeFilterSection, { item: item })) : null, (controls === null || controls === void 0 ? void 0 : controls.selectableDimensions) ? (_jsx(DimensionSelectorSection, { item: item, placement: DEFAULT_PLACEMENT })) : null, _jsx(GeneratedControlSection, { item: item, placement: DEFAULT_PLACEMENT, controls: generatedControls }), (controls === null || controls === void 0 ? void 0 : controls.colorScaleRange) &&
                hasTraits(item, WebMapServiceCatalogItemTraits, "colorScaleMinimum") &&
                hasTraits(item, WebMapServiceCatalogItemTraits, "colorScaleMaximum") && (_jsx(ColorScaleRangeSection, { item: item, minValue: item.colorScaleMinimum, maxValue: item.colorScaleMaximum })), (controls === null || controls === void 0 ? void 0 : controls.shortReport) ? _jsx(ShortReport, { item: item }) : null, (controls === null || controls === void 0 ? void 0 : controls.legend) ? _jsx(Legend, { item: item }) : null, (controls === null || controls === void 0 ? void 0 : controls.selectableDimensions) ? (_jsx(DimensionSelectorSection, { item: item, placement: "belowLegend" })) : null, _jsx(GeneratedControlSection, { item: item, placement: "belowLegend", controls: generatedControls })] }));
});
function generateControls(viewState, item) {
    const generatedControls = [];
    const errors = [];
    viewState.workbenchItemInputGenerators.forEach((generator) => {
        try {
            const control = generator(item);
            control && generatedControls.push(control);
        }
        catch (error) {
            errors.push(TerriaError.from(error));
        }
    });
    const error = errors.length > 0 ? TerriaError.combine(errors, {}) : undefined;
    return { generatedControls, error };
}
export default WorkbenchItemControls;
//# sourceMappingURL=WorkbenchItemControls.js.map