import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import MoreOrLess from "../Generic/MoreOrLess.jsx";
import BooleanParameterEditor from "./BooleanParameterEditor.tsx";
import Styles from "./parameter-editors.scss";
const BooleanParameterGroupEditor = createReactClass({
    displayName: "BooleanParameterGroupEditor",
    propTypes: {
        previewed: PropTypes.object,
        parameter: PropTypes.object
    },
    toggleDiv: function (divID, ev) {
        const thisDiv = document.getElementById(divID);
        if (thisDiv.style.display === "none") {
            thisDiv.style.display = "block";
        }
        else {
            thisDiv.style.display = "none";
        }
    },
    toggleAll: function (inputArgs, ev) {
        // if OneForAll selected, set the value of all BooleanParameters in
        // ParameterList to true, disable them,
        // else set the value of all BooleanParameters in ParameterList to
        // false, enable them
        const FirstOne = document.getElementById(inputArgs.OneForAllId);
        let LastOne = FirstOne.children[0];
        while (LastOne.childElementCount !== 0) {
            LastOne = LastOne.children[0];
        }
        const OneForAllValue = LastOne.href.baseVal.split("-")[1] !== "off";
        const ParamElementArray = [];
        Array.from(document.getElementById(inputArgs.ParameterListId).children).forEach(function (child) {
            ParamElementArray.push(child.children[0].children[0]);
        });
        if (OneForAllValue === false) {
            ParamElementArray.forEach(function (Parameter) {
                // Parameter.value = true;
                // only have the ability to check state of button
                // and fire the onclick if it needs to change.
                const thisButton = Parameter.children[0];
                if (thisButton.children[0].children[0].href.baseVal.split("-")[1] ===
                    "off") {
                    // fire react click event
                    thisButton[Object.keys(thisButton).filter(function (v) {
                        return /__reactEventHandlers/.test(v);
                    })].onClick();
                }
                thisButton.disabled = true;
            });
        }
        else {
            ParamElementArray.forEach(function (Parameter) {
                // Parameter.value = false;
                const thisButton = Parameter.children[0];
                if (thisButton.children[0].children[0].href.baseVal.split("-")[1] !==
                    "off") {
                    thisButton[Object.keys(thisButton).filter(function (v) {
                        return /__reactEventHandlers/.test(v);
                    })].onClick();
                }
                thisButton.disabled = false;
            });
        }
    },
    renderCheckboxGroup() {
        const whichIcon = true;
        const OneForAll = this.props.parameter.OneForAll;
        let name;
        this.props.parameter.name
            ? (name = this.props.parameter.name + "_Group")
            : (name = this.props.parameter.id + "_Group");
        const OneForAllDivName = name + "_OneForAllDiv";
        const groupClick = this.toggleDiv.bind(this, name);
        const allClick = this.toggleAll.bind(this, {
            OneForAllId: OneForAllDivName,
            ParameterListId: name
        });
        return (_jsxs("fieldset", { children: [_jsxs("legend", { children: [_jsx("div", { style: { display: "inline-block" }, onClick: groupClick, children: _jsx(MoreOrLess, { initialopen: whichIcon, myclass: Styles.btnRadio }) }), _jsx("div", { id: OneForAllDivName, style: { display: "inline-block" }, onClick: allClick, children: _jsx(BooleanParameterEditor, { parameter: OneForAll }) })] }), _jsx("div", { id: name, style: whichIcon ? { display: "block" } : { display: "none" }, children: this.props.parameter.ParameterList.map(function (item, key) {
                        return (_jsx("div", { children: _jsx(BooleanParameterEditor, { parameter: item }) }, key));
                    }) })] }));
    },
    render() {
        return _jsx("div", { children: this.renderCheckboxGroup() });
    }
});
module.exports = BooleanParameterGroupEditor;
//# sourceMappingURL=BooleanParameterGroupEditor.js.map