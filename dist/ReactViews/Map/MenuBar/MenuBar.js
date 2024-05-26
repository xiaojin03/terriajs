import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from "classnames";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import withControlledVisibility from "../../HOCs/withControlledVisibility";
import { useViewState } from "../../Context";
import LangPanel from "../Panels/LangPanel/LangPanel";
import SettingPanel from "../Panels/SettingPanel";
import SharePanel from "../Panels/SharePanel/SharePanel";
import ToolsPanel from "../Panels/ToolsPanel/ToolsPanel";
import StoryButton from "./StoryButton/StoryButton";
import HelpButton from "./HelpButton/HelpButton";
import Styles from "./menu-bar.scss";
const StyledMenuBar = styled.div `
  pointer-events: none;
  ${(p) => p.trainerBarVisible &&
    `
    top: ${Number(p.theme.trainerHeight) + Number(p.theme.mapButtonTop)}px;
  `}
`;
// The map navigation region
const MenuBar = observer((props) => {
    var _a, _b;
    const viewState = useViewState();
    const terria = viewState.terria;
    const menuItems = props.menuItems || [];
    const handleClick = () => {
        runInAction(() => {
            viewState.topElement = "MenuBar";
        });
    };
    const storyEnabled = terria.configParameters.storyEnabled;
    const enableTools = terria.userProperties.get("tools") === "1";
    return (_jsxs(StyledMenuBar, { className: classNames(viewState.topElement === "MenuBar" ? "top-element" : "", Styles.menuBar, {
            [Styles.menuBarWorkbenchClosed]: viewState.isMapFullScreen
        }), onClick: handleClick, trainerBarVisible: viewState.trainerBarVisible, children: [_jsx("section", { children: _jsxs("ul", { className: classNames(Styles.menu), children: [enableTools && (_jsx("li", { className: Styles.menuItem, children: _jsx(ToolsPanel, {}) })), !viewState.useSmallScreenInterface &&
                            props.menuLeftItems.map((element, i) => (_jsx("li", { className: Styles.menuItem, children: element }, i)))] }) }), _jsxs("section", { className: classNames(Styles.flex), children: [_jsxs("ul", { className: classNames(Styles.menu), children: [_jsx("li", { className: Styles.menuItem, children: _jsx(SettingPanel, { terria: terria, viewState: viewState }) }), _jsx("li", { className: Styles.menuItem, children: _jsx(HelpButton, { viewState: viewState }) }), ((_b = (_a = terria.configParameters) === null || _a === void 0 ? void 0 : _a.languageConfiguration) === null || _b === void 0 ? void 0 : _b.enabled) ? (_jsx("li", { className: Styles.menuItem, children: _jsx(LangPanel, { terria: terria, smallScreen: viewState.useSmallScreenInterface }) })) : null] }), storyEnabled && (_jsx("ul", { className: classNames(Styles.menu), children: _jsx("li", { className: Styles.menuItem, children: _jsx(StoryButton, { terria: terria, viewState: viewState, theme: props.theme }) }) })), _jsx("ul", { className: classNames(Styles.menu), children: _jsx("li", { className: Styles.menuItem, children: _jsx(SharePanel, { terria: terria, viewState: viewState, animationDuration: props.animationDuration }) }) }), !viewState.useSmallScreenInterface &&
                        menuItems.map((element, i) => (_jsx("li", { className: Styles.menuItem, children: element }, i)))] })] }));
});
MenuBar.displayName = "MenuBar";
MenuBar.propTypes = {
    animationDuration: PropTypes.number,
    menuItems: PropTypes.arrayOf(PropTypes.element),
    menuLeftItems: PropTypes.arrayOf(PropTypes.element)
};
export default withControlledVisibility(MenuBar);
//# sourceMappingURL=MenuBar.js.map