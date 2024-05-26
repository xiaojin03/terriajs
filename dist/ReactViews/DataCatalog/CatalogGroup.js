import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { observer } from "mobx-react";
import PrivateIndicator from "../PrivateIndicator/PrivateIndicator";
import Loader from "../Loader";
import Icon from "../../Styled/Icon";
import Styles from "./data-catalog-group.scss";
import Box from "../../Styled/Box";
import Text from "../../Styled/Text";
const CatalogGroupButton = styled.button `
  ${(props) => `
    &:hover,
    &:focus {
      color: ${props.theme.textLight};
      background-color: ${props.theme.modalHighlight};
      svg {
        fill: white;
      }
    }
    ${props.active &&
    `
        color: ${props.theme.textLight};
        background-color: ${props.theme.modalHighlight};
        svg {
          fill: white;
        }
      `}
    `}
`;
/**
 * Dumb component that encapsulated the display logic for a catalog group.
 *
 * @constructor
 */
function CatalogGroup(props) {
    const { t } = useTranslation();
    return (_jsxs("li", { className: Styles.root, children: [_jsxs(Text, { fullWidth: true, primary: !props.selected && props.isPrivate, children: [props.displayGroup === true && (_jsx(Box, { children: _jsx("button", { type: "button", 
                            // TODO: apply unique styles
                            className: Styles.addRemoveButton, title: props.allItemsLoaded
                                ? t("models.catalog.removeAll")
                                : t("models.catalog.addAll"), 
                            // onClick should call addAll function which I should move out of GroupPreview to separate service file
                            onClick: props.addRemoveButtonFunction, children: _jsx(Icon, { glyph: props.allItemsLoaded
                                    ? Icon.GLYPHS.minusList
                                    : Icon.GLYPHS.plusList }) }) })), _jsxs(CatalogGroupButton, { type: "button", className: classNames(Styles.btnCatalog, { [Styles.btnCatalogTopLevel]: props.topLevel }, { [Styles.btnIsOpen]: props.open }, { [Styles.isPreviewed]: props.selected }), title: props.title, onClick: props.onClick, active: props.selected, children: [!props.topLevel && (_jsx("span", { className: Styles.folder, children: props.open ? (_jsx(Icon, { glyph: Icon.GLYPHS.folderOpen })) : (_jsx(Icon, { glyph: Icon.GLYPHS.folder })) })), _jsxs(Box, { justifySpaceBetween: true, children: [_jsx(Box, { children: props.text }), _jsxs(Box, { centered: true, children: [props.isPrivate && _jsx(PrivateIndicator, {}), _jsx("span", { className: classNames(Styles.caret, {
                                                    [Styles.offsetRight]: props.removable
                                                }), children: props.open ? (_jsx(Icon, { glyph: Icon.GLYPHS.opened })) : (_jsx(Icon, { glyph: Icon.GLYPHS.closed })) }), props.removable && (_jsx("button", { type: "button", className: Styles.trashGroup, title: t("dataCatalog.groupRemove"), onClick: props.removeUserAddedData, children: _jsx(Icon, { glyph: Icon.GLYPHS.trashcan }) }))] })] })] })] }), props.open && (_jsxs("ul", { className: classNames(Styles.catalogGroup, {
                    [Styles.catalogGroupLowerLevel]: !props.topLevel
                }), children: [props.loading && (_jsx("li", { children: _jsx(Loader, {}) }, "loader")), !props.loading && props.children.length === 0 && props.emptyMessage && (_jsx("li", { className: classNames(Styles.label, Styles.labelNoResults), children: props.emptyMessage }, "empty")), !props.loading ? props.children : null] }))] }));
}
CatalogGroup.propTypes = {
    text: PropTypes.string,
    isPrivate: PropTypes.bool,
    title: PropTypes.string,
    topLevel: PropTypes.bool,
    open: PropTypes.bool,
    loading: PropTypes.bool,
    emptyMessage: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]),
    selected: PropTypes.bool,
    removable: PropTypes.bool,
    removeUserAddedData: PropTypes.func,
    displayGroup: PropTypes.bool,
    allItemsLoaded: PropTypes.bool,
    addRemoveButtonFunction: PropTypes.func
};
export default observer(CatalogGroup);
//# sourceMappingURL=CatalogGroup.js.map