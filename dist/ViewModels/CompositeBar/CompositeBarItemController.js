var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { makeObservable, observable, runInAction } from "mobx";
import React from "react";
export class CompositeBarItemController {
    constructor() {
        Object.defineProperty(this, "itemRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: React.createRef()
        });
        /**
         * Whether this item is disabled
         * @private
         */
        Object.defineProperty(this, "_disabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Whether this item is collapsed
         * @private
         */
        Object.defineProperty(this, "_collapsed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Whether this item is active
         * @protected
         */
        Object.defineProperty(this, "_active", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Whether this item is pinned, if item is pinned it will be always visible on screen.
         * @private
         */
        Object.defineProperty(this, "_pinned", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Whether this item is visible on the screen.
         * @private
         */
        Object.defineProperty(this, "_visible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        makeObservable(this);
    }
    get id() {
        return CompositeBarItemController.id;
    }
    /**
     * Gets the {@link this._disabled}
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * Sets the {@link this._disabled}
     * @param value
     */
    set disabled(value) {
        this._disabled = value;
    }
    /**
     * Gets the {@this._collapsed}
     */
    get collapsed() {
        return this._collapsed;
    }
    /**
     * Sets the {@this._collapsed}
     */
    set collapsed(value) {
        this._collapsed = value;
    }
    /**
     * Gets the {@link this._active}
     */
    get active() {
        return !this.disabled && this._active;
    }
    /**
     * Gets the {@link this._pinned}
     */
    get pinned() {
        return this._pinned;
    }
    /**
     * Sets the {@link this._pinned}
     */
    set pinned(value) {
        this._pinned = value;
    }
    /**
     * Gets the {@link this._visible}
     */
    get visible() {
        return this._visible;
    }
    setVisible(v) {
        runInAction(() => {
            this._visible = v;
        });
    }
}
__decorate([
    observable
], CompositeBarItemController.prototype, "_disabled", void 0);
__decorate([
    observable
], CompositeBarItemController.prototype, "_collapsed", void 0);
__decorate([
    observable
], CompositeBarItemController.prototype, "_active", void 0);
__decorate([
    observable
], CompositeBarItemController.prototype, "_pinned", void 0);
__decorate([
    observable
], CompositeBarItemController.prototype, "_visible", void 0);
//# sourceMappingURL=CompositeBarItemController.js.map