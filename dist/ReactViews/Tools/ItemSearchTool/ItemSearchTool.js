import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { autorun } from "mobx";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import Box from "../../../Styled/Box";
import { Frame, Main } from "../ToolModal";
import BackButton from "./BackButton";
import ErrorComponent from "./ErrorComponent";
import Loading from "./Loading";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
const ItemSearchTool = observer((props) => {
    var _a;
    const { viewState, item, itemSearchProvider, t } = props;
    const itemName = CatalogMemberMixin.isMixedInto(item) ? item.name : "Item";
    const [state, setState] = useState({ is: "loadingParameters" });
    const [parameters, setParameters] = useState([]);
    const [query, setQuery] = useState({});
    useEffect(function loadParameters() {
        itemSearchProvider
            .initialize()
            .then(() => itemSearchProvider.describeParameters().then((parameters) => {
            setState({ is: "search" });
            setParameters(parameters);
            setQuery({});
        }))
            .catch((error) => {
            console.warn(error);
            setState({
                is: "error",
                error
            });
        })
            .finally(() => { var _a; return (_a = props.afterLoad) === null || _a === void 0 ? void 0 : _a.call(props); });
    }, [itemSearchProvider]);
    useEffect(function closeSearchTool() {
        // Close item search tool if the parent item is disabled or removed from
        // the workbench
        const disposeListener = onItemDisabledOrRemovedFromWorkbench(item, () => viewState.closeTool());
        return disposeListener;
    }, [item]);
    const setResults = (query, results) => {
        setQuery(query);
        setState({ is: "results", results });
    };
    const searchAgain = () => setState({ is: "search" });
    const loadIndexForParameter = (_a = itemSearchProvider.loadParameterHint) === null || _a === void 0 ? void 0 : _a.bind(itemSearchProvider);
    return (_jsx(Frame, { viewState: viewState, title: t("itemSearchTool.title", { itemName }), children: _jsxs(Main, { textLight: true, light: true, children: [_jsxs(Box, { centered: true, css: `
            text-align: center;
          `, children: [state.is === "loadingParameters" && (_jsx(Loading, { children: t("itemSearchTool.loading") })), state.is === "error" && (_jsx(ErrorComponent, { children: t("itemSearchTool.loadError") })), state.is === "search" && parameters.length === 0 && (_jsx(ErrorComponent, { children: t("itemSearchTool.noParameters") }))] }), state.is === "search" && parameters.length > 0 && (_jsx(SearchForm, { itemSearchProvider: itemSearchProvider, parameters: parameters, query: query, onResults: setResults, onValueChange: loadIndexForParameter })), state.is === "results" && (_jsx(SearchResults, { item: item, results: state.results, template: item.search.resultTemplate })), state.is === "results" && (_jsx(BackButton, { onClick: searchAgain, children: t("itemSearchTool.backBtnText") }))] }) }));
});
/**
 * Callback when the given item is disabled or removed from the workbench.
 *
 * @param item The item to watch
 * @param callback The function to call when the event happens
 * @return A function to dispose the listener
 */
function onItemDisabledOrRemovedFromWorkbench(item, callback) {
    const disposer = autorun(() => {
        if (item.show === false || item.terria.workbench.contains(item) === false)
            callback();
    });
    return disposer;
}
export default withTranslation()(ItemSearchTool);
//# sourceMappingURL=ItemSearchTool.js.map