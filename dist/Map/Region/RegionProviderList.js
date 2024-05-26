/**********************************************************************************************
*  Region mapping support - turn CSVs into choropleths of regions like local government areas
*  Implements most of https://github.com/TerriaJS/nationalmap/wiki/csv-geo-au
*  1. Look through all the column names in the CSV file until we find one that matches a defined region descriptor in
      region mapping JSON file
*  3. Fetch region IDS (using `regionIdsFile` URL)
*  4. Based on values in the region variable column, generate a linear choropleth mapping
*  6. Recolor vector tile features
*/
import RegionProvider from "./RegionProvider";
import isDefined from "../../Core/isDefined";
import loadJson from "../../Core/loadJson";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
/**
 * RegionProviderList encapsulates the regionMapping.json file and provides support for choosing the best region
 * provider for a given dataset.
 *
 * @constructor
 * @param corsProxy A proxy to allow the region providers to make AJAX calls safely.
 */
class RegionProviderList {
    /**
     * Returns a promise for a RegionProviderList instantiated from this url. Previous loads are cached.
     */
    static fromUrl(url, corsProxy) {
        if (!isDefined(RegionProviderList.metaList[url])) {
            RegionProviderList.metaList[url] = loadJson(url).then(function (o) {
                return new RegionProviderList(corsProxy).initFromObject(o);
            });
        }
        return RegionProviderList.metaList[url];
    }
    constructor(corsProxy) {
        Object.defineProperty(this, "corsProxy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: corsProxy
        });
        /**
         * List of RegionProviders, once loaded from file.
         * @type {RegionProvider[]}
         */
        Object.defineProperty(this, "regionProviders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    /**
     * Initialises from the already-retrieved contents of a JSON file.
     */
    initFromObject(obj) {
        Object.keys(obj.regionWmsMap).forEach((r) => {
            this.regionProviders.push(new RegionProvider(r, obj.regionWmsMap[r], this.corsProxy));
        });
        // after loading all providers, now we can set cross references for disambiguation, where required.
        Object.keys(obj.regionWmsMap).forEach((r) => {
            const rp = this.getRegionProvider(r);
            if (rp && obj.regionWmsMap[r].disambigRegionId) {
                rp.setDisambigProperties(this.getRegionProvider(obj.regionWmsMap[r].disambigRegionId));
            }
        });
        return this;
    }
    /**
     * Find what kind of region-mapped dataset this is by exhaustively looking for every alias for every variable name provided.
     * You can optionally provide a prefered region variable name, and optionally its prefered type.
     * If specified, getRegionDetails will return that name as the first object in the returned array.
     *
     * @param variableNames {string[]} Array of names of variables to choose amongst.
     * @param preferedRegionVariableName {string} Prefered region variable name - this will be prioritised if there are multiple matches.
     * @param preferedRegionType {string} Prefered region type - this will be prioritised if there are multiple matches.
     * @return {any[]} An array of objects with regionProvider (RegionProvider), regionVariable and disambigVariable properties, for each potential region variable in the list of names.
     */
    getRegionDetails(variableNames, preferedRegionVariableName, preferedRegionType) {
        const results = [];
        // If preferedRegionVariableName is in variableNames (which it must be to be meaningful; if undefined, it won't be), remove it first.
        const index = preferedRegionVariableName
            ? variableNames.indexOf(preferedRegionVariableName)
            : -1;
        if (index >= 0) {
            variableNames = variableNames.slice(); // clone it so we don't potentially confuse the caller.
            variableNames.splice(index, 1);
            if (!isDefined(preferedRegionType)) {
                // If no type is provided, simply put this back in the front of the array, to prioritize it.
                preferedRegionVariableName &&
                    variableNames.unshift(preferedRegionVariableName);
            }
            else {
                // If a type is provided, handle it specially.
                const regionProvider = this.getRegionProvider(preferedRegionType);
                if (regionProvider)
                    results.push({
                        regionProvider: regionProvider,
                        variableName: preferedRegionVariableName,
                        disambigVariableName: regionProvider.findDisambigVariable(variableNames)
                    });
            }
        }
        // Figure out the region variable and type based on aliases.
        for (let i = 0; i < this.regionProviders.length; i++) {
            const rv = this.regionProviders[i].findRegionVariable(variableNames);
            if (rv) {
                results.push({
                    regionProvider: this.regionProviders[i],
                    variableName: rv,
                    disambigVariableName: this.regionProviders[i].findDisambigVariable(variableNames)
                });
            }
        }
        return results;
    }
    /**
     * Get the region provider matching a regionType string (eg, STE)
     *
     * @param {String} regionType The type string to look up.
     * @return {RegionProvider} The region provider matching a regionType string (eg, STE), or undefined.
     */
    getRegionProvider(regionType) {
        const r = this.regionProviders.filter(function (p) {
            return p.regionType.toLowerCase() === regionType.toLowerCase();
        });
        if (r.length > 1) {
            throw new DeveloperError("More than one definition of region provider: " + regionType);
        }
        if (r.length === 0) {
            return undefined;
        }
        return r[0];
    }
}
/* A static dictionary of promises to RegionProviderLists */
Object.defineProperty(RegionProviderList, "metaList", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {}
});
export default RegionProviderList;
//# sourceMappingURL=RegionProviderList.js.map