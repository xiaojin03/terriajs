var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, observable, runInAction, untracked, makeObservable } from "mobx";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import AsyncLoader from "../Core/AsyncLoader";
import Result from "../Core/Result";
import TerriaError from "../Core/TerriaError";
import { getName } from "./CatalogMemberMixin";
import { applyItemProperties } from "./GroupMixin";
/**
 * A mixin for a Model that acts as a "reference" to another Model, which is its "true"
 * representation. The reference is "dereferenced" to obtain the other model, but only
 * after an optional asynchronous operation is completed. For example, a `CkanCatalogItem`
 * acts as a reference to another type of catalog item. Once the CKAN dataset record is
 * loaded, the `CkanCatalogItem` may be dereferenced to obtain the `WebMapServiceCatalogItem`,
 * `GeoJsonCatalogItem`, or whatever else representing the dataset.
 */
function ReferenceMixin(Base) {
    class ReferenceMixinClass extends Base {
        constructor(...args) {
            super(...args);
            /** A "weak" reference has a target which doesn't include the `sourceReference` property.
             * This means the reference is treated more like a shortcut to the target. So share links, for example, will use the target instead of sourceReference. */
            Object.defineProperty(this, "weakReference", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: false
            });
            Object.defineProperty(this, "_target", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "_referenceLoader", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: new AsyncLoader(async () => {
                    const previousTarget = untracked(() => this._target);
                    const target = await this.forceLoadReference(previousTarget);
                    if (!target) {
                        throw new DeveloperError("Failed to create reference");
                    }
                    if ((target === null || target === void 0 ? void 0 : target.uniqueId) !== this.uniqueId) {
                        throw new DeveloperError("The model returned by `forceLoadReference` must be constructed with its `uniqueId` set to the same value as the Reference model.");
                    }
                    if (!this.weakReference && (target === null || target === void 0 ? void 0 : target.sourceReference) !== this) {
                        throw new DeveloperError("The model returned by `forceLoadReference` must be constructed with its `sourceReference` set to the Reference model.");
                    }
                    if (this.weakReference && (target === null || target === void 0 ? void 0 : target.sourceReference)) {
                        throw new DeveloperError('This is a "weak" reference, so the model returned by `forceLoadReference` must not have a `sourceReference` set.');
                    }
                    runInAction(() => {
                        this._target = target;
                    });
                })
            });
            makeObservable(this);
        }
        get loadReferenceResult() {
            return this._referenceLoader.result;
        }
        /**
         * Gets a value indicating whether the reference is currently loading. While this is true,
         * {@link ModelMixin#target} may be undefined or stale.
         */
        get isLoadingReference() {
            return this._referenceLoader.isLoading;
        }
        /**
         * Gets the target model of the reference. This model must have the same `id` as this model.
         */
        get target() {
            return this._target;
        }
        /**
         * If this a nested reference return the target of the final reference.
         */
        get nestedTarget() {
            return ReferenceMixin.isMixedInto(this._target)
                ? this._target.nestedTarget
                : this._target;
        }
        /**
         * Asynchronously loads the reference. When the returned promise resolves,
         * {@link ReferenceMixin#target} should return the target of the reference.
         * @param forceReload True to force the load to happen again, even if nothing
         *        appears to have changed since the last time it was loaded.
         *
         * This returns a Result object, it will contain errors if they occur - they will not be thrown.
         * To throw errors, use `(await loadMetadata()).throwIfError()`
         *
         * {@see AsyncLoader}
         */
        async loadReference(forceReload = false) {
            const result = (await this._referenceLoader.load(forceReload)).clone(`Failed to load reference \`${getName(this)}\``);
            if (!result.error && this.target) {
                runInAction(() => {
                    // Copy knownContainerUniqueIds to target
                    this.knownContainerUniqueIds.forEach((id) => !this.target.knownContainerUniqueIds.includes(id)
                        ? this.target.knownContainerUniqueIds.push(id)
                        : null);
                });
                applyItemProperties(this, this.target);
            }
            return result;
        }
        /**
         * Recursively load a nested chain of references till the given maxDepth.
         *
         * If this reference points to another reference and so on.. then this
         * method will load them all up to the given depth.
         *
         * @param maxDepth The maximum depth up to which the references should be resolved.
         * @returns A promise that is fulfilled with a Result value when all the references have been loaded.
         */
        async recursivelyLoadReference(maxDepth) {
            let currentTarget = this;
            const errors = [];
            while (maxDepth > 0 && ReferenceMixin.isMixedInto(currentTarget)) {
                (await currentTarget.loadReference()).pushErrorTo(errors);
                currentTarget = currentTarget.target;
                maxDepth -= 1;
            }
            const maybeError = TerriaError.combine(errors, "Failed to recursively load reference `${this.uniqueId}`");
            return Result.none(maybeError);
        }
        dispose() {
            super.dispose();
            this._referenceLoader.dispose();
        }
    }
    __decorate([
        observable
    ], ReferenceMixinClass.prototype, "_target", void 0);
    __decorate([
        computed
    ], ReferenceMixinClass.prototype, "nestedTarget", null);
    return ReferenceMixinClass;
}
(function (ReferenceMixin) {
    function isMixedInto(model) {
        return model && "loadReference" in model;
    }
    ReferenceMixin.isMixedInto = isMixedInto;
})(ReferenceMixin || (ReferenceMixin = {}));
export default ReferenceMixin;
//# sourceMappingURL=ReferenceMixin.js.map