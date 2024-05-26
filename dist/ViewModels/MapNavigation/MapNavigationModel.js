var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, makeObservable } from "mobx";
import isDefined from "../../Core/isDefined";
import { CompositeBarModel } from "../CompositeBar/CompositeBarModel";
export const OVERFLOW_ITEM_ID = "overflow-item";
export default class MapNavigationModel extends CompositeBarModel {
    constructor(terria, items, options) {
        super(items, options);
        Object.defineProperty(this, "terria", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: terria
        });
        makeObservable(this);
    }
    addItem(newItem, requestedIndex) {
        const elementConfig = this.terria.elements.get(newItem.id);
        if (elementConfig && isDefined(elementConfig.visible)) {
            newItem.controller.setVisible(elementConfig.visible);
        }
        super.add(newItem, requestedIndex);
    }
    createCompositeBarItem(item) {
        return item;
    }
}
__decorate([
    action.bound
], MapNavigationModel.prototype, "addItem", null);
//# sourceMappingURL=MapNavigationModel.js.map