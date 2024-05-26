var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, makeObservable, override, runInAction } from "mobx";
import Mustache from "mustache";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import loadWithXhr from "../../../Core/loadWithXhr";
import TerriaError from "../../../Core/TerriaError";
import TableMixin from "../../../ModelMixins/TableMixin";
import TableAutomaticStylesStratum from "../../../Table/TableAutomaticStylesStratum";
import TableColumnType from "../../../Table/TableColumnType";
import xml2json from "../../../ThirdParty/xml2json";
import SensorObservationServiceCatalogItemTraits from "../../../Traits/TraitsClasses/SensorObservationCatalogItemTraits";
import TableChartStyleTraits, { TableChartLineStyleTraits } from "../../../Traits/TraitsClasses/Table/ChartStyleTraits";
import TablePointSizeStyleTraits from "../../../Traits/TraitsClasses/Table/PointSizeStyleTraits";
import TableStyleTraits from "../../../Traits/TraitsClasses/Table/StyleTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import StratumOrder from "../../Definition/StratumOrder";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
StratumOrder.addLoadStratum(TableAutomaticStylesStratum.stratumName);
class SosAutomaticStylesStratum extends TableAutomaticStylesStratum {
    constructor(catalogItem) {
        super(catalogItem);
        Object.defineProperty(this, "catalogItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: catalogItem
        });
        makeObservable(this);
    }
    duplicateLoadableStratum(newModel) {
        return new SosAutomaticStylesStratum(newModel);
    }
    get activeStyle() {
        var _a;
        return (_a = this.catalogItem.procedures[0]) === null || _a === void 0 ? void 0 : _a.identifier;
    }
    get styles() {
        return this.catalogItem.procedures.map((p) => {
            return createStratumInstance(TableStyleTraits, {
                id: p.identifier,
                title: p.title,
                pointSize: createStratumInstance(TablePointSizeStyleTraits, {
                    pointSizeColumn: p.identifier
                }),
                // table style is hidden by default when the table uses only 1 color (https://github.com/TerriaJS/terriajs/blob/bbe8a11ae9bf6c0eb78c52d7b5c9b260d5ddc8cf/lib/Table/TableStyle.ts#L82)
                // force hidden to false so that the frequency and procedure selector will always be shown
                // Ideally we should rewrite frequency & procedure selector using selectable dimensions and stop using styles to display them.
                hidden: false
            });
        });
    }
    get defaultChartStyle() {
        const timeColumn = this.catalogItem.tableColumns.find((column) => column.type === TableColumnType.time);
        const valueColumn = this.catalogItem.tableColumns.find((column) => column.type === TableColumnType.scalar);
        if (timeColumn && valueColumn) {
            return createStratumInstance(TableStyleTraits, {
                chart: createStratumInstance(TableChartStyleTraits, {
                    xAxisColumn: timeColumn.name,
                    lines: [
                        createStratumInstance(TableChartLineStyleTraits, {
                            yAxisColumn: valueColumn.name
                        })
                    ]
                })
            });
        }
    }
}
__decorate([
    override
], SosAutomaticStylesStratum.prototype, "activeStyle", null);
__decorate([
    override
], SosAutomaticStylesStratum.prototype, "styles", null);
__decorate([
    override
], SosAutomaticStylesStratum.prototype, "defaultChartStyle", null);
class GetFeatureOfInterestRequest {
    constructor(catalogItem, requestTemplate) {
        Object.defineProperty(this, "catalogItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: catalogItem
        });
        Object.defineProperty(this, "requestTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: requestTemplate
        });
        makeObservable(this);
    }
    get url() {
        return this.catalogItem.url;
    }
    get observedProperties() {
        return filterOutUndefined(this.catalogItem.observableProperties.map((p) => p.identifier));
    }
    get procedures() {
        if (this.catalogItem.filterByProcedures) {
            return filterOutUndefined(this.catalogItem.procedures.map((p) => p.identifier));
        }
    }
    async perform() {
        if (this.url === undefined) {
            return;
        }
        const templateContext = {
            action: "GetFeatureOfInterest",
            actionClass: "foiRetrieval",
            parameters: convertObjectToNameValueArray({
                observedProperty: this.observedProperties,
                procedure: this.procedures
            })
        };
        const response = await loadSoapBody(this.catalogItem, this.url, this.requestTemplate, templateContext);
        return response === null || response === void 0 ? void 0 : response.GetFeatureOfInterestResponse;
    }
}
__decorate([
    computed
], GetFeatureOfInterestRequest.prototype, "url", null);
__decorate([
    computed
], GetFeatureOfInterestRequest.prototype, "observedProperties", null);
__decorate([
    computed
], GetFeatureOfInterestRequest.prototype, "procedures", null);
class GetObservationRequest {
    constructor(catalogItem, foiIdentifier) {
        Object.defineProperty(this, "catalogItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: catalogItem
        });
        Object.defineProperty(this, "foiIdentifier", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: foiIdentifier
        });
        makeObservable(this);
    }
    get url() {
        return this.catalogItem.url;
    }
    get requestTemplate() {
        return (this.catalogItem.requestTemplate ||
            SensorObservationServiceCatalogItem.defaultRequestTemplate);
    }
    get parameters() {
        const foiIdentifier = this.catalogItem.chartFeatureOfInterestIdentifier;
        const observableProperty = this.catalogItem.selectedObservable;
        const procedure = this.catalogItem.selectedProcedure;
        if (foiIdentifier === undefined ||
            procedure === undefined ||
            observableProperty === undefined) {
            return;
        }
        return convertObjectToNameValueArray({
            procedure: procedure.identifier,
            observedProperty: observableProperty.identifier,
            featureOfInterest: foiIdentifier
        });
    }
    /**
     * Return the Mustache template context "temporalFilters" for this item.
     * If a "defaultDuration" parameter (eg. 60d or 12h) exists on either
     * procedure or observableProperty, restrict to that duration from item.endDate.
     * @param item This catalog item.
     * @param procedure An element from the item.procedures array.
     * @param observableProperty An element from the item.observableProperties array.
     * @return An array of {index, startDate, endDate}, or undefined.
     */
    get temporalFilters() {
        const observableProperty = this.catalogItem.selectedObservable;
        const procedure = this.catalogItem.selectedProcedure;
        if (procedure === undefined || observableProperty === undefined) {
            return;
        }
        const defaultDuration = procedure.defaultDuration || observableProperty.defaultDuration;
        // If the item has no endDate, use the current datetime (to nearest second).
        const endDateIso8601 = this.catalogItem.endDate || JulianDate.toIso8601(JulianDate.now(), 0);
        if (defaultDuration) {
            let startDateIso8601 = addDurationToIso8601(endDateIso8601, "-" + defaultDuration);
            // This is just a string-based comparison, so timezones could make it up to 1 day wrong.
            // That much error is fine here.
            if (this.catalogItem.startDate &&
                startDateIso8601 < this.catalogItem.startDate) {
                startDateIso8601 = this.catalogItem.startDate;
            }
            return [
                { index: 1, startDate: startDateIso8601, endDate: endDateIso8601 }
            ];
        }
        else {
            // If there is no procedure- or property-specific duration, use the item's start and end dates, if any.
            if (this.catalogItem.startDate) {
                return [
                    {
                        index: 1,
                        startDate: this.catalogItem.startDate,
                        endDate: endDateIso8601
                    }
                ];
            }
        }
    }
    async perform() {
        if (this.url === undefined || this.parameters === undefined) {
            return;
        }
        const templateContext = {
            action: "GetObservation",
            actionClass: "core",
            parameters: this.parameters,
            temporalFilters: this.temporalFilters
        };
        const response = await loadSoapBody(this.catalogItem, this.url, this.requestTemplate, templateContext);
        return response === null || response === void 0 ? void 0 : response.GetObservationResponse;
    }
}
__decorate([
    computed
], GetObservationRequest.prototype, "url", null);
__decorate([
    computed
], GetObservationRequest.prototype, "requestTemplate", null);
__decorate([
    computed
], GetObservationRequest.prototype, "parameters", null);
__decorate([
    computed
], GetObservationRequest.prototype, "temporalFilters", null);
class SensorObservationServiceCatalogItem extends TableMixin(CreateModel(SensorObservationServiceCatalogItemTraits)) {
    constructor(id, terria, sourceReference) {
        super(id, terria, sourceReference);
        makeObservable(this);
        this.strata.set(TableAutomaticStylesStratum.stratumName, new SosAutomaticStylesStratum(this));
    }
    get type() {
        return "sos";
    }
    async forceLoadMetadata() { }
    async forceLoadTableData() {
        if (this.showAsChart === true) {
            return this.loadChartData();
        }
        else {
            return this.loadFeaturesData();
        }
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "0d";
    }
    async loadFeaturesData() {
        const request = new GetFeatureOfInterestRequest(this, this.requestTemplate ||
            SensorObservationServiceCatalogItem.defaultRequestTemplate);
        const response = await request.perform();
        if (response === undefined) {
            return [];
        }
        const itemName = runInAction(() => this.name || "");
        if (response.featureMember === undefined) {
            throw new TerriaError({
                sender: this,
                title: itemName,
                message: i18next.t("models.sensorObservationService.unknownFormat")
            });
        }
        let featureMembers = Array.isArray(response.featureMember)
            ? response.featureMember
            : [response.featureMember];
        const whiteList = runInAction(() => this.stationIdWhitelist);
        if (whiteList) {
            featureMembers = featureMembers.filter((m) => {
                var _a;
                return ((_a = m.MonitoringPoint) === null || _a === void 0 ? void 0 : _a.identifier) &&
                    whiteList.indexOf(String(m.MonitoringPoint.identifier)) >= 0;
            });
        }
        const blackList = runInAction(() => this.stationIdBlacklist);
        if (blackList) {
            featureMembers = featureMembers.filter((m) => m.MonitoringPoint &&
                blackList.indexOf(String(m.MonitoringPoint.identifier)) < 0);
        }
        const identifierCols = ["identifier"];
        const latCols = ["lat"];
        const lonCols = ["lon"];
        const nameCols = ["name"];
        const idCols = ["id"];
        const typeCols = ["type"];
        const chartCols = ["chart"];
        featureMembers.forEach((member) => {
            var _a, _b, _c, _d;
            const pointShape = (_b = (_a = member.MonitoringPoint) === null || _a === void 0 ? void 0 : _a.shape) === null || _b === void 0 ? void 0 : _b.Point;
            if (!pointShape) {
                throw new DeveloperError("Non-point feature not shown. You may want to implement `representAsGeoJson`. " +
                    JSON.stringify(pointShape));
            }
            if (!member.MonitoringPoint)
                return;
            if (!((_c = pointShape.pos) === null || _c === void 0 ? void 0 : _c.split))
                return;
            if (!member.MonitoringPoint.identifier)
                return;
            const [lat, lon] = pointShape.pos.split(" ");
            const identifier = member.MonitoringPoint.identifier;
            const name = member.MonitoringPoint.name;
            const id = member.MonitoringPoint["gml:id"];
            const type = (_d = member.MonitoringPoint.type) === null || _d === void 0 ? void 0 : _d["xlink:href"];
            const chart = createChartColumn(identifier, name);
            identifierCols.push(identifier);
            latCols.push(lat);
            lonCols.push(lon);
            nameCols.push(name || "");
            idCols.push(id || "");
            typeCols.push(type || "");
            chartCols.push(chart);
        });
        return [
            identifierCols,
            latCols,
            lonCols,
            nameCols,
            idCols,
            typeCols,
            chartCols
        ];
    }
    async loadChartData() {
        const foiIdentifier = this.chartFeatureOfInterestIdentifier;
        if (foiIdentifier === undefined) {
            return [];
        }
        const request = new GetObservationRequest(this, foiIdentifier);
        const response = await request.perform();
        if (response === undefined) {
            return [];
        }
        return runInAction(() => {
            const procedure = this.selectedProcedure;
            const observableProperty = this.selectedObservable;
            const datesCol = ["date"];
            const valuesCol = ["values"];
            const observationsCol = ["observations"];
            const identifiersCol = ["identifiers"];
            const proceduresCol = [this.proceduresName];
            const observedPropertiesCol = [this.observablePropertiesName];
            const addObservationToColumns = (observation) => {
                var _a, _b;
                let points = (_b = (_a = observation === null || observation === void 0 ? void 0 : observation.result) === null || _a === void 0 ? void 0 : _a.MeasurementTimeseries) === null || _b === void 0 ? void 0 : _b.point;
                if (!points)
                    return;
                if (!Array.isArray(points))
                    points = [points];
                const measurements = points.map((point) => point.MeasurementTVP); // TVP = Time value pairs, I think.
                const featureIdentifier = observation.featureOfInterest["xlink:href"] || "";
                datesCol.push(...measurements.map((measurement) => typeof measurement.time === "object" ? "" : measurement.time));
                valuesCol.push(...measurements.map((measurement) => typeof measurement.value === "object" ? "" : measurement.value));
                identifiersCol.push(...measurements.map((_) => featureIdentifier));
                proceduresCol.push(...measurements.map((_) => procedure.identifier || ""));
                observedPropertiesCol.push(...measurements.map((_) => observableProperty.identifier || ""));
            };
            const observationData = response.observationData === undefined ||
                Array.isArray(response.observationData)
                ? response.observationData
                : [response.observationData];
            if (!observationData) {
                return [];
            }
            const observations = observationData.map((o) => o.OM_Observation);
            observations.forEach((observation) => {
                if (observation) {
                    addObservationToColumns(observation);
                }
            });
            runInAction(() => {
                // Set title for values column
                const valueColumn = this.addObject(CommonStrata.defaults, "columns", "values");
                valueColumn === null || valueColumn === void 0 ? void 0 : valueColumn.setTrait(CommonStrata.defaults, "name", "values");
                valueColumn === null || valueColumn === void 0 ? void 0 : valueColumn.setTrait(CommonStrata.defaults, "title", this.valueTitle);
            });
            return [
                datesCol,
                valuesCol,
                observationsCol,
                identifiersCol,
                proceduresCol,
                observedPropertiesCol
            ];
        });
    }
    get valueTitle() {
        if (this.selectedObservable === undefined ||
            this.selectedProcedure === undefined) {
            return;
        }
        const units = this.selectedObservable.units || this.selectedProcedure.units;
        const valueTitle = this.selectedObservable.title +
            " " +
            this.selectedProcedure.title +
            (units !== undefined ? " (" + units + ")" : "");
        return valueTitle;
    }
    get selectableDimensions() {
        return filterOutUndefined([
            // Filter out proceduresSelector - as it duplicates TableMixin.styleDimensions
            ...super.selectableDimensions.filter((dim) => { var _a; return dim.id !== ((_a = this.proceduresSelector) === null || _a === void 0 ? void 0 : _a.id); }),
            this.proceduresSelector,
            this.observablesSelector
        ]);
    }
    get proceduresSelector() {
        const proceduresSelector = super.styleDimensions;
        if (proceduresSelector === undefined)
            return;
        const item = this;
        return {
            ...proceduresSelector,
            get name() {
                return item.proceduresName;
            }
        };
    }
    get observablesSelector() {
        if (this.mapItems.length === 0) {
            return;
        }
        const item = this;
        return {
            get id() {
                return "observables";
            },
            get name() {
                return item.observablePropertiesName;
            },
            get options() {
                return filterOutUndefined(item.observableProperties.map((p) => {
                    if (p.identifier && p.title) {
                        return {
                            id: p.identifier,
                            name: p.title || p.identifier
                        };
                    }
                }));
            },
            get selectedId() {
                return item.selectedObservableId;
            },
            setDimensionValue(stratumId, observableId) {
                item.setTrait(stratumId, "selectedObservableId", observableId);
            }
        };
    }
    get selectedObservableId() {
        var _a;
        return (super.selectedObservableId || ((_a = this.observableProperties[0]) === null || _a === void 0 ? void 0 : _a.identifier));
    }
    get selectedObservable() {
        return this.observableProperties.find((p) => p.identifier === this.selectedObservableId);
    }
    get selectedProcedure() {
        return this.procedures.find((p) => p.identifier === this.activeTableStyle.id);
    }
}
Object.defineProperty(SensorObservationServiceCatalogItem, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "sos"
});
Object.defineProperty(SensorObservationServiceCatalogItem, "defaultRequestTemplate", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: require("./SensorObservationServiceRequestTemplate.xml")
});
export default SensorObservationServiceCatalogItem;
__decorate([
    action
], SensorObservationServiceCatalogItem.prototype, "forceLoadTableData", null);
__decorate([
    override
], SensorObservationServiceCatalogItem.prototype, "cacheDuration", null);
__decorate([
    action
], SensorObservationServiceCatalogItem.prototype, "loadFeaturesData", null);
__decorate([
    action
], SensorObservationServiceCatalogItem.prototype, "loadChartData", null);
__decorate([
    computed
], SensorObservationServiceCatalogItem.prototype, "valueTitle", null);
__decorate([
    override
], SensorObservationServiceCatalogItem.prototype, "selectableDimensions", null);
__decorate([
    computed
], SensorObservationServiceCatalogItem.prototype, "proceduresSelector", null);
__decorate([
    computed
], SensorObservationServiceCatalogItem.prototype, "observablesSelector", null);
__decorate([
    override
], SensorObservationServiceCatalogItem.prototype, "selectedObservableId", null);
__decorate([
    computed
], SensorObservationServiceCatalogItem.prototype, "selectedObservable", null);
__decorate([
    computed
], SensorObservationServiceCatalogItem.prototype, "selectedProcedure", null);
function createChartColumn(identifier, name) {
    const nameAttr = name === undefined ? "" : `name="${name}"`;
    // The API that provides the chart data is a SOAP API, and the download button is essentially just a link, so when you click it you get an error page.
    // can-download="false" will disable this broken download button.
    return `<sos-chart identifier="${identifier}" ${nameAttr} can-download="false"></sos-chart>`;
}
async function loadSoapBody(item, url, requestTemplate, templateContext) {
    const requestXml = Mustache.render(requestTemplate, templateContext);
    const responseXml = await loadWithXhr({
        url: proxyCatalogItemUrl(item, url),
        responseType: "document",
        method: "POST",
        overrideMimeType: "text/xml",
        data: requestXml,
        headers: { "Content-Type": "application/soap+xml" }
    });
    if (responseXml === undefined) {
        return;
    }
    const json = xml2json(responseXml);
    if (json.Exception) {
        let errorMessage = i18next.t("models.sensorObservationService.unknownError");
        if (json.Exception.ExceptionText) {
            errorMessage = i18next.t("models.sensorObservationService.exceptionMessage", { exceptionText: json.Exception.ExceptionText });
        }
        throw new TerriaError({
            sender: item,
            title: runInAction(() => item.name || ""),
            message: errorMessage
        });
    }
    if (json.Body === undefined) {
        throw new TerriaError({
            sender: item,
            title: runInAction(() => item.name || ""),
            message: i18next.t("models.sensorObservationService.missingBody")
        });
    }
    return json.Body;
}
/**
 * Adds a period to an iso8601-formatted date.
 * Periods must be (positive or negative) numbers followed by a letter:
 * s (seconds), h (hours), d (days), y (years).
 * To avoid confusion between minutes and months, do not use m.
 * @param  dateIso8601 The date in ISO8601 format.
 * @param  durationString The duration string, in the format described.
 * @return A date string in ISO8601 format.
 */
