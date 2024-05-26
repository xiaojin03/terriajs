import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import Styles from "./data-preview.scss";
import { Trans } from "react-i18next";
/**
 * URL section of the preview.
 */
const DataPreviewUrl = createReactClass({
    displayName: "DataPreviewUrl",
    propTypes: {
        metadataItem: PropTypes.object.isRequired
    },
    selectUrl(e) {
        e.target.select();
    },
    render() {
        return (_jsxs("div", { children: [_jsxs("h4", { className: Styles.h4, children: [this.props.metadataItem.typeName, " URL"] }), this.props.metadataItem.type === "wms" && (_jsx("p", { children: _jsxs(Trans, { i18nKey: "description.wms", children: ["This is a", _jsx("a", { href: "https://en.wikipedia.org/wiki/Web_Map_Service", target: "_blank", rel: "noopener noreferrer", children: "WMS service" }), ", which generates map images on request. It can be used in GIS software with this URL:"] }) })), this.props.metadataItem.type === "wfs" && (_jsx("p", { children: _jsxs(Trans, { i18nKey: "description.wfs", children: ["This is a", _jsx("a", { href: "https://en.wikipedia.org/wiki/Web_Feature_Service", target: "_blank", rel: "noopener noreferrer", children: "WFS service" }), ", which transfers raw spatial data on request. It can be used in GIS software with this URL:"] }) })), _jsx("input", { readOnly: true, className: Styles.field, type: "text", value: this.props.metadataItem.url, onClick: this.selectUrl }), (this.props.metadataItem.type === "wms" ||
                    (this.props.metadataItem.type === "esri-mapServer" &&
                        this.props.metadataItem.layers)) && (_jsxs("p", { children: ["Layer name", this.props.metadataItem.layers.split(",").length > 1
                            ? "s"
                            : "", ": ", this.props.metadataItem.layers] })), this.props.metadataItem.type === "wfs" && (_jsxs("p", { children: ["Type name", this.props.metadataItem.typeNames.split(",").length > 1 ? "s" : "", ": ", this.props.metadataItem.typeNames] }))] }));
    }
});
export default DataPreviewUrl;
//# sourceMappingURL=DataPreviewUrl.js.map