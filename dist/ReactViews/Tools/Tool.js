var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx } from "react/jsx-runtime";
import i18next from "i18next";
import { computed, makeObservable } from "mobx";
import React, { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TerriaError from "../../Core/TerriaError";
import { applyTranslationIfExists, TRANSLATE_KEY_PREFIX } from "../../Language/languageHelpers";
import ViewerMode from "../../Models/ViewerMode";
import MapNavigationItemController from "../../ViewModels/MapNavigation/MapNavigationItemController";
import { useViewState } from "../Context";
/**
 * Loads the given tool component.
 *
 * Has an associated {@link CloseToolButton} displayed in the map menu.
 * The prop toolComponent can be an immediate React Component or a promise to
 * module that exports a default React Component. The promise is useful for
 * lazy-loading the tool.
 */
const Tool = (props) => {
    const { getToolComponent, params, toolName } = props;
    const viewState = useViewState();
    const [t] = useTranslation();
    // Track the tool component & props together so that we always
    // pass the right props to the right tool.
    const [toolAndProps, setToolAndProps] = useState(undefined);
    useEffect(() => {
        setToolAndProps([
            React.lazy(() => Promise.resolve(getToolComponent()).then((c) => ({ default: c }))),
            params
        ]);
    }, [getToolComponent, params]);
    let ToolComponent;
    let toolProps;
    if (toolAndProps !== undefined)
        [ToolComponent, toolProps] = toolAndProps;
    return (_jsx(ToolErrorBoundary, { t: t, toolName: toolName, terria: viewState.terria, children: _jsx(Suspense, { fallback: _jsx("div", { children: "Loading..." }), children: ToolComponent !== undefined ? (_jsx(ToolComponent, { ...toolProps, viewState: viewState })) : null }) }));
};
export class ToolButtonController extends MapNavigationItemController {
    constructor(props) {
        super();
        Object.defineProperty(this, "props", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: props
        });
        makeObservable(this);
    }
    get glyph() {
        return this.props.icon;
    }
    get viewerMode() {
        return ViewerMode.Cesium;
    }
    get name() {
        return applyTranslationIfExists(this.props.toolName, i18next);
    }
    // TODO: do not use the global i18next instead get i18n from react-i18next
    // @computed
    get title() {
        const buttonState = this.active ? "open" : "closed";
        return applyTranslationIfExists(`${TRANSLATE_KEY_PREFIX}tool.button.${buttonState}`, i18next, {
            toolName: this.name,
            toolNameLowerCase: this.name.toLowerCase()
        });
    }
    get active() {
        const currentTool = this.props.viewState.currentTool;
        return (super.active ||
            (currentTool && currentTool.toolName === this.props.toolName) ||
            false);
    }
    activate() {
        this.props.viewState.openTool({
            toolName: this.props.toolName,
            getToolComponent: this.props.getToolComponent,
            params: this.props.params,
            showCloseButton: false
        });
        super.activate();
    }
    deactivate() {
        this.props.viewState.closeTool();
        super.deactivate();
    }
}
__decorate([
    computed
], ToolButtonController.prototype, "active", null);
class ToolErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { hasError: false }
        });
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch() {
        const { terria, toolName, t } = this.props;
        terria.raiseErrorToUser(new TerriaError({
            title: t("tool.loadingError.title", { toolName }),
            message: t("tool.loadingError.message")
        }));
        this.setState({ hasError: true });
    }
    render() {
        return this.state.hasError === true ? null : this.props.children;
    }
}
export default Tool;
//# sourceMappingURL=Tool.js.map