// TODO: ideally this would be Promise-based so that we can defer loading Model classes until they're needed.
export default class ModelFactory {
    constructor() {
        Object.defineProperty(this, "_constructors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    get constructorsArray() {
        return Array.from(this._constructors);
    }
    register(type, constructor) {
        this._constructors.set(type, constructor);
    }
    create(type, uniqueId, terria, sourceReference) {
        if (!type)
            return undefined;
        const Constructor = this._constructors.get(type);
        if (Constructor === undefined) {
            return undefined;
        }
        return new Constructor(uniqueId, terria, sourceReference);
    }
    find(type) {
        return this._constructors.get(type);
    }
}
//# sourceMappingURL=ModelFactory.js.map