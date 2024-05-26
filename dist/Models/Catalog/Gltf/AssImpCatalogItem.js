var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, observable, runInAction, makeObservable } from "mobx";
import URI from "urijs";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import loadArrayBuffer from "../../../Core/loadArrayBuffer";
import loadBlob, { isZip, parseZipArrayBuffers } from "../../../Core/loadBlob";
import TerriaError, { TerriaErrorSeverity } from "../../../Core/TerriaError";
import { getName } from "../../../ModelMixins/CatalogMemberMixin";
import GltfMixin from "../../../ModelMixins/GltfMixin";
import AssImpCatalogItemTraits from "../../../Traits/TraitsClasses/AssImpCatalogItemTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
// List of supported image formats from https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
// + Cesium adds support for ktx2
const supportedTextureExtensions = [
    "apng",
    "avif",
    "gif",
    "jpg",
    "jpeg",
    "jfif",
    "pjpeg",
    "pjp",
    "png",
    "svg",
    "webp",
    "ktx2"
];
class AssImpCatalogItem extends GltfMixin(CreateModel(AssImpCatalogItemTraits)) {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "gltfModelUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasLocalData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        makeObservable(this);
    }
    get type() {
        return AssImpCatalogItem.type;
    }
    setFileInput(file) {
        const dataUrl = URL.createObjectURL(file);
        this.setTrait(CommonStrata.user, "urls", [dataUrl]);
        this.hasLocalData = true;
    }
    async forceLoadMapItems() {
        var _a, _b, _c;
        const urls = this.urls.length > 0 ? this.urls : filterOutUndefined([this.url]);
        if (urls.length === 0)
            return;
        let baseUrl = this.baseUrl;
        // If no baseUrl provided - but we have a single URL -> construct baseUrl from that
        if (!baseUrl && urls.length === 1) {
            const uri = new URI(urls[0]);
            baseUrl = uri.origin() + uri.directory() + "/";
        }
        // TODO: revokeObjectURL() for all created objects
        /** Maps paths to absolute URLs
         * This is used to substitute paths in GlTf (eg buffer or image/texture paths)
         * - All local data (eg files output from assimp - or locally uploaded zip file) - use `createObjectURL` to get URL to local blob
         * - All remote data will use absolute URLs
         *
         * For example
         * - **Remote data** - explicitly defined in `this.url` or `this.urls`
         *    - URL "http://localhost:3001/some-dir/some-file.jpg" (as defined in `url` or `urls`)
         *    - path in GlTf = "some-file.jpg"
         *    - So we replace gltf.images[i].uri "some-file.jpg" with "http://localhost:3001/some-dir/some-file.jpg" (using `dataUrls`)
         * - **Remote data** - implicitly references in 3D file
         *    - URL "http://localhost:3001/some-dir/some-collada-file.dae" (as defined in `url` or `urls`)
         *    - This Collada file internally references "some-file.jpg"
         *    - `baseUrl` is equal to "http://localhost:3001/some-dir/"
         *    - So we replace gltf.images[i].uri "some-file.jpg" with "http://localhost:3001/some-dir/some-file.jpg" (this is done post conversion to GlTf)
         * - **Local data** - from zip file
         *    - Upload zip file with "some-file.jpg"
         *    - Create local blob URL "blob:http://localhost:3001/some-blob-uuid"
         *    - So we replace gltf.images[i].uri "some-file.jpg" with "blob:http://localhost:3001/some-blob-uuid" (using `dataUrls`)
         */
        const dataUrls = new Map();
        /** List of files to input into `assimpjs`
         * This will be populated with all files downloaded using `url` or `urls` - and all files from downloaded/uploaded zip files
         */
        const fileArrayBuffers = [];
        let zipRootDir;
        await Promise.all(urls.map(async (url) => {
            // **Local data** - treat all URLs as zip if they have been uploaded
            if (isZip(url) || this.hasLocalData) {
                const blob = await loadBlob(proxyCatalogItemUrl(this, url));
                const zipFiles = await parseZipArrayBuffers(blob);
                zipFiles.forEach((zipFile, i) => {
                    if (i === 0 && zipFile.isDirectory) {
                        // If the first entry is a directory, we treat it as a root
                        // directory that contains all the other files.
                        zipRootDir = zipFile.fileName;
                    }
                    fileArrayBuffers.push({
                        name: zipFile.fileName,
                        arrayBuffer: zipFile.data
                    });
                    // Because these unzipped files are local - we need to create URL to local blob
                    const blob = new Blob([zipFile.data]);
                    const dataUrl = URL.createObjectURL(blob);
                    // Push filename -> local data blob URI
                    let fileName = zipFile.fileName;
                    if (zipRootDir) {
                        // This zip appears to have contents inside a root
                        // directory. Rewrite file names relative to this root so that
                        // assimp can correctly resolve relatively referenced assets.
                        fileName = zipFile.fileName.startsWith(zipRootDir)
                            ? zipFile.fileName.slice(zipRootDir.length)
                            : zipFile.fileName;
                    }
                    dataUrls.set(fileName, dataUrl);
                });
            }
            // **Remote data** - explicitly defined in `url` or `urls`
            else {
                const arrayBuffer = await loadArrayBuffer(proxyCatalogItemUrl(this, url));
                const uri = new URI(url);
                const name = uri.filename();
                fileArrayBuffers.push({
                    name,
                    arrayBuffer
                });
                // Because all these files are "remote", we want to substitute filename with absolute URL
                dataUrls.set(name, uri.absoluteTo(window.location.href).toString());
            }
        }));
        // Init assimpjs
        const assimpjs = (await import("assimpjs")).default;
        const ajs = await assimpjs();
        // Create assimpjs FileList object, and add the files
        const fileList = new ajs.FileList();
        for (let i = 0; i < fileArrayBuffers.length; i++) {
            fileList.AddFile(fileArrayBuffers[i].name, new Uint8Array(fileArrayBuffers[i].arrayBuffer));
        }
        // Convert files to GlTf 2
        const result = ajs.ConvertFileList(fileList, "gltf2");
        const fileCount = result.FileCount();
        if (!result.IsSuccess() || fileCount === 0) {
            throw TerriaError.from(result.GetErrorCode(), {
                title: "Failed to convert files to GlTf"
            });
        }
        /** This is used so we only set `this.gltfModelUrl` after process has finished */
        let gltfModelUrl;
        /** List of unsupported texture URLs to show in warning message */
        const unsupportedTextures = [];
        // Go through files backward - as GlTf file is first (i==0), followed by dependencies (eg buffers, textures)
        // As we may need to correct paths in GlTf file. Dependencies are stored in browser - so we need to use local blob object URL before processing GlTf file
        for (let i = fileCount - 1; i >= 0; i--) {
            const file = result.GetFile(i);
            const path = file.GetPath();
            let arrayBuffer = file.GetContent();
            // i === 0 is GlTf file
            // So we parse the file into JSON and edit paths for buffers, images, ...
            if (i === 0) {
                const file = new File([arrayBuffer], path);
                const gltfJson = JSON.parse(await file.text());
                // Replace buffer file URIs
                // Buffer files are generated by Assimp - so we just replace the path with local Blob URL
                (_a = gltfJson.buffers) === null || _a === void 0 ? void 0 : _a.forEach((buffer) => {
                    if (!buffer.uri)
                        return;
                    const newUri = dataUrls.get(buffer.uri);
                    console.log(`replacing GlTf buffer path \`${buffer.uri}\` with \`${newUri}\``);
                    buffer.uri = newUri;
                });
                // Replace image file URIs
                // Image files are external to Assimp - so we do a bit more wrangling:
                // - Replace back slashes with forward slash
                // - Remove leading "./" or "//"
                // - See dataUrls for info on URL transformation
                (_b = gltfJson.images) === null || _b === void 0 ? void 0 : _b.forEach((image) => {
                    if (!image.uri)
                        return;
                    // Replace back slashes with forward slash
                    let newUrl = image.uri.replace(/\\/g, "/");
                    // Remove start "./" or "//" from uri
                    if (newUrl.startsWith("//") || newUrl.startsWith("./")) {
                        newUrl = newUrl.slice(2);
                    }
                    // If any unsupported image URIs are detected (by extension/suffix) then we show a warning message listing them
                    if (!supportedTextureExtensions.some((ext) => ext === new URI(newUrl).suffix())) {
                        unsupportedTextures.push(image.uri);
                    }
                    // Do we have substitute URL in dataUrls (see dataUrls for more info)
                    // This covers:
                    // - Remote data - explicitly defined in `url` or `urls`
                    // - Local data - from zip file
                    if (dataUrls.has(newUrl)) {
                        newUrl = dataUrls.get(newUrl);
                    }
                    // No substitute URL - so resolve URL to baseUrl (if defined)
                    // This covers:
                    // - Remote data - implicitly defined in 3D file
                    else if (baseUrl) {
                        newUrl = new URI(newUrl).absoluteTo(baseUrl).toString();
                    }
                    if (newUrl !== image.uri) {
                        console.log(`replacing GlTf image path \`${image.uri}\` with \`${newUrl}\``);
                        image.uri = newUrl;
                    }
                });
                // TODO: Replace KHR_techniques_webgl extension shader URIs?
                // https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Archived/KHR_techniques_webgl/README.md#shader
                /** For some reason Cesium ignores textures if the KHR_materials_pbrSpecularGlossiness material extension is used and model has no normals.
                 *
                 * Here's the code that shades based on the diffuseTexture when that extension is in use: https://github.com/TerriaJS/cesium/blob/terriajs/Source/Scene/processPbrMaterials.js#L797
                 * And it's inside this conditional: https://github.com/TerriaJS/cesium/blob/terriajs/Source/Scene/processPbrMaterials.js#L771
                 *
                 * For the moment - if we have images, we go through all materials and delete the extension
                 */
                if (gltfJson.images && gltfJson.images.length > 0) {
                    (_c = gltfJson.materials) === null || _c === void 0 ? void 0 : _c.forEach((material) => {
                        var _a;
                        if ((_a = material.extensions) === null || _a === void 0 ? void 0 : _a.KHR_materials_pbrSpecularGlossiness)
                            material.extensions.KHR_materials_pbrSpecularGlossiness =
                                undefined;
                    });
                }
                // Turn GlTf back into array buffer - this overwrites existing GlTf
                arrayBuffer = Buffer.from(JSON.stringify(gltfJson));
            }
            // Convert assimp output file to blob and create object URL
            const blob = new Blob([arrayBuffer]);
            const dataUrl = URL.createObjectURL(blob);
            // Add map from filePath to local blob URL
            // This will be used to substitute paths when processing GlTf file
            dataUrls.set(path, dataUrl);
            // GlTf file
            if (i === 0) {
                gltfModelUrl = dataUrl;
            }
        }
        runInAction(() => {
            this.gltfModelUrl = gltfModelUrl;
        });
        if (unsupportedTextures.length > 0)
            throw new TerriaError({
                severity: TerriaErrorSeverity.Warning,
                title: "Unsupported texture formats",
                message: `Catalog item \`"${getName(this)}"\` has unsupported texture formats for the following:  \n${unsupportedTextures.map((path) => `- \`${path}\`\n`)}\n\nThe model may not display correctly.  \n\nList of supported formats: ${supportedTextureExtensions
                    .map((ext) => `\`${ext}\``)
                    .join(", ")}`
            });
    }
}
Object.defineProperty(AssImpCatalogItem, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "assimp"
});
export default AssImpCatalogItem;
__decorate([
    observable
], AssImpCatalogItem.prototype, "gltfModelUrl", void 0);
__decorate([
    observable
], AssImpCatalogItem.prototype, "hasLocalData", void 0);
__decorate([
    action
], AssImpCatalogItem.prototype, "setFileInput", null);
//# sourceMappingURL=AssImpCatalogItem.js.map