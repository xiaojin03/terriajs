"use strict";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MenuPanel from "../../../StandardUserInterface/customizable/MenuPanel";
import { useViewState } from "../../../Context";
import DropdownStyles from "../panel.scss";
import CountDatasets from "./CountDatasets";
import Styles from "./tools-panel.scss";
const ToolsPanel = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [resultsMessage, setResultsMessage] = useState("");
    const dropdownTheme = {
        btn: Styles.btnShare,
        outer: Styles.ToolsPanel,
        inner: Styles.dropdownInner,
        icon: "settings"
    };
    const { t } = useTranslation();
    const viewState = useViewState();
    return (_jsxs(MenuPanel, { theme: dropdownTheme, btnText: t("toolsPanel.btnText"), viewState: viewState, btnTitle: t("toolsPanel.btnTitle"), onOpenChanged: setIsOpen, isOpen: isOpen, smallScreen: viewState.useSmallScreenInterface, children: [isOpen && (_jsx("div", { className: DropdownStyles.section, children: _jsx("div", { className: Styles.this, children: _jsx(CountDatasets, { updateResults: setResultsMessage }) }) })), _jsx("div", { className: Styles.results, children: _jsx("div", { dangerouslySetInnerHTML: { __html: resultsMessage } }) })] }));
});
export default ToolsPanel;
//# sourceMappingURL=ToolsPanel.js.map