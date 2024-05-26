var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, isObservableArray, makeObservable, observable, override, runInAction } from "mobx";
import Mustache from "mustache";
import URI from "urijs";
import { networkRequestError } from "../../../Core/TerriaError";
import flatten from "../../../Core/flatten";
import isDefined from "../../../Core/isDefined";
import loadJson from "../../../Core/loadJson";
import runLater from "../../../Core/runLater";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import CkanCatalogGroupTraits from "../../../Traits/TraitsClasses/CkanCatalogGroupTraits";
import CkanSharedTraits from "../../../Traits/TraitsClasses/CkanSharedTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import CatalogGroup from "../CatalogGroup";
import WebMapServiceCatalogItem from "../Ows/WebMapServiceCatalogItem";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import CkanDefaultFormatsStratum from "./CkanDefaultFormatsStratum";
import CkanItemReference, { getCkanItemName, getSupportedFormats, prepareSupportedFormat } from "./CkanItemReference";
export function createInheritedCkanSharedTraitsStratum(model) {
    const propertyNames = Object.keys(CkanSharedTraits.traits);
    const reduced = propertyNames.reduce((p, c) => ({
        ...p,
        get [c]() {
            return model[c];
        }
    }), {});
    return observable(reduced);
}
createInheritedCkanSharedTraitsStratum.stratumName =
    "ckanItemReferenceInheritedPropertiesStratum";
