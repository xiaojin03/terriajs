"use strict";
/**
 * Flattens an array which itself may contain arrays (which may contain arrays etc), into a single array,
 * eg. flattenNested([[0, [11, 12, [13]]], [2, 3], 4]) = [0, 11, 12, 13, 2, 3, 4].
 * @private
 * @param  {Array[]} array Input array.
 * @return {Array} Flattened array.
 */
export default function flattenNested(array) {
    return flattenNestedLoop(array, []);
}
function flattenNestedLoop(array, result) {
    for (let i = 0; i < array.length; i++) {
        const value = array[i];
        if (Array.isArray(value)) {
            flattenNestedLoop(value, result);
        }
        else {
            result.push(value);
        }
    }
    return result;
}
//# sourceMappingURL=flattenNested.js.map