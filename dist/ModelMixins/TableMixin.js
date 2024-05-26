var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, observable, runInAction, makeObservable, override } from "mobx";
import { createTransformer } from "mobx-utils";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import CustomDataSource from "terriajs-cesium/Source/DataSources/CustomDataSource";
import DataSource from "terriajs-cesium/Source/DataSources/DataSource";
import getChartColorForId from "../Charts/getChartColorForId";
import filterOutUndefined from "../Core/filterOutUndefined";
import flatten from "../Core/flatten";
import isDefined from "../Core/isDefined";
import { isLatLonHeight } from "../Core/LatLonHeight";
import TerriaError from "../Core/TerriaError";
import ConstantColorMap from "../Map/ColorMap/ConstantColorMap";
import RegionProviderList from "../Map/Region/RegionProviderList";
import CommonStrata from "../Models/Definition/CommonStrata";
import updateModelFromJson from "../Models/Definition/updateModelFromJson";
import * as SelectableDimensionWorkflow from "../Models/Workflows/SelectableDimensionWorkflow";
import TableStylingWorkflow from "../Models/Workflows/TableStylingWorkflow";
import Icon from "../Styled/Icon";
import createLongitudeLatitudeFeaturePerId from "../Table/createLongitudeLatitudeFeaturePerId";
import createLongitudeLatitudeFeaturePerRow from "../Table/createLongitudeLatitudeFeaturePerRow";
import createRegionMappedImageryProvider from "../Table/createRegionMappedImageryProvider";
import TableColumn from "../Table/TableColumn";
import TableColumnType from "../Table/TableColumnType";
import { tableFeatureInfoContext } from "../Table/tableFeatureInfoContext";
import TableFeatureInfoStratum from "../Table/TableFeatureInfoStratum";
import { TableAutomaticLegendStratum } from "../Table/TableLegendStratum";
import TableStyle from "../Table/TableStyle";
import CatalogMemberMixin from "./CatalogMemberMixin";
import { calculateDomain } from "./ChartableMixin";
import DiscretelyTimeVaryingMixin from "./DiscretelyTimeVaryingMixin";
import ExportableMixin from "./ExportableMixin";
import MappableMixin from "./MappableMixin";
function TableMixin(Base) {
    class TableMixin extends ExportableMixin(DiscretelyTimeVaryingMixin(MappableMixin(CatalogMemberMixin(Base)))) {
        constructor(...args) {
            super(...args);
            /**
             * The default {@link TableStyle}, which is used for styling
             * only when there are no styles defined.
             */
            Object.defineProperty(this, "defaultTableStyle", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            // Always use the getter and setter for this
            Object.defineProperty(this, "_dataColumnMajor", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            /**
             * The list of region providers to be used with this table.
             */
            Object.defineProperty(this, "regionProviderLists", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "createLongitudeLatitudeDataSource", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: createTransformer((style) => {
                    if (!style.isPoints()) {
                        return undefined;
                    }
                    const dataSource = new CustomDataSource(this.name || "Table");
                    dataSource.entities.suspendEvents();
                    let features;
                    if (style.isTimeVaryingPointsWithId()) {
                        features = createLongitudeLatitudeFeaturePerId(style);
                    }
                    else {
                        features = createLongitudeLatitudeFeaturePerRow(style);
                    }
                    // _catalogItem property is needed for some feature picking functions (eg `featureInfoTemplate`)
                    features.forEach((f) => {
                        f._catalogItem = this;
                        dataSource.entities.add(f);
                    });
                    dataSource.show = this.show;
                    dataSource.entities.resumeEvents();
                    return dataSource;
                })
            });
            Object.defineProperty(this, "createRegionMappedImageryProvider", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: createTransformer((input) => createRegionMappedImageryProvider(input.style, input.currentTime))
            });
            Object.defineProperty(this, "getTableColumn", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: createTransformer((index) => {
                    return new TableColumn(this, index);
                })
            });
            Object.defineProperty(this, "getTableStyle", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: createTransformer((index) => {
                    return new TableStyle(this, index);
                })
            });
            makeObservable(this);
            // Create default TableStyle and set TableAutomaticLegendStratum
            this.defaultTableStyle = new TableStyle(this);
            if (this.strata.get(TableAutomaticLegendStratum.stratumName) === undefined) {
                runInAction(() => {
                    this.strata.set(TableAutomaticLegendStratum.stratumName, TableAutomaticLegendStratum.load(this));
                });
            }
            // Create TableFeatureInfoStratum
            if (this.strata.get(TableFeatureInfoStratum.stratumName) === undefined) {
                runInAction(() => {
                    this.strata.set(TableFeatureInfoStratum.stratumName, TableFeatureInfoStratum.load(this));
                });
            }
        }
        get hasTableMixin() {
            return true;
        }
        /**
         * The raw data table in column-major format, i.e. the outer array is an
         * array of columns.
         */
        get dataColumnMajor() {
            const dataColumnMajor = this._dataColumnMajor;
            if (this.removeDuplicateRows &&
                dataColumnMajor !== undefined &&
                dataColumnMajor.length >= 1) {
                // De-duplication is slow and memory expensive, so should be avoided if possible.
                const rowsToRemove = new Set();
                const seenRows = new Set();
                for (let i = 0; i < dataColumnMajor[0].length; i++) {
                    const row = dataColumnMajor.map((col) => col[i]).join();
                    if (seenRows.has(row)) {
                        // Mark row for deletion
                        rowsToRemove.add(i);
                    }
                    else {
                        seenRows.add(row);
                    }
                }
                if (rowsToRemove.size > 0) {
                    return dataColumnMajor.map((col) => col.filter((cell, idx) => !rowsToRemove.has(idx)));
                }
            }
            return dataColumnMajor;
        }
        set dataColumnMajor(newDataColumnMajor) {
            this._dataColumnMajor = newDataColumnMajor;
        }
        /**
         * Gets a {@link TableColumn} for each of the columns in the raw data.
         */
        get tableColumns() {
            if (this.dataColumnMajor === undefined) {
                return [];
            }
            return this.dataColumnMajor.map((_, i) => this.getTableColumn(i));
        }
        /**
         * Gets a {@link TableStyle} for each of the {@link styles}. If there
         * are no styles, returns an empty array.
         */
        get tableStyles() {
            if (this.styles === undefined) {
                return [];
            }
            return this.styles.map((_, i) => this.getTableStyle(i));
        }
        /**
         * Gets the active {@link TableStyle}, which is the item from {@link #tableStyles}
         * with an ID that matches {@link #activeStyle}, if any.
         */
        get activeTableStyle() {
            const activeStyle = this.activeStyle;
            if (activeStyle === undefined) {
                return this.defaultTableStyle;
            }
            const ret = this.tableStyles.find((style) => style.id === this.activeStyle);
            if (ret === undefined) {
                return this.defaultTableStyle;
            }
            return ret;
        }
        get xColumn() {
            return this.activeTableStyle.xAxisColumn;
        }
        get yColumns() {
            const lines = this.activeTableStyle.chartTraits.lines;
            return filterOutUndefined(lines.map((line) => this.findColumnByName(line.yAxisColumn)));
        }
        get _canExportData() {
            return isDefined(this.dataColumnMajor);
        }
        async _exportData() {
            if (isDefined(this.dataColumnMajor)) {
                // I am assuming all columns have the same length -> so use first column
                const csvString = this.dataColumnMajor[0]
                    .map((row, rowIndex) => this.dataColumnMajor.map((col) => col[rowIndex]).join(","))
                    .join("\n");
                // Make sure we have .csv file extension
                let name = this.name || this.uniqueId || "data.csv";
                if (!/(\.csv\b)/i.test(name)) {
                    name = `${name}.csv`;
                }
                return {
                    name: (this.name || this.uniqueId),
                    file: new Blob([csvString])
                };
            }
            throw new TerriaError({
                sender: this,
                message: "No data available to download."
            });
        }
        get name() {
            return super.name;
        }
        get disableZoomTo() {
            // Disable zoom if only showing imagery parts  (eg region mapping) and no rectangle is defined
            if (!this.mapItems.find((m) => m instanceof DataSource || m instanceof CustomDataSource) &&
                !isDefined(this.cesiumRectangle)) {
                return true;
            }
            return super.disableZoomTo;
        }
        /** Is showing regions (instead of points) */
        get showingRegions() {
            return (this.regionMappedImageryParts &&
                this.mapItems[0] === this.regionMappedImageryParts);
        }
        /**
         * Gets the items to show on the map.
         */
        get mapItems() {
            var _a, _b, _c, _d, _e;
            // Wait for activeTableStyle to be ready
            if (((_a = this.dataColumnMajor) === null || _a === void 0 ? void 0 : _a.length) === 0 ||
                !this.activeTableStyle.ready ||
                this.isLoadingMapItems)
                return [];
            const numRegions = (_e = (_d = (_c = (_b = this.activeTableStyle.regionColumn) === null || _b === void 0 ? void 0 : _b.valuesAsRegions) === null || _c === void 0 ? void 0 : _c.uniqueRegionIds) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0;
            // Estimate number of points based off number of rowGroups
            const numPoints = this.activeTableStyle.isPoints()
                ? this.activeTableStyle.rowGroups.length
                : 0;
            // If we have more points than regions OR we have points are are using a ConstantColorMap - show points instead of regions
            // (Using ConstantColorMap with regions will result in all regions being the same color - which isn't useful)
            if ((numPoints > 0 &&
                this.activeTableStyle.colorMap instanceof ConstantColorMap) ||
                numPoints > numRegions) {
                const pointsDataSource = this.createLongitudeLatitudeDataSource(this.activeTableStyle);
                // Make sure there are actually more points than regions
                if (pointsDataSource &&
                    pointsDataSource.entities.values.length > numRegions)
                    return [pointsDataSource];
            }
            if (this.regionMappedImageryParts)
                return [this.regionMappedImageryParts];
            return [];
        }
        // regionMappedImageryParts and regionMappedImageryProvider are split up like this so that we aren't re-creating the imageryProvider if things like `opacity` and `show` change
        get regionMappedImageryParts() {
            if (!this.regionMappedImageryProvider)
                return;
            return {
                imageryProvider: this.regionMappedImageryProvider,
                alpha: this.opacity,
                show: this.show,
                clippingRectangle: this.cesiumRectangle
            };
        }
        get regionMappedImageryProvider() {
            return this.createRegionMappedImageryProvider({
                style: this.activeTableStyle,
                currentTime: this.currentDiscreteJulianDate
            });
        }
        /**
         * Try to resolve `regionType` to a region provider (this will also match against region provider aliases)
         */
        matchRegionProvider(regionType) {
            var _a, _b;
            if (!isDefined(regionType))
                return;
            const matchingRegionProviders = (_a = this.regionProviderLists) === null || _a === void 0 ? void 0 : _a.map((regionProviderList) => regionProviderList === null || regionProviderList === void 0 ? void 0 : regionProviderList.getRegionDetails([regionType], undefined, undefined));
            // Return first regionProviderList with it's first match
            // Note: a regionProviderList may have multiple matches - we could improve which one it selects
            return (_b = matchingRegionProviders === null || matchingRegionProviders === void 0 ? void 0 : matchingRegionProviders.find((match) => match && match.length > 0)) === null || _b === void 0 ? void 0 : _b[0].regionProvider;
        }
        /**
         * Gets the items to show on a chart.
         *
         */
        get tableChartItems() {
            const style = this.activeTableStyle;
            if (style === undefined || !style.isChart()) {
                return [];
            }
            const xColumn = style.xAxisColumn;
            const lines = style.chartTraits.lines;
            if (xColumn === undefined || lines.length === 0) {
                return [];
            }
            const xValues = xColumn.type === TableColumnType.time
                ? xColumn.valuesAsDates.values
                : xColumn.valuesAsNumbers.values;
            const xAxis = {
                scale: xColumn.type === TableColumnType.time ? "time" : "linear",
                units: xColumn.units
            };
            return filterOutUndefined(lines.map((line) => {
                var _a, _b, _c;
                const yColumn = this.findColumnByName(line.yAxisColumn);
                if (yColumn === undefined) {
                    return undefined;
                }
                const yValues = yColumn.valuesAsNumbers.values;
                const points = [];
                for (let i = 0; i < xValues.length; ++i) {
                    const x = xValues[i];
                    const y = yValues[i];
                    if (x === null || y === null) {
                        continue;
                    }
                    points.push({ x, y });
                }
                if (points.length <= 1)
                    return;
                const colorId = `color-${this.uniqueId}-${this.name}-${yColumn.name}`;
                return {
                    item: this,
                    name: (_a = line.name) !== null && _a !== void 0 ? _a : yColumn.title,
                    categoryName: this.name,
                    key: `key${this.uniqueId}-${this.name}-${yColumn.name}`,
                    type: (_b = this.chartType) !== null && _b !== void 0 ? _b : "line",
                    glyphStyle: (_c = this.chartGlyphStyle) !== null && _c !== void 0 ? _c : "circle",
                    xAxis,
                    points,
                    domain: calculateDomain(points),
                    units: yColumn.units,
                    isSelectedInWorkbench: line.isSelectedInWorkbench,
                    showInChartPanel: this.show && line.isSelectedInWorkbench,
                    updateIsSelectedInWorkbench: (isSelected) => {
                        runInAction(() => {
                            line.setTrait(CommonStrata.user, "isSelectedInWorkbench", isSelected);
                        });
                    },
                    getColor: () => {
                        return line.color || getChartColorForId(colorId);
                    },
                    pointOnMap: isLatLonHeight(this.chartPointOnMap)
                        ? this.chartPointOnMap
                        : undefined
                };
            }));
        }
        get chartItems() {
            var _a;
            // Wait for activeTableStyle to be ready
            if (!this.activeTableStyle.ready || this.isLoadingMapItems)
                return [];
            return filterOutUndefined([
                // If time-series region mapping - show time points chart
                this.activeTableStyle.isRegions() && ((_a = this.discreteTimes) === null || _a === void 0 ? void 0 : _a.length)
                    ? this.momentChart
                    : undefined,
                ...this.tableChartItems
            ]);
        }
        get viewingControls() {
            return filterOutUndefined([
                ...super.viewingControls,
                {
                    id: TableStylingWorkflow.type,
                    name: i18next.t("models.tableData.editStyle"),
                    onClick: action((viewState) => SelectableDimensionWorkflow.runWorkflow(viewState, new TableStylingWorkflow(this))),
                    icon: { glyph: Icon.GLYPHS.layers }
                }
            ]);
        }
        get featureInfoContext() {
            return tableFeatureInfoContext(this);
        }
        get selectableDimensions() {
            return filterOutUndefined([
                this.timeDisableDimension,
                ...super.selectableDimensions,
                this.enableManualRegionMapping
                    ? this.regionMappingDimensions
                    : undefined,
                this.styleDimensions,
                this.outlierFilterDimension
            ]);
        }
        /**
         * Takes {@link TableStyle}s and returns a SelectableDimension which can be rendered in a Select dropdown
         */
        get styleDimensions() {
            if (this.mapItems.length === 0 && !this.enableManualRegionMapping) {
                return;
            }
            return {
                type: "select",
                id: "activeStyle",
                name: i18next.t("models.tableData.activeStyle"),
                options: this.tableStyles
                    .filter((style) => !style.hidden || this.activeStyle === style.id)
                    .map((style) => {
                    return {
                        id: style.id,
                        name: style.title
                    };
                }),
                selectedId: this.activeStyle,
                allowUndefined: this.showDisableStyleOption,
                undefinedLabel: this.showDisableStyleOption
                    ? i18next.t("models.tableData.styleDisabledLabel")
                    : undefined,
                setDimensionValue: (stratumId, styleId) => {
                    this.setTrait(stratumId, "activeStyle", styleId);
                }
            };
        }
        /**
         * Creates SelectableDimension for regionProviderList - the list of all available region providers.
         * {@link TableTraits#enableManualRegionMapping} must be enabled.
         */
        get regionProviderDimensions() {
            var _a, _b, _c, _d;
            const allRegionProviders = flatten((_b = (_a = this.regionProviderLists) === null || _a === void 0 ? void 0 : _a.map((list) => list.regionProviders)) !== null && _b !== void 0 ? _b : []);
            if (allRegionProviders.length === 0 ||
                !isDefined(this.activeTableStyle.regionColumn)) {
                return;
            }
            return {
                id: "regionMapping",
                name: i18next.t("models.tableData.regionMapping"),
                options: allRegionProviders.map((regionProvider) => {
                    return {
                        name: regionProvider.description,
                        id: regionProvider.regionType
                    };
                }),
                allowUndefined: true,
                selectedId: (_d = (_c = this.activeTableStyle.regionColumn) === null || _c === void 0 ? void 0 : _c.regionType) === null || _d === void 0 ? void 0 : _d.regionType,
                setDimensionValue: (stratumId, regionType) => {
                    var _a;
                    let columnTraits = (_a = this.columns) === null || _a === void 0 ? void 0 : _a.find((column) => { var _a; return column.name === ((_a = this.activeTableStyle.regionColumn) === null || _a === void 0 ? void 0 : _a.name); });
                    if (!isDefined(columnTraits)) {
                        columnTraits = this.addObject(stratumId, "columns", this.activeTableStyle.regionColumn.name);
                        columnTraits.setTrait(stratumId, "name", this.activeTableStyle.regionColumn.name);
                    }
                    columnTraits.setTrait(stratumId, "regionType", regionType);
                }
            };
        }
        /**
         * Creates SelectableDimension for region column - the options contains a list of all columns.
         * {@link TableTraits#enableManualRegionMapping} must be enabled.
         */
        get regionColumnDimensions() {
            var _a;
            if (!isDefined(this.regionProviderLists)) {
                return;
            }
            return {
                id: "regionColumn",
                name: i18next.t("models.tableData.regionColumn"),
                options: this.tableColumns.map((col) => {
                    return {
                        name: col.name,
                        id: col.name
                    };
                }),
                selectedId: (_a = this.activeTableStyle.regionColumn) === null || _a === void 0 ? void 0 : _a.name,
                setDimensionValue: (stratumId, regionCol) => {
                    this.defaultStyle.setTrait(stratumId, "regionColumn", regionCol);
                }
            };
        }
        get regionMappingDimensions() {
            return {
                id: "manual-region-mapping",
                name: i18next.t("models.tableData.manualRegionMapping"),
                type: "group",
                selectableDimensions: filterOutUndefined([
                    this.regionColumnDimensions,
                    this.regionProviderDimensions
                ])
            };
        }
        /**
         * Creates SelectableDimension for region column - the options contains a list of all columns.
         * {@link TableColorStyleTraits#zScoreFilter} must be enabled and {@link TableColorMap#zScoreFilterValues} must detect extreme (outlier) values
         */
        get outlierFilterDimension() {
            if (!this.activeTableStyle.colorTraits.zScoreFilter ||
                !this.activeTableStyle.tableColorMap.zScoreFilterValues) {
                return;
            }
            return {
                id: "outlierFilter",
                options: [
                    { id: "true", name: i18next.t("models.tableData.zFilterEnabled") },
                    { id: "false", name: i18next.t("models.tableData.zFilterDisabled") }
                ],
                selectedId: this.activeTableStyle.colorTraits.zScoreFilterEnabled
                    ? "true"
                    : "false",
                setDimensionValue: (stratumId, value) => {
                    updateModelFromJson(this, stratumId, {
                        defaultStyle: {
                            color: { zScoreFilterEnabled: value === "true" }
                        }
                    }).logError("Failed to update zScoreFilterEnabled");
                },
                placement: "belowLegend",
                type: "checkbox"
            };
        }
        /**
         * Creates SelectableDimension to disable time - this will show if each rowGroup only has a single time
         */
        get timeDisableDimension() {
            // Return nothing if no active time column and if the active time column has been explicitly hidden (using this.defaultStyle.time.timeColumn = null)
            // or if time column doesn't have at least one interval
            if (this.mapItems.length === 0 || !this.showDisableTimeOption)
                return;
            return {
                id: "disableTime",
                options: [
                    {
                        id: "true",
                        name: i18next.t("models.tableData.timeDimensionEnabled")
                    },
                    {
                        id: "false",
                        name: i18next.t("models.tableData.timeDimensionDisabled")
                    }
                ],
                selectedId: this.defaultStyle.time.timeColumn === null ? "false" : "true",
                setDimensionValue: (stratumId, value) => {
                    // We have to set showDisableTimeOption to true - or this will hide when time column is disabled
                    this.setTrait(stratumId, "showDisableTimeOption", true);
                    this.defaultStyle.time.setTrait(stratumId, "timeColumn", value === "true" ? undefined : null);
                },
                type: "checkbox"
            };
        }
        get rowIds() {
            var _a, _b;
            const nRows = (((_b = (_a = this.dataColumnMajor) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.length) || 1) - 1;
            const ids = [...new Array(nRows).keys()];
            return ids;
        }
        get isSampled() {
            return this.activeTableStyle.isSampled;
        }
        get discreteTimes() {
            var _a;
            if (!this.activeTableStyle.moreThanOneTimeInterval)
                return;
            const dates = (_a = this.activeTableStyle.timeColumn) === null || _a === void 0 ? void 0 : _a.valuesAsDates.values;
            if (dates === undefined) {
                return;
            }
            // is it correct for discrete times to remove duplicates?
            // see discussion on https://github.com/TerriaJS/terriajs/pull/4577
            // duplicates will mess up the indexing problem as our `<DateTimePicker />`
            // will eliminate duplicates on the UI front, so given the datepicker
            // expects uniques, return uniques here
            const times = new Set();
            for (let i = 0; i < dates.length; i++) {
                const d = dates[i];
                if (d) {
                    times.add(d.toISOString());
                }
            }
            return Array.from(times).map((time) => ({ time, tag: undefined }));
        }
        /** This is a temporary button which shows in the Legend in the Workbench, if custom styling has been applied. */
        get legendButton() {
            return this.activeTableStyle.isCustom
                ? {
                    title: i18next.t("models.tableData.custom"),
                    onClick: action(() => {
                        SelectableDimensionWorkflow.runWorkflow(this.terria, new TableStylingWorkflow(this));
                    })
                }
                : undefined;
        }
        findFirstColumnByType(type) {
            return this.tableColumns.find((column) => column.type === type);
        }
        findColumnByName(name) {
            return isDefined(name)
                ? this.tableColumns.find((column) => column.name === name)
                : undefined;
        }
        async forceLoadMapItems() {
            var _a;
            try {
                const dataColumnMajor = await this.forceLoadTableData();
                // We need to make sure the region provider is loaded before loading
                // region mapped tables.
                await this.loadRegionProviderList();
                if (dataColumnMajor !== undefined && dataColumnMajor !== null) {
                    runInAction(() => {
                        this.dataColumnMajor = dataColumnMajor;
                    });
                }
                // Load region IDS if region mapping
                const activeRegionType = (_a = this.activeTableStyle.regionColumn) === null || _a === void 0 ? void 0 : _a.regionType;
                if (activeRegionType) {
                    await activeRegionType.loadRegionIDs();
                }
            }
            catch (e) {
                // Clear data if error occurs
                runInAction(() => {
                    this.dataColumnMajor = undefined;
                });
                throw e;
            }
        }
        /** Load all region provider lists
         * These are loaded from terria.configParameters.regionMappingDefinitionsUrl
         */
        async loadRegionProviderList() {
            if (isDefined(this.regionProviderLists))
                return;
            // regionMappingDefinitionsUrl is deprecated - but we use it instead of regionMappingDefinitionsUrls if defined
            const urls = isDefined(this.terria.configParameters.regionMappingDefinitionsUrl)
                ? [this.terria.configParameters.regionMappingDefinitionsUrl]
                : this.terria.configParameters.regionMappingDefinitionsUrls;
            // Load all region in parallel (but preserve order)
            const regionProviderLists = await Promise.all(urls.map(async (url, i) => 
            // Note can be called many times - all promises/results are cached in RegionProviderList.metaList
            await RegionProviderList.fromUrl(url, this.terria.corsProxy)));
            runInAction(() => (this.regionProviderLists = regionProviderLists));
        }
        /*
         * Appends new table data in column major format to this table.
         * It is assumed that the column order is the same for both the tables.
         */
        append(dataColumnMajor2) {
            if (this.dataColumnMajor !== undefined &&
                this.dataColumnMajor.length !== dataColumnMajor2.length) {
                throw new DeveloperError("Cannot add tables with different numbers of columns.");
            }
            const appended = this.dataColumnMajor || [];
            dataColumnMajor2.forEach((newRows, col) => {
                if (appended[col] === undefined) {
                    appended[col] = [];
                }
                appended[col].push(...newRows);
            });
            this.dataColumnMajor = appended;
        }
    }
    __decorate([
        observable
    ], TableMixin.prototype, "_dataColumnMajor", void 0);
    __decorate([
        observable
    ], TableMixin.prototype, "regionProviderLists", void 0);
    __decorate([
        computed
    ], TableMixin.prototype, "dataColumnMajor", null);
    __decorate([
        computed
    ], TableMixin.prototype, "tableColumns", null);
    __decorate([
        computed
    ], TableMixin.prototype, "tableStyles", null);
    __decorate([
        computed
    ], TableMixin.prototype, "activeTableStyle", null);
    __decorate([
        computed
    ], TableMixin.prototype, "xColumn", null);
    __decorate([
        computed
    ], TableMixin.prototype, "yColumns", null);
    __decorate([
        computed
    ], TableMixin.prototype, "_canExportData", null);
    __decorate([
        override
    ], TableMixin.prototype, "name", null);
    __decorate([
        override
    ], TableMixin.prototype, "disableZoomTo", null);
    __decorate([
        computed
    ], TableMixin.prototype, "showingRegions", null);
    __decorate([
        computed
    ], TableMixin.prototype, "mapItems", null);
    __decorate([
        computed
    ], TableMixin.prototype, "regionMappedImageryParts", null);
    __decorate([
        computed
    ], TableMixin.prototype, "regionMappedImageryProvider", null);
    __decorate([
        computed
    ], TableMixin.prototype, "tableChartItems", null);
    __decorate([
        override
    ], TableMixin.prototype, "chartItems", null);
    __decorate([
        override
    ], TableMixin.prototype, "viewingControls", null);
    __decorate([
        computed
    ], TableMixin.prototype, "featureInfoContext", null);
    __decorate([
        override
    ], TableMixin.prototype, "selectableDimensions", null);
    __decorate([
        computed
    ], TableMixin.prototype, "styleDimensions", null);
    __decorate([
        computed
    ], TableMixin.prototype, "regionProviderDimensions", null);
    __decorate([
        computed
    ], TableMixin.prototype, "regionColumnDimensions", null);
    __decorate([
        computed
    ], TableMixin.prototype, "regionMappingDimensions", null);
    __decorate([
        computed
    ], TableMixin.prototype, "outlierFilterDimension", null);
    __decorate([
        computed
    ], TableMixin.prototype, "timeDisableDimension", null);
    __decorate([
        computed
    ], TableMixin.prototype, "rowIds", null);
    __decorate([
        computed
    ], TableMixin.prototype, "isSampled", null);
    __decorate([
        computed
    ], TableMixin.prototype, "discreteTimes", null);
    __decorate([
        computed
    ], TableMixin.prototype, "legendButton", null);
    __decorate([
        action
    ], TableMixin.prototype, "append", null);
    return TableMixin;
}
(function (TableMixin) {
    function isMixedInto(model) {
        return model && model.hasTableMixin;
    }
    TableMixin.isMixedInto = isMixedInto;
})(TableMixin || (TableMixin = {}));
export default TableMixin;
//# sourceMappingURL=TableMixin.js.map