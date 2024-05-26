import { autorun } from "mobx";
import { createTransformer } from "mobx-utils";
import defined from "terriajs-cesium/Source/Core/defined";
export default function autoUpdate(updater) {
    return function (target, propertyName, property) {
        const transformer = createTransformer(function (args) {
            return autorun(() => {
                updater.call(args.context, args.value);
            });
        }, (disposer, value) => {
            console.log("cleanup");
            if (disposer) {
                disposer();
            }
        });
        const originalGet = property.get;
        if (originalGet) {
            property.get = function () {
                const value = originalGet.call(this);
                if (defined(value)) {
                    console.log("auto-updating result of " + propertyName);
                    transformer({
                        value: value,
                        context: this
                    });
                }
                return value;
            };
        }
    };
}
//# sourceMappingURL=autoUpdate.js.map