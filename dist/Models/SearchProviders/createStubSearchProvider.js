import CommonStrata from "../Definition/CommonStrata";
import { BaseModel } from "../Definition/Model";
import StubSearchProvider from "./StubSearchProvider";
const getUniqueStubSearchProviderName = (terria) => {
    const stubName = "[StubSearchProvider]";
    let uniqueId = stubName;
    let idIncrement = 1;
    while (terria.getModelById(BaseModel, uniqueId) !== undefined) {
        uniqueId = stubName + " (" + idIncrement + ")";
        idIncrement++;
    }
    return uniqueId;
};
export default function createStubSearchProvider(terria, uniqueId) {
    const idToUse = uniqueId || getUniqueStubSearchProviderName(terria);
    const stub = new StubSearchProvider(idToUse, terria);
    stub.setTrait(CommonStrata.underride, "name", stub.uniqueId);
    terria.searchBarModel.addSearchProvider(stub);
    return stub;
}
//# sourceMappingURL=createStubSearchProvider.js.map