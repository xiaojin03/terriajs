import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import createReactClass from "create-react-class";
import { isObservableArray } from "mobx";
import PropTypes from "prop-types";
import Styles from "./metadata-table.scss";
/**
 * Displays a table showing the name and values of items in a MetadataItem.
 */
const MetadataTable = createReactClass({
    displayName: "MetadataTable",
    propTypes: {
        metadataItem: PropTypes.object.isRequired // A MetadataItem instance.
    },
    renderDataCell(metadataItem, key) {
        if (typeof metadataItem[key] === "object") {
            return _jsx(MetadataTable, { metadataItem: metadataItem[key] });
        }
        else if (Array.isArray(metadataItem[key]) ||
            isObservableArray(metadataItem[key])) {
            return metadataItem[key].length > 0 && isJoinable(metadataItem[key])
                ? metadataItem[key].join(", ")
                : null;
        }
        else
            return metadataItem[key];
    },
    renderObjectItemRow(key, i) {
        const metadataItem = this.props.metadataItem;
        return (_jsxs("tr", { children: [_jsx("th", { className: Styles.name, children: key }), _jsx("td", { className: Styles.value, children: this.renderDataCell(metadataItem, key) })] }, i));
    },
    render() {
        const metadataItem = this.props.metadataItem;
        const keys = Object.keys(metadataItem);
        const isArr = Array.isArray(metadataItem) || isObservableArray(metadataItem);
        if (keys.length === 0 && !isArr)
            return null;
        return (_jsx("div", { className: Styles.root, children: _jsx("table", { children: _jsxs("tbody", { children: [isArr && metadataItem.length > 0 && isJoinable(metadataItem) && (_jsx("tr", { children: _jsx("td", { children: metadataItem.join(", ") }) })), !isArr &&
                            keys.length > 0 &&
                            keys.map((key, i) => this.renderObjectItemRow(key, i))] }) }) }));
    }
});
/**
 * @param  {Object}  obj
 * @return {Boolean} Returns true if the object obj is a string or a number.
 * @private
 */
function isStringOrNumber(obj) {
    return (typeof obj === "string" || obj instanceof String || !isNaN(parseFloat(obj)));
}
/**
 * @param  {Array} array
 * @return {Boolean} Returns true if the array only contains objects which can be joined.
 * @private
 */
function isJoinable(array) {
    return array.every(isStringOrNumber);
}
export default MetadataTable;
//# sourceMappingURL=MetadataTable.js.map