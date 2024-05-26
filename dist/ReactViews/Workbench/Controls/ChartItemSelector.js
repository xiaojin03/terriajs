import { jsx as _jsx } from "react/jsx-runtime";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import ChartView from "../../../Charts/ChartView";
import ChartableMixin, { axesMatch } from "../../../ModelMixins/ChartableMixin";
import Checkbox from "../../../Styled/Checkbox/Checkbox";
import { Li, Ul } from "../../../Styled/List";
import { TextSpan } from "../../../Styled/Text";
export const ChartItem = observer(({ chartItem }) => {
    const { t } = useTranslation();
    const lineColor = chartItem.isSelectedInWorkbench
        ? chartItem.getColor()
        : "#fff";
    const toggleActive = () => {
        const catalogItem = chartItem.item;
        runInAction(() => {
            const shouldSelect = !chartItem.isSelectedInWorkbench;
            chartItem.updateIsSelectedInWorkbench(shouldSelect);
            if (shouldSelect) {
                unselectChartItemsWithXAxisNotMatching(catalogItem.terria.workbench.items, chartItem.xAxis);
            }
        });
    };
    return (_jsx(Checkbox, { id: "depthTestAgainstTerrain", isChecked: chartItem.isSelectedInWorkbench, title: t("chart.showItemInChart", { value: chartItem.name }), onChange: toggleActive, css: `
          color: ${lineColor};
        `, children: _jsx(TextSpan, { children: chartItem.name }) }));
});
const ChartItemSelector = observer(({ item }) => {
    const theme = useTheme();
    const chartView = new ChartView(item.terria);
    // We don't need to show selectors for moment datasets. They are part of
    // discretelytimevarying items and have a separate chart button to enable/disable.
    const chartItems = chartView.chartItems
        .filter((c) => c.item === item)
        .filter((c) => c.type !== "momentPoints" && c.type !== "momentLines")
        .sort((a, b) => (a.name >= b.name ? 1 : -1));
    if (chartItems && chartItems.length === 0)
        return null;
    return (_jsx(Ul, { fullWidth: true, spaced: true, padded: true, column: true, rounded: true, backgroundColor: theme === null || theme === void 0 ? void 0 : theme.overlay, css: `
          margin: 10px 0;
        `, children: chartItems.map((chartItem) => (_jsx(Li, { children: _jsx(ChartItem, { chartItem: chartItem }) }, `li-${chartItem.key}`))) }));
});
function unselectChartItemsWithXAxisNotMatching(items, requiredAxis) {
    items.forEach((item) => {
        if (ChartableMixin.isMixedInto(item)) {
            item.chartItems.forEach((chartItem) => {
                if (!axesMatch(chartItem.xAxis, requiredAxis)) {
                    chartItem.updateIsSelectedInWorkbench(false);
                }
            });
        }
    });
}
export default ChartItemSelector;
//# sourceMappingURL=ChartItemSelector.js.map