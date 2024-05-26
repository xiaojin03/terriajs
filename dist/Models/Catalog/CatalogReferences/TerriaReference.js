import i18next from "i18next";
import { flow } from "mobx";
import isDefined from "../../../Core/isDefined";
import { isJsonObject } from "../../../Core/Json";
import loadJson5 from "../../../Core/loadJson5";
import TerriaError from "../../../Core/TerriaError";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import ReferenceMixin from "../../../ModelMixins/ReferenceMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import TerriaReferenceTraits from "../../../Traits/TraitsClasses/TerriaReferenceTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import updateModelFromJson from "../../Definition/updateModelFromJson";
import CatalogMemberFactory from "../CatalogMemberFactory";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
/**
 * A reference to another terria catalog.
 *
 * Terria reference can be used to load a group, an item or all members of
 * another terria catalog (also known as an init file).
 *
 * If `path`:
 *   - is specified, it must be an array of IDs giving the path of the item to load in the target catalog tree.
 *   - is not specified, we show all members of the catalog under the reference item.
 *
 * `isGroup` must be set to `true` if the target item is a group.
 *
 */
class TerriaReference extends UrlMixin(ReferenceMixin(CreateModel(TerriaReferenceTraits))) {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "forceLoadReference", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: flow(function* (_previousTarget) {
                if (this.url === undefined || this.uniqueId === undefined) {
                    return undefined;
                }
                const initJson = yield loadJson5(proxyCatalogItemUrl(this, this.url, this.cacheDuration));
                if (!isJsonObject(initJson) || !Array.isArray(initJson.catalog)) {
                    return;
                }
                let targetJson;
                if (this.path) {
                    // Find the group/item to load at the path
                    targetJson = findCatalogMemberJson(initJson.catalog, this.path.slice());
                }
                else {
                    // Load the entire catalog members as a group
                    targetJson = {
                        type: "group",
                        members: initJson.catalog,
                        name: this.name
                    };
                }
                if (typeof (targetJson === null || targetJson === void 0 ? void 0 : targetJson.type) === "string") {
                    const target = CatalogMemberFactory.create(targetJson.type, this.uniqueId, this.terria, this);
                    if (target === undefined) {
                        throw new TerriaError({
                            sender: this,
                            title: i18next.t("models.catalog.unsupportedTypeTitle"),
                            message: i18next.t("models.catalog.unsupportedTypeMessage", {
                                type: `"${targetJson.type}"`
                            })
                        });
                    }
                    else {
                        if (targetJson.name !== undefined) {
                            // Override the target's name with the name of this reference.
                            // This avoids the name of the catalog suddenly changing after the reference is loaded.
                            targetJson.name = this.name;
                        }
                        // Override `GroupTraits` if targetJson is a group
                        if (GroupMixin.isMixedInto(target) &&
                            isDefined(targetJson.isOpen) &&
                            typeof targetJson.isOpen === "boolean") {
                            target.setTrait(CommonStrata.definition, "isOpen", targetJson.isOpen);
                        }
                        updateModelFromJson(target, CommonStrata.definition, targetJson).catchError((error) => {
                            target.setTrait(CommonStrata.underride, "isExperiencingIssues", true);
                            error.log();
                        });
                        return target;
                    }
                }
                throw new TerriaError({
                    sender: this,
                    title: i18next.t("models.terria-reference.failedToLoadTarget"),
                    message: i18next.t("models.terria-reference.failedToLoadTarget")
                });
            })
        });
    }
    get type() {
        return TerriaReference.type;
    }
}
Object.defineProperty(TerriaReference, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "terria-reference"
});
export default TerriaReference;
/**
 * Returns a catalog member JSON at the specified path or undefined if it doesn't exist.
 */
function findCatalogMemberJson(catalogMembers, path) {
    const member = path.reduce((group, id) => {
        if (Array.isArray(group === null || group === void 0 ? void 0 : group.members)) {
            return group.members.find((m) => (m === null || m === void 0 ? void 0 : m.id) === id);
        }
        else {
            return undefined;
        }
    }, { members: catalogMembers });
    return member;
}
//# sourceMappingURL=TerriaReference.js.map