// This can't be definition stratum, as then it will sit on top of underride/definition/override
// CkanServerStratum.createMemberFromDataset will use `definition`
StratumOrder.addLoadStratum(createInheritedCkanSharedTraitsStratum.stratumName);
export class CkanServerStratum extends LoadableStratum(CkanCatalogGroupTraits) {
    constructor(_catalogGroup, _ckanResponse) {
        super();
        Object.defineProperty(this, "_catalogGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: _catalogGroup
        });
        Object.defineProperty(this, "_ckanResponse", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: _ckanResponse
        });
        Object.defineProperty(this, "groups", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "filteredGroups", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "datasets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "filteredDatasets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        makeObservable(this);
        this.datasets = this.getDatasets();
        this.filteredDatasets = this.getFilteredDatasets();
        this.groups = this.getGroups();
        this.filteredGroups = this.getFilteredGroups();
    }
    duplicateLoadableStratum(model) {
        return new CkanServerStratum(model, this._ckanResponse);
    }
    static addFilterQuery(uri, filterQuery) {
        if (typeof filterQuery === "string") {
            // An encoded filterQuery may look like "fq=+(res_format%3Awms%20OR%20res_format%3AWMS)".
            // An unencoded filterQuery may look like "fq=(res_format:wms OR res_format:WMS)".
            // In both cases, don't use addQuery(filterQuery) as "=" will be escaped too, which will
            // cause unexpected result (e.g. empty query result).
            uri.query(uri.query() + "&" + filterQuery);
        }
        else {
            Object.keys(filterQuery).forEach((key) => uri.addQuery(key, filterQuery[key]));
        }
        uri.normalize();
        return uri;
    }
    static async load(catalogGroup) {
        const terria = catalogGroup.terria;
        let ckanServerResponse = undefined;
        // Each item in the array causes an independent request to the CKAN, and the results are concatenated
        for (let i = 0; i < catalogGroup.filterQuery.length; ++i) {
            const filterQuery = catalogGroup.filterQuery[i];
            const uri = new URI(catalogGroup.url)
                .segment("api/3/action/package_search")
                .addQuery({ start: 0, rows: 1000, sort: "metadata_created asc" });
            CkanServerStratum.addFilterQuery(uri, filterQuery);
            const result = await paginateThroughResults(uri, catalogGroup);
            if (ckanServerResponse === undefined) {
                ckanServerResponse = result;
            }
            else {
                ckanServerResponse.result.results =
                    ckanServerResponse.result.results.concat(result.result.results);
            }
        }
        if (ckanServerResponse === undefined)
            return undefined;
        return new CkanServerStratum(catalogGroup, ckanServerResponse);
    }
    get preparedSupportedFormats() {
        return this._catalogGroup.supportedResourceFormats
            ? this._catalogGroup.supportedResourceFormats.map(prepareSupportedFormat)
            : [];
    }
    get members() {
        // When data is grouped (most circumstances) return group id's
        // for those which have content
        if (this.filteredGroups !== undefined &&
            this._catalogGroup.groupBy !== "none") {
            const groupIds = [];
            this.filteredGroups.forEach((g) => {
                if (g.members.length > 0) {
                    groupIds.push(g.uniqueId);
                }
            });
            return groupIds;
        }
        return flatten(this.filteredDatasets.map((dataset) => dataset.resources.map((resource) => this.getItemId(dataset, resource))));
    }
    getDatasets() {
        return this._ckanResponse.result.results;
    }
    getFilteredDatasets() {
        if (this.datasets.length === 0)
            return [];
        if (this._catalogGroup.excludeMembers !== undefined) {
            const bl = this._catalogGroup.excludeMembers;
            return this.datasets.filter((ds) => bl.indexOf(ds.title) === -1);
        }
        return this.datasets;
    }
    getGroups() {
        if (this._catalogGroup.groupBy === "none")
            return [];
        let groups = [];
        if (this._catalogGroup.groupBy === "organization")
            createGroupsByOrganisations(this, groups);
        if (this._catalogGroup.groupBy === "group")
            createGroupsByCkanGroups(this, groups);
        const ungroupedGroup = createUngroupedGroup(this);
        groups = [...new Set(groups)];
        groups.sort(function (a, b) {
            if (a.name === undefined || b.name === undefined)
                return 0;
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        // Put "ungrouped" group at end of groups
        return [...groups, ungroupedGroup];
    }
    getFilteredGroups() {
        if (this.groups.length === 0)
            return [];
        if (this._catalogGroup.excludeMembers !== undefined) {
            const bl = this._catalogGroup.excludeMembers;
            return this.groups.filter((group) => {
                if (group.name === undefined)
                    return false;
                else
                    return bl.indexOf(group.name) === -1;
            });
        }
        return this.groups;
    }
    createMembersFromDatasets() {
        this.filteredDatasets.forEach((dataset) => {
            this.createMemberFromDataset(dataset);
        });
    }
    addCatalogItemToCatalogGroup(catalogItem, dataset, groupId) {
        const group = this._catalogGroup.terria.getModelById(CatalogGroup, groupId);
        if (group !== undefined) {
            group.add(CommonStrata.definition, catalogItem);
        }
    }
    addCatalogItemByCkanGroupsToCatalogGroup(catalogItem, dataset) {
        if (dataset.groups.length === 0) {
            const groupId = this._catalogGroup.uniqueId + "/ungrouped";
            this.addCatalogItemToCatalogGroup(catalogItem, dataset, groupId);
            return;
        }
        dataset.groups.forEach((g) => {
            const groupId = this._catalogGroup.uniqueId + "/" + g.id;
            this.addCatalogItemToCatalogGroup(catalogItem, dataset, groupId);
        });
    }
    createMemberFromDataset(ckanDataset) {
        var _a;
        if (!isDefined(ckanDataset.id)) {
            return;
        }
        /** If excludeInactiveDatasets is true - then filter out datasets with one of the following
         * - state === "deleted" (CKAN official)
         * - state === "draft" (CKAN official)
         * - data_state === "inactive" (Data.gov.au CKAN)
         */
        if (this._catalogGroup.excludeInactiveDatasets &&
            (ckanDataset.state === "deleted" ||
                ckanDataset.state === "draft" ||
                ckanDataset.data_state === "inactive")) {
            return;
        }
        // Get list of resources to turn into CkanItemReferences
        const supportedResources = getSupportedFormats(ckanDataset, this.preparedSupportedFormats);
        let filteredResources = [];
        // Track format IDS which multiple resources
        // As if they do, we will need to make sure that CkanItemReference uses resource name (instead of dataset name)
        const formatsWithMultipleResources = new Set();
        if (this._catalogGroup.useSingleResource) {
            filteredResources = supportedResources[0] ? [supportedResources[0]] : [];
        }
        else {
            // Apply CkanResourceFormatTraits constraints
            // - onlyUseIfSoleResource
            // - removeDuplicates
            this.preparedSupportedFormats.forEach((supportedFormat) => {
                let matchingResources = supportedResources.filter((format) => format.format.id === supportedFormat.id);
                if (matchingResources.length === 0)
                    return;
                // Remove duplicate resources (by name property)
                // If multiple are found, use newest resource (by created property)
                if (supportedFormat.removeDuplicates) {
                    matchingResources = Object.values(matchingResources.reduce((uniqueResources, currentResource) => {
                        const currentResourceName = currentResource.resource.name;
                        // Set resource if none found for currentResourceName
                        // Or if found duplicate, and current is a "newer" resource, replace it in uniqueResources
                        if (!uniqueResources[currentResourceName] ||
                            (uniqueResources[currentResourceName] &&
                                uniqueResources[currentResourceName].resource.created <
                                    currentResource.resource.created)) {
                            uniqueResources[currentResourceName] = currentResource;
                        }
                        return uniqueResources;
                    }, {}));
                }
                if (supportedFormat.onlyUseIfSoleResource) {
                    if (supportedResources.length === matchingResources.length) {
                        filteredResources.push(...matchingResources);
                    }
                }
                else {
                    filteredResources.push(...matchingResources);
                }
                if (matchingResources.length > 1 && supportedFormat.id) {
                    formatsWithMultipleResources.add(supportedFormat.id);
                }
            });
        }
        // Create CkanItemReference for each filteredResource
        // Create a computed stratum to pass shared configuration down to items
        const inheritedPropertiesStratum = createInheritedCkanSharedTraitsStratum(this._catalogGroup);
        for (let i = 0; i < filteredResources.length; ++i) {
            const { resource, format } = filteredResources[i];
            const itemId = this.getItemId(ckanDataset, resource);
            let item = this._catalogGroup.terria.getModelById(CkanItemReference, itemId);
            if (item === undefined) {
                item = new CkanItemReference(itemId, this._catalogGroup.terria);
                // If we only have one resources for this dataset - disable these traits which change name
                if (filteredResources.length === 1) {
                    item.setTrait(CommonStrata.override, "useCombinationNameWhereMultipleResources", false);
                    item.setTrait(CommonStrata.override, "useDatasetNameAndFormatWhereMultipleResources", false);
                }
                // If we have multiple resources for a given format, make sure we use resource name
                else if (format.id && formatsWithMultipleResources.has(format.id)) {
                    item.setTrait(CommonStrata.override, "useResourceName", true);
                }
                item.setDataset(ckanDataset);
                item.setCkanCatalog(this._catalogGroup);
                item.setSharedStratum(inheritedPropertiesStratum);
                item.setResource(resource);
                item.setSupportedFormat(format);
                item.setCkanStrata(item);
                // If Item is WMS-group and allowEntireWmsServers === false, then stop here
                if (((_a = format.definition) === null || _a === void 0 ? void 0 : _a.type) === WebMapServiceCatalogItem.type &&
                    !item.wmsLayers &&
                    !this._catalogGroup.allowEntireWmsServers) {
                    return;
                }
                item.terria.addModel(item);
                const name = getCkanItemName(item);
                if (name)
                    item.setTrait(CommonStrata.definition, "name", name);
                if (this._catalogGroup.groupBy === "organization") {
                    const groupId = ckanDataset.organization
                        ? this._catalogGroup.uniqueId + "/" + ckanDataset.organization.id
                        : this._catalogGroup.uniqueId + "/ungrouped";
                    this.addCatalogItemToCatalogGroup(item, ckanDataset, groupId);
                }
                else if (this._catalogGroup.groupBy === "group") {
                    this.addCatalogItemByCkanGroupsToCatalogGroup(item, ckanDataset);
                }
            }
        }
    }
    getItemId(ckanDataset, resource) {
        const resourceId = this.buildResourceId(ckanDataset, resource);
        return `${this._catalogGroup.uniqueId}/${ckanDataset.id}/${resourceId}`;
    }
    /**
     * Build an ID for the given resource using the `resourceIdTemplate` if available.
     */
    buildResourceId(ckanDataset, resource) {
        var _a;
        const resourceIdTemplate = this.resourceIdTemplateForOrg((_a = ckanDataset.organization) === null || _a === void 0 ? void 0 : _a.name);
        const resourceId = resourceIdTemplate
            ? // Use mustache to construct the resource id from template. Also delete any `/`
                // character in the resulting ID to avoid conflict with the path separator.
                Mustache.render(resourceIdTemplate, { resource }).replace("/", "")
            : resource.id;
        return resourceId;
    }
    /**
     * Returns a template for constructing alternate resourceId for the given
     * organisation or `undefined` when no template is defined.
     */
    resourceIdTemplateForOrg(orgName) {
        const template = this._catalogGroup.resourceIdTemplate;
        // No template defined
        if (!template) {
            return undefined;
        }
        const restrictedOrgNames = this._catalogGroup.restrictResourceIdTemplateToOrgsWithNames;
        if (Array.isArray(restrictedOrgNames) ||
            isObservableArray(restrictedOrgNames)) {
            // Use of template restricted by org names - return template only if this org is in the list
            return restrictedOrgNames.includes(orgName) ? template : undefined;
        }
        // Template usage has no restrictions - return template for any org
        return template;
    }
}
Object.defineProperty(CkanServerStratum, "stratumName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ckanServer"
});
__decorate([
    computed
], CkanServerStratum.prototype, "preparedSupportedFormats", null);
__decorate([
    computed
], CkanServerStratum.prototype, "members", null);
__decorate([
    action
], CkanServerStratum.prototype, "getFilteredDatasets", null);
__decorate([
    action
], CkanServerStratum.prototype, "getGroups", null);
__decorate([
    action
], CkanServerStratum.prototype, "getFilteredGroups", null);
__decorate([
    action
], CkanServerStratum.prototype, "createMembersFromDatasets", null);
__decorate([
    action
], CkanServerStratum.prototype, "addCatalogItemToCatalogGroup", null);
__decorate([
    action
], CkanServerStratum.prototype, "addCatalogItemByCkanGroupsToCatalogGroup", null);
__decorate([
    action
], CkanServerStratum.prototype, "createMemberFromDataset", null);
__decorate([
    action
], CkanServerStratum.prototype, "getItemId", null);
StratumOrder.addLoadStratum(CkanServerStratum.stratumName);
class CkanCatalogGroup extends UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(CkanCatalogGroupTraits)))) {
    constructor(uniqueId, terria, sourceReference) {
        super(uniqueId, terria, sourceReference);
        makeObservable(this);
        this.strata.set(CkanDefaultFormatsStratum.stratumName, new CkanDefaultFormatsStratum());
    }
    get type() {
        return CkanCatalogGroup.type;
    }
    get typeName() {
        return i18next.t("models.ckan.nameServer");
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    async forceLoadMetadata() {
        const ckanServerStratum = this.strata.get(CkanServerStratum.stratumName);
        if (!ckanServerStratum) {
            const stratum = await CkanServerStratum.load(this);
            if (stratum === undefined)
                return;
            runInAction(() => {
                this.strata.set(CkanServerStratum.stratumName, stratum);
            });
        }
    }
    async forceLoadMembers() {
        const ckanServerStratum = this.strata.get(CkanServerStratum.stratumName);
        if (ckanServerStratum) {
            await runLater(() => ckanServerStratum.createMembersFromDatasets());
        }
    }
}
Object.defineProperty(CkanCatalogGroup, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ckan-group"
});
export default CkanCatalogGroup;
__decorate([
    override
], CkanCatalogGroup.prototype, "cacheDuration", null);
function createGroup(groupId, terria, groupName) {
    const g = new CatalogGroup(groupId, terria);
    g.setTrait(CommonStrata.definition, "name", groupName);
    terria.addModel(g);
    return g;
}
function createUngroupedGroup(ckanServer) {
    const groupId = ckanServer._catalogGroup.uniqueId + "/ungrouped";
    let existingGroup = ckanServer._catalogGroup.terria.getModelById(CatalogGroup, groupId);
    if (existingGroup === undefined) {
        existingGroup = createGroup(groupId, ckanServer._catalogGroup.terria, ckanServer._catalogGroup.ungroupedTitle);
    }
    return existingGroup;
}
function createGroupsByOrganisations(ckanServer, groups) {
    ckanServer.filteredDatasets.forEach((ds) => {
        if (ds.organization !== null) {
            const groupId = ckanServer._catalogGroup.uniqueId + "/" + ds.organization.id;
            let existingGroup = ckanServer._catalogGroup.terria.getModelById(CatalogGroup, groupId);
            if (existingGroup === undefined) {
                existingGroup = createGroup(groupId, ckanServer._catalogGroup.terria, ds.organization.title);
            }
            groups.push(existingGroup);
        }
    });
}
function createGroupsByCkanGroups(ckanServer, groups) {
    ckanServer.filteredDatasets.forEach((ds) => {
        ds.groups.forEach((g) => {
            const groupId = ckanServer._catalogGroup.uniqueId + "/" + g.id;
            let existingGroup = ckanServer._catalogGroup.terria.getModelById(CatalogGroup, groupId);
            if (existingGroup === undefined) {
                existingGroup = createGroup(groupId, ckanServer._catalogGroup.terria, g.display_name);
                existingGroup.setTrait(CommonStrata.definition, "description", g.description);
            }
            groups.push(existingGroup);
        });
    });
}
async function paginateThroughResults(uri, catalogGroup) {
    const ckanServerResponse = await getCkanDatasets(uri, catalogGroup);
    if (ckanServerResponse === undefined ||
        !ckanServerResponse ||
        !ckanServerResponse.help) {
        throw networkRequestError({
            title: i18next.t("models.ckan.errorLoadingTitle"),
            message: i18next.t("models.ckan.errorLoadingMessage")
        });
    }
    let nextResultStart = 1001;
    while (nextResultStart < ckanServerResponse.result.count) {
        await getMoreResults(uri, catalogGroup, ckanServerResponse, nextResultStart);
        nextResultStart = nextResultStart + 1000;
    }
    return ckanServerResponse;
}
async function getCkanDatasets(uri, catalogGroup) {
    const response = await loadJson(proxyCatalogItemUrl(catalogGroup, uri.toString()));
    return response;
}
async function getMoreResults(uri, catalogGroup, baseResults, nextResultStart) {
    uri.setQuery("start", nextResultStart);
    const ckanServerResponse = await getCkanDatasets(uri, catalogGroup);
    if (ckanServerResponse === undefined) {
        return;
    }
    baseResults.result.results = baseResults.result.results.concat(ckanServerResponse.result.results);
}
//# sourceMappingURL=CkanCatalogGroup.js.map