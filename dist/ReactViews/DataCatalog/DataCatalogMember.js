"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import GroupMixin from "../../ModelMixins/GroupMixin";
import ReferenceMixin from "../../ModelMixins/ReferenceMixin";
import DataCatalogGroup from "./DataCatalogGroup";
import DataCatalogItem from "./DataCatalogItem";
import DataCatalogReference from "./DataCatalogReference";
/**
 * Component that is either a {@link CatalogItem} or a {@link DataCatalogMember} and encapsulated this choosing logic.
 */
let DataCatalogMember = class DataCatalogMember extends React.Component {
    render() {
        const member = ReferenceMixin.isMixedInto(this.props.member) &&
            this.props.member.nestedTarget !== undefined
            ? this.props.member.nestedTarget
            : this.props.member;
        if (ReferenceMixin.isMixedInto(member)) {
            return (_jsx(DataCatalogReference, { reference: member, viewState: this.props.viewState, terria: this.props.terria, onActionButtonClicked: this.props.onActionButtonClicked, isTopLevel: this.props.isTopLevel }));
        }
        else if (GroupMixin.isMixedInto(member)) {
            return (_jsx(DataCatalogGroup, { group: member, viewState: this.props.viewState, manageIsOpenLocally: this.props.manageIsOpenLocally, onActionButtonClicked: this.props.onActionButtonClicked, removable: this.props.removable, terria: this.props.terria, isTopLevel: this.props.isTopLevel }));
        }
        else {
            return (_jsx(DataCatalogItem, { item: member, viewState: this.props.viewState, onActionButtonClicked: this.props.onActionButtonClicked, removable: this.props.removable, terria: this.props.terria }));
        }
    }
};
Object.defineProperty(DataCatalogMember, "propTypes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        member: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        manageIsOpenLocally: PropTypes.bool,
        onActionButtonClicked: PropTypes.func,
        removable: PropTypes.bool,
        terria: PropTypes.object,
        isTopLevel: PropTypes.bool
    }
});
DataCatalogMember = __decorate([
    observer
], DataCatalogMember);
export default DataCatalogMember;
//# sourceMappingURL=DataCatalogMember.js.map