function addDurationToIso8601(dateIso8601, durationString) {
    const duration = parseFloat(durationString);
    if (isNaN(duration) || duration === 0) {
        throw new DeveloperError("Bad duration " + durationString);
    }
    const scratchJulianDate = new JulianDate();
    let julianDate = JulianDate.fromIso8601(dateIso8601);
    const units = durationString.slice(durationString.length - 1);
    switch (units) {
        case "s":
            julianDate = JulianDate.addSeconds(julianDate, duration, scratchJulianDate);
            break;
        case "h":
            julianDate = JulianDate.addHours(julianDate, duration, scratchJulianDate);
            break;
        case "d":
            // Use addHours on 24 * numdays - on my casual reading of addDays, it needs an integer.
            julianDate = JulianDate.addHours(julianDate, duration * 24, scratchJulianDate);
            break;
        case "y": {
            const days = Math.round(duration * 365);
            julianDate = JulianDate.addDays(julianDate, days, scratchJulianDate);
            break;
        }
        default:
            throw new DeveloperError('Unknown duration type "' + durationString + '" (use s, h, d or y)');
    }
    return JulianDate.toIso8601(julianDate);
}
/**
 * Converts parameters {x: 'y'} into an array of {name: 'x', value: 'y'} objects.
 * Converts {x: [1, 2, ...]} into multiple objects:
 *   {name: 'x', value: 1}, {name: 'x', value: 2}, ...
 * @param parameters eg. {a: 3, b: [6, 8]}
 * @return eg. [{name: 'a', value: 3}, {name: 'b', value: 6}, {name: 'b', value: 8}]
 */
function convertObjectToNameValueArray(parameters) {
    return Object.keys(parameters).reduce((result, key) => {
        let values = parameters[key];
        if (!Array.isArray(values)) {
            values = [values];
        }
        if (values.length === 0)
            return result;
        return result.concat(filterOutUndefined(values.map((value) => {
            return value === undefined
                ? undefined
                : {
                    name: key,
                    value: value
                };
        })));
    }, []);
}
//# sourceMappingURL=SensorObservationServiceCatalogItem.js.map