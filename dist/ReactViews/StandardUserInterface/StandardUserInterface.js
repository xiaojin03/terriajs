import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import classNames from "classnames";
import "inobounce";
import { action } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import combine from "terriajs-cesium/Source/Core/combine";
import arrayContains from "../../Core/arrayContains";
import Disclaimer from "../Disclaimer";
import DragDropFile from "../DragDropFile";
import DragDropNotification from "../DragDropNotification";
import ExplorerWindow from "../ExplorerWindow/ExplorerWindow";
import FeatureInfoPanel from "../FeatureInfo/FeatureInfoPanel";
import FeedbackForm from "../Feedback/FeedbackForm";
import { Medium, Small } from "../Generic/Responsive";
import SatelliteHelpPrompt from "../HelpScreens/SatelliteHelpPrompt";
import withFallback from "../HOCs/withFallback";
import ExperimentalFeatures from "./ExperimentalFeatures";
import { CollapsedNavigation } from "../Map/MapNavigation";
import HelpPanel from "../Map/Panels/HelpPanel/HelpPanel";
import PrintView from "../Map/Panels/SharePanel/Print/PrintView";
import TrainerBar from "./TrainerBar/TrainerBar";
import MobileHeader from "../Mobile/MobileHeader";
import MapInteractionWindow from "../Notification/MapInteractionWindow";
import Notification from "../Notification/Notification";
import Branding from "../SidePanel/Branding";
import FullScreenButton from "../SidePanel/FullScreenButton";
import SidePanel from "../SidePanel/SidePanel";
import StoryBuilder from "../Story/StoryBuilder";
import StoryPanel from "../Story/StoryPanel/StoryPanel";
import ClippingBoxToolLauncher from "../Tools/ClippingBox/ClippingBoxToolLauncher";
import Tool from "../Tools/Tool";
import TourPortal from "../Tour/TourPortal";
import WelcomeMessage from "../WelcomeMessage/WelcomeMessage";
import SelectableDimensionWorkflow from "../Workflow/SelectableDimensionWorkflow";
import WorkflowPanelPortal from "../Workflow/WorkflowPanelPortal";
import { ContextProviders } from "../Context";
import { GlobalTerriaStyles } from "./GlobalTerriaStyles";
import MapColumn from "../Map/MapColumn";
import processCustomElements from "./processCustomElements";
import SidePanelContainer from "./SidePanelContainer";
import Styles from "./standard-user-interface.scss";
import { terriaTheme } from "./StandardTheme";
export const animationDuration = 250;
const StandardUserInterfaceBase = observer((props) => {
    const { t } = useTranslation();
    const acceptDragDropFile = action(() => {
        props.viewState.isDraggingDroppingFile = true;
        // if explorer window is already open, we open my data tab
        if (props.viewState.explorerPanelIsVisible) {
            props.viewState.openUserData();
        }
    });
    const handleDragOver = (e) => {
        if (!e.dataTransfer.types ||
            !arrayContains(e.dataTransfer.types, "Files")) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "copy";
        acceptDragDropFile();
    };
    const shouldUseMobileInterface = () => { var _a; return document.body.clientWidth < ((_a = props.minimumLargeScreenWidth) !== null && _a !== void 0 ? _a : 768); };
    const resizeListener = action(() => {
        props.viewState.useSmallScreenInterface = shouldUseMobileInterface();
    });
    useEffect(() => {
        window.addEventListener("resize", resizeListener, false);
        return () => {
            window.removeEventListener("resize", resizeListener, false);
        };
    }, []);
    useEffect(resizeListener, [props.minimumLargeScreenWidth]);
    useEffect(() => {
        if (props.terria.configParameters.storyEnabled &&
            props.terria.stories &&
            props.terria.stories.length &&
            !props.viewState.storyShown) {
            props.terria.notificationState.addNotificationToQueue({
                title: t("sui.notifications.title"),
                message: t("sui.notifications.message"),
                confirmText: t("sui.notifications.confirmText"),
                denyText: t("sui.notifications.denyText"),
                confirmAction: action(() => {
                    props.viewState.storyShown = true;
                }),
                denyAction: action(() => {
                    props.viewState.storyShown = false;
                }),
                type: "story",
                width: 300
            });
        }
    }, [props.terria.storyPromptShown]);
    // Merge theme in order of highest priority: themeOverrides props -> theme config parameter -> default terriaTheme
    const mergedTheme = combine(props.themeOverrides, combine(props.terria.configParameters.theme, terriaTheme, true), true);
    const theme = mergedTheme;
    const customElements = processCustomElements(props.viewState.useSmallScreenInterface, props.children);
    const terria = props.terria;
    const showStoryBuilder = props.viewState.storyBuilderShown &&
        !props.viewState.useSmallScreenInterface;
    const showStoryPanel = props.terria.configParameters.storyEnabled &&
        props.terria.stories.length > 0 &&
        props.viewState.storyShown &&
        !props.viewState.explorerPanelIsVisible &&
        !props.viewState.storyBuilderShown;
    return (_jsxs(ContextProviders, { viewState: props.viewState, theme: mergedTheme, children: [_jsx(GlobalTerriaStyles, {}), _jsx(TourPortal, {}), _jsx(CollapsedNavigation, {}), _jsx(SatelliteHelpPrompt, {}), _jsx(Medium, { children: _jsx(SelectableDimensionWorkflow, {}) }), _jsxs("div", { className: Styles.storyWrapper, children: [!props.viewState.disclaimerVisible && _jsx(WelcomeMessage, {}), _jsxs("div", { className: Styles.uiRoot, css: `
              ${props.viewState.disclaimerVisible && `filter: blur(10px);`}
            `, onDragOver: handleDragOver, children: [_jsx("div", { className: Styles.ui, css: `
                background: ${theme.dark};
              `, children: _jsxs("div", { className: Styles.uiInner, children: [!props.viewState.hideMapUi && (_jsxs(_Fragment, { children: [_jsx(Small, { children: _jsx(MobileHeader, { menuItems: customElements.menu, menuLeftItems: customElements.menuLeft, version: props.version }) }), _jsx(Medium, { children: _jsxs(_Fragment, { children: [_jsx(WorkflowPanelPortal, { show: props.terria.isWorkflowPanelActive }), _jsxs(SidePanelContainer, { tabIndex: 0, show: props.viewState.isMapFullScreen === false &&
                                                                    props.terria.isWorkflowPanelActive === false, children: [_jsx(FullScreenButton, { minified: true, animationDuration: 250, btnText: t("addData.btnHide") }), _jsx(Branding, { version: props.version }), _jsx(SidePanel, {})] })] }) })] })), _jsx(Medium, { children: _jsx("div", { className: classNames(Styles.showWorkbenchButton, {
                                                    [Styles.showWorkbenchButtonTrainerBarVisible]: props.viewState.trainerBarVisible,
                                                    [Styles.showWorkbenchButtonisVisible]: props.viewState.isMapFullScreen,
                                                    [Styles.showWorkbenchButtonisNotVisible]: !props.viewState.isMapFullScreen
                                                }), children: _jsx(FullScreenButton, { minified: false, btnText: t("sui.showWorkbench"), animationDuration: animationDuration, elementConfig: props.terria.elements.get("show-workbench") }) }) }), _jsxs("section", { className: Styles.map, children: [_jsx(MapColumn, { customFeedbacks: customElements.feedback, customElements: customElements, animationDuration: animationDuration }), _jsx("div", { id: "map-data-attribution" }), _jsxs("main", { children: [_jsx(ExplorerWindow, {}), props.terria.configParameters.experimentalFeatures &&
                                                            !props.viewState.hideMapUi && (_jsx(ExperimentalFeatures, { experimentalItems: customElements.experimentalMenu }))] })] })] }) }), !props.viewState.hideMapUi && (_jsx(Medium, { children: _jsx(TrainerBar, {}) })), _jsx(Medium, { children: props.viewState.isToolOpen && (_jsx(Tool, { ...props.viewState.currentTool })) }), props.viewState.panel, _jsx(Notification, {}), _jsx(MapInteractionWindow, {}), !customElements.feedback.length &&
                                props.terria.configParameters.feedbackUrl &&
                                !props.viewState.hideMapUi &&
                                props.viewState.feedbackFormIsVisible && _jsx(FeedbackForm, {}), _jsx("div", { className: classNames(Styles.featureInfo, props.viewState.topElement === "FeatureInfo"
                                    ? "top-element"
                                    : "", {
                                    [Styles.featureInfoFullScreen]: props.viewState.isMapFullScreen
                                }), tabIndex: 0, onClick: action(() => {
                                    props.viewState.topElement = "FeatureInfo";
                                }), children: _jsx(FeatureInfoPanel, {}) }), _jsx(DragDropFile, {}), _jsx(DragDropNotification, {}), showStoryPanel && _jsx(StoryPanel, {})] }), props.terria.configParameters.storyEnabled && showStoryBuilder && (_jsx(StoryBuilder, { isVisible: showStoryBuilder, animationDuration: animationDuration })), props.viewState.showHelpMenu &&
                        props.viewState.topElement === "HelpPanel" && _jsx(HelpPanel, {}), _jsx(Disclaimer, {})] }), props.viewState.printWindow && (_jsx(PrintView, { window: props.viewState.printWindow, closeCallback: () => props.viewState.setPrintWindow(null) })), _jsx(ClippingBoxToolLauncher, { viewState: props.viewState })] }));
});
export const StandardUserInterface = withFallback(StandardUserInterfaceBase);
export default withFallback(StandardUserInterfaceBase);
//# sourceMappingURL=StandardUserInterface.js.map