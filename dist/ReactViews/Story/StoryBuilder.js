var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { action, toJS, makeObservable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import Sortable from "react-anything-sortable";
import { Trans, useTranslation, withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import combine from "terriajs-cesium/Source/Core/combine";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import { Category, StoryAction } from "../../Core/AnalyticEvents/analyticEvents";
import triggerResize from "../../Core/triggerResize";
import Box from "../../Styled/Box";
import Button, { RawButton } from "../../Styled/Button";
import Icon, { StyledIcon } from "../../Styled/Icon";
import Spacing from "../../Styled/Spacing";
import Text, { TextSpan } from "../../Styled/Text";
import BadgeBar from "../BadgeBar";
import measureElement from "../HOCs/measureElement";
import VideoGuide from "../Map/Panels/HelpPanel/VideoGuide";
import { getShareData } from "../Map/Panels/SharePanel/BuildShareLink";
import SharePanel from "../Map/Panels/SharePanel/SharePanel";
import { withViewState } from "../Context";
import Story from "./Story";
import Styles from "./story-builder.scss";
import StoryEditor from "./StoryEditor.jsx";
const dataStoriesImg = require("../../../wwwroot/images/data-stories-getting-started.jpg");
const STORY_VIDEO = "storyVideo";
let StoryBuilder = class StoryBuilder extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "storiesWrapperRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: React.createRef()
        });
        Object.defineProperty(this, "refToMeasure", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clearRecaptureSuccessTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "removeStory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (index, story) => {
                this.setState({
                    isSharing: false,
                    isRemoving: true,
                    storyToRemove: story,
                    storyRemoveIndex: index
                });
            }
        });
        Object.defineProperty(this, "toggleRemoveDialog", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({
                    isSharing: false,
                    isRemoving: !this.state.isRemoving,
                    storyToRemove: undefined,
                    storyRemoveIndex: undefined
                });
            }
        });
        Object.defineProperty(this, "resetReCaptureStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({
                    recaptureSuccessId: undefined
                });
            }
        });
        Object.defineProperty(this, "closeShareRemoving", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({
                    isRemoving: false,
                    isSharing: false
                });
            }
        });
        Object.defineProperty(this, "runStories", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.closeShareRemoving();
                this.props.viewState.runStories();
            }
        });
        Object.defineProperty(this, "toggleSharePanel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({
                    isRemoving: false,
                    isSharing: !this.state.isSharing
                });
            }
        });
        Object.defineProperty(this, "onClickCapture", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({
                    editingMode: true,
                    currentStory: undefined
                });
            }
        });
        Object.defineProperty(this, "hideStoryBuilder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.props.viewState.toggleStoryBuilder();
                this.props.viewState.terria.currentViewer.notifyRepaintRequired();
                // Allow any animations to finish, then trigger a resize.
                setTimeout(function () {
                    triggerResize();
                }, this.props.animationDuration || 1);
                this.props.viewState.toggleFeaturePrompt("story", false, true);
            }
        });
        makeObservable(this);
        this.state = {
            editingMode: false,
            currentStory: undefined,
            recaptureSuccessId: undefined,
            clearRecaptureSuccessTimeout: undefined,
            showVideoGuide: false,
            isRemoving: false,
            isSharing: false,
            storyToRemove: undefined,
            storyRemoveIndex: undefined,
            storyWithOpenMenuId: undefined
        };
    }
    removeAction() {
        if (this.state.storyToRemove && this.state.storyRemoveIndex !== undefined) {
            this.props.viewState.terria.stories =
                this.props.viewState.terria.stories.filter((st) => st.id !== this.state.storyToRemove.id);
            if (this.state.storyRemoveIndex < this.props.viewState.currentStoryId) {
                this.props.viewState.currentStoryId -= 1;
            }
        }
        else {
            this.removeAllStories();
        }
        this.setState({
            storyToRemove: undefined,
            storyRemoveIndex: undefined
        });
    }
    removeAllStories() {
        this.props.viewState.terria.stories = [];
    }
    onSave(_story) {
        var _a;
        const story = {
            title: _story.title,
            text: _story.text,
            id: _story.id ? _story.id : createGuid()
        };
        (_a = this.props.viewState.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.story, StoryAction.saveStory, JSON.stringify(story));
        const storyIndex = (this.props.viewState.terria.stories || []).findIndex((story) => story.id === _story.id);
        if (storyIndex >= 0) {
            const oldStory = this.props.viewState.terria.stories[storyIndex];
            // replace the old story, we need to replace the stories array so that
            // it is observable
            this.props.viewState.terria.stories = [
                ...this.props.viewState.terria.stories.slice(0, storyIndex),
                combine(story, oldStory),
                ...this.props.viewState.terria.stories.slice(storyIndex + 1)
            ];
        }
        else {
            this.captureStory(story);
        }
        this.setState({
            editingMode: false
        });
    }
    captureStory(story) {
        const shareData = toJS(getShareData(this.props.viewState.terria, this.props.viewState, {
            includeStories: false
        }));
        this.props.viewState.terria.stories.push({ ...story, shareData });
    }
    recaptureScene(story) {
        var _a;
        const { t } = this.props;
        this.closeShareRemoving();
        (_a = this.clearRecaptureSuccessTimeout) === null || _a === void 0 ? void 0 : _a.call(this);
        const storyIndex = (this.props.viewState.terria.stories || []).findIndex((st) => st.id === story.id);
        if (storyIndex >= 0) {
            story.shareData = JSON.parse(JSON.stringify(getShareData(this.props.viewState.terria, this.props.viewState, {
                includeStories: false
            })));
            this.props.viewState.terria.stories = [
                ...this.props.viewState.terria.stories.slice(0, storyIndex),
                story,
                ...this.props.viewState.terria.stories.slice(storyIndex + 1)
            ];
            this.setState({
                recaptureSuccessId: story.id
            });
            const timeout = setTimeout(this.resetReCaptureStatus, 2000);
            this.clearRecaptureSuccessTimeout = () => clearTimeout(timeout);
        }
        else {
            throw new Error(t("story.doesNotExist"));
        }
    }
    editStory(story) {
        this.closeShareRemoving();
        this.props.viewState.storyShown = false;
        this.setState({
            editingMode: true,
            currentStory: story
        });
    }
    viewStory(index) {
        this.closeShareRemoving();
        this.props.viewState.currentStoryId = index;
        this.runStories();
    }
    onSort(sortedArray, _currentDraggingSortData, _currentDraggingIndex) {
        this.props.viewState.terria.stories = sortedArray;
    }
    componentWillUnmount() {
        var _a;
        (_a = this.clearRecaptureSuccessTimeout) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    renderIntro() {
        var _a;
        const { t } = this.props;
        return (_jsxs(Box, { column: true, children: [_jsx(VideoGuide
                /*
                // @ts-ignore */
                , { 
                    /*
                    // @ts-ignore */
                    viewState: this.props.viewState, videoLink: ((_a = this.props.viewState.terria.configParameters.storyVideo) === null || _a === void 0 ? void 0 : _a.videoUrl) ||
                        "https://www.youtube-nocookie.com/embed/fbiQawV8IYY", background: dataStoriesImg, videoName: STORY_VIDEO }), _jsx(StoryButton, { title: t("story.gettingStartedTitle"), btnText: t("story.gettingStarted"), onClick: () => {
                        this.props.viewState.setVideoGuideVisible(STORY_VIDEO);
                    }, children: _jsx(StyledIcon, { glyph: Icon.GLYPHS.play, light: true, styledWidth: "20px" }) }), _jsx(Spacing, { bottom: 2 }), _jsx(CaptureScene, { disabled: this.state.isRemoving, onClickCapture: this.onClickCapture })] }));
    }
    renderPlayShare(hasStories) {
        var _a;
        const { t } = this.props;
        return (_jsxs(Box, { justifySpaceBetween: true, children: [_jsx(StoryButton, { fullWidth: true, disabled: this.state.editingMode || !hasStories, title: t("story.preview"), btnText: t("story.play"), onClick: this.runStories, children: _jsx(StyledIcon, { glyph: Icon.GLYPHS.playStory, light: true, styledWidth: "20px" }) }), _jsx(Spacing, { right: 1 }), _jsx(SharePanel, { storyShare: true, btnDisabled: this.state.editingMode || !hasStories, terria: this.props.viewState.terria, viewState: this.props.viewState, modalWidth: ((_a = this.props.widthFromMeasureElementHOC) !== null && _a !== void 0 ? _a : 100) - 22, onUserClick: this.toggleSharePanel })] }));
    }
    openMenu(storyId) {
        this.setState({
            storyWithOpenMenuId: storyId
        });
    }
    renderStories(editingMode) {
        const { t, i18n } = this.props;
        const stories = this.props.viewState.terria.stories || [];
        const storyName = this.state.storyToRemove
            ? this.state.storyToRemove.title.length
                ? this.state.storyToRemove.title
                : t("story.untitledScene")
            : "";
        return (_jsxs(Box, { displayInlineBlock: true, children: [_jsx(BadgeBar, { label: t("story.badgeBarLabel"), badge: this.props.viewState.terria.stories.length, children: _jsxs(RawButton, { type: "button", onClick: this.toggleRemoveDialog, textLight: true, className: Styles.removeButton, children: [_jsx(Icon, { glyph: Icon.GLYPHS.remove }), " ", t("story.removeAllStories")] }) }), _jsx(Spacing, { bottom: 2 }), _jsxs(Box, { column: true, paddedHorizontally: 2, children: [this.state.isRemoving && (_jsx(RemoveDialog, { theme: this.props.theme, text: this.state.storyToRemove ? (_jsx(Text, { textLight: true, large: true, children: _jsxs(Trans, { i18nKey: "story.removeStoryDialog", i18n: i18n, children: ["Are you sure you wish to delete", _jsx(TextSpan, { textLight: true, large: true, bold: true, children: { storyName } }), "?"] }) })) : (_jsx(Text, { textLight: true, large: true, children: t("story.removeAllStoriesDialog", {
                                    count: this.props.viewState.terria.stories.length
                                }) })), onConfirm: this.removeAction, closeDialog: this.toggleRemoveDialog })), _jsxs(Box, { column: true, position: "static", css: `
              ${(this.state.isRemoving || this.state.isSharing) &&
                                `opacity: 0.3`}
            `, children: [_jsx(Box, { column: true, scroll: true, overflowY: "auto", styledMaxHeight: "calc(100vh - 283px)", position: "static", ref: this.storiesWrapperRef, css: `
                margin-right: -10px;
              `, children: _jsx(Sortable, { onSort: this.onSort, direction: "vertical", dynamic: true, css: `
                  position: static;
                  margin-right: 10px;
                `, children: stories.map((story, index) => (_jsx(Story, { story: story, sortData: story, deleteStory: () => this.removeStory(index, story), recaptureStory: () => this.recaptureScene(story), recaptureStorySuccessful: Boolean(story.id === this.state.recaptureSuccessId), viewStory: () => this.viewStory(index), menuOpen: this.state.storyWithOpenMenuId === story.id, openMenu: () => this.openMenu(story.id), closeMenu: () => this.openMenu(undefined), editStory: () => this.editStory(story), parentRef: this.storiesWrapperRef }, `${story.id}`))) }) }), _jsx(Spacing, { bottom: 2 }), _jsx(CaptureScene, { disabled: this.state.isRemoving, onClickCapture: this.onClickCapture })] }), _jsx(Spacing, { bottom: 2 })] })] }));
    }
    render() {
        const { t } = this.props;
        const hasStories = this.props.viewState.terria.stories.length > 0;
        return (_jsxs(Panel, { ref: (component) => (this.refToMeasure = component), isVisible: this.props.isVisible, isHidden: !this.props.isVisible, styledWidth: "320px", styledMinWidth: "320px", charcoalGreyBg: true, column: true, children: [_jsx(Box, { right: true, children: _jsx(RawButton, { css: `
              padding: 15px;
            `, onClick: this.hideStoryBuilder, children: _jsx(StyledIcon, { styledWidth: "16px", fillColor: this.props.theme.textLightDimmed, opacity: 0.5, glyph: Icon.GLYPHS.closeLight }) }) }), _jsxs(Box, { centered: true, paddedHorizontally: 2, displayInlineBlock: true, children: [_jsx(Text, { bold: true, extraExtraLarge: true, textLight: true, children: t("story.panelTitle") }), _jsx(Spacing, { bottom: 2 }), _jsx(Text, { medium: true, color: this.props.theme.textLightDimmed, highlightLinks: true, children: t("story.panelBody") }), _jsx(Spacing, { bottom: 3 }), !hasStories && this.renderIntro(), hasStories && this.renderPlayShare(hasStories)] }), _jsx(Spacing, { bottom: 2 }), hasStories && this.renderStories(this.state.editingMode), this.state.editingMode && (_jsx(StoryEditor, { removeStory: this.removeStory, exitEditingMode: () => this.setState({ editingMode: false }), story: this.state.currentStory, saveStory: this.onSave, terria: this.props.viewState.terria }))] }));
    }
};
__decorate([
    action.bound
], StoryBuilder.prototype, "removeAction", null);
__decorate([
    action.bound
], StoryBuilder.prototype, "removeAllStories", null);
__decorate([
    action.bound
], StoryBuilder.prototype, "onSave", null);
__decorate([
    action
], StoryBuilder.prototype, "captureStory", null);
__decorate([
    action
], StoryBuilder.prototype, "recaptureScene", null);
__decorate([
    action
], StoryBuilder.prototype, "editStory", null);
__decorate([
    action
], StoryBuilder.prototype, "viewStory", null);
__decorate([
    action.bound
], StoryBuilder.prototype, "onSort", null);
StoryBuilder = __decorate([
    observer
], StoryBuilder);
const Panel = styled(Box) `
  transition: all 0.25s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  ${(props) => props.isVisible &&
    `
    visibility: visible;
    margin-right: 0;
  `}
  ${(props) => props.isHidden &&
    `
    visibility: hidden;
    margin-right: -${props.styledWidth ? props.styledWidth : "320px"};
  `}
`;
const CaptureScene = (props) => {
    const { t } = useTranslation();
    return (_jsx(StoryButton, { title: t("story.captureSceneTitle"), btnText: t("story.captureScene"), onClick: props.onClickCapture, disabled: props.disabled, fullWidth: true, children: _jsx(StyledIcon, { glyph: Icon.GLYPHS.story, light: true, styledWidth: "20px" }) }));
};
export const StoryButton = (props) => {
    const { btnText, ...rest } = props;
    return (_jsx(Button, { primary: true, renderIcon: props.children && (() => props.children), textProps: {
            large: true
        }, ...rest, children: btnText ? btnText : "" }));
};
const RemoveDialog = (props) => {
    const { t } = useTranslation();
    return (_jsxs(Box, { backgroundColor: props.theme.darkWithOverlay, position: "absolute", rounded: true, paddedVertically: 3, paddedHorizontally: 2, column: true, css: `
        width: calc(100% - 20px);
      `, children: [props.text, _jsx(Spacing, { bottom: 2 }), _jsxs(Box, { children: [_jsx(Button, { denyButton: true, rounded: true, fullWidth: true, textProps: {
                            large: true,
                            semiBold: true
                        }, onClick: props.closeDialog, children: t("general.cancel") }), _jsx(Spacing, { right: 2 }), _jsx(Button, { primary: true, fullWidth: true, textProps: {
                            large: true,
                            semiBold: true
                        }, onClick: () => {
                            props.onConfirm();
                            props.closeDialog();
                        }, children: t("general.confirm") })] })] }));
};
export default withViewState(withTranslation()(withTheme(measureElement(StoryBuilder))));
//# sourceMappingURL=StoryBuilder.js.map