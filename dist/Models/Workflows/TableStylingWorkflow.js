var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable, ObservableMap, reaction, runInAction, makeObservable } from "mobx";
import filterOutUndefined from "../../Core/filterOutUndefined";
import isDefined from "../../Core/isDefined";
import TerriaError from "../../Core/TerriaError";
import ConstantColorMap from "../../Map/ColorMap/ConstantColorMap";
import ContinuousColorMap from "../../Map/ColorMap/ContinuousColorMap";
import DiscreteColorMap from "../../Map/ColorMap/DiscreteColorMap";
import EnumColorMap from "../../Map/ColorMap/EnumColorMap";
import { allIcons, getMakiIcon } from "../../Map/Icons/Maki/MakiIcons";
import { getName } from "../../ModelMixins/CatalogMemberMixin";
import { isDataSource } from "../../ModelMixins/MappableMixin";
import TableMixin from "../../ModelMixins/TableMixin";
import { QualitativeColorSchemeOptionRenderer, QuantitativeColorSchemeOptionRenderer } from "../../ReactViews/SelectableDimensions/ColorSchemeOptionRenderer";
import { MarkerOptionRenderer } from "../../ReactViews/SelectableDimensions/MarkerOptionRenderer";
import Icon from "../../Styled/Icon";
import { DEFAULT_DIVERGING, DEFAULT_QUALITATIVE, DEFAULT_SEQUENTIAL, DIVERGING_SCALES, QUALITATIVE_SCALES, SEQUENTIAL_CONTINUOUS_SCALES, SEQUENTIAL_SCALES } from "../../Table/TableColorMap";
import TableColumnType from "../../Table/TableColumnType";
import CommonStrata from "../Definition/CommonStrata";
import updateModelFromJson from "../Definition/updateModelFromJson";
import ViewingControls from "../ViewingControls";
import i18next from "i18next";
/** Columns/Styles with the following TableColumnTypes will be hidden unless we are showing "advanced" options */
export const ADVANCED_TABLE_COLUMN_TYPES = [
    TableColumnType.latitude,
    TableColumnType.longitude,
    TableColumnType.region,
    TableColumnType.time
];
/** SelectableDimensionWorkflow to set styling options for TableMixin models */
class TableStylingWorkflow {
    constructor(item) {
        Object.defineProperty(this, "item", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: item
        });
        /** This is used to simplify SelectableDimensions available to the user.
         * For example - if equal to `diverging-continuous` - then only Diverging continuous color scales will be presented as options
         * See setColorSchemeTypeFromPalette and setColorSchemeType for how this is set. */
        Object.defineProperty(this, "colorSchemeType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "styleType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "fill"
        });
        /** Which bin is currently open in `binMaximumsSelectableDims` or `enumColorsSelectableDim`.
         * This is used in `SelectableDimensionGroup.onToggle` and `SelectableDimensionGroup.isOpen` to make the groups act like an accordion - so only one bin can be edited at any given time.
         */
        Object.defineProperty(this, "openBinIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ObservableMap()
        });
        Object.defineProperty(this, "activeStyleDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Show advances options
         * - Show all column types in "Data" select
         * - Show "Data type (advanced)" select. This allow user to change column type */
        Object.defineProperty(this, "showAdvancedOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        makeObservable(this);
        // We need to reset colorSchemeType every time Table.activeStyle changes
        this.activeStyleDisposer = reaction(() => this.item.activeStyle, () => {
            // If the active style is of "advanced" TableColumnType, then set colorSchemeType to "no-style"
            if (isDefined(this.item.activeTableStyle.colorColumn) &&
                ADVANCED_TABLE_COLUMN_TYPES.includes(this.item.activeTableStyle.colorColumn.type)) {
                runInAction(() => (this.colorSchemeType = "no-style"));
            }
            else {
                this.setColorSchemeTypeFromPalette();
            }
        });
        this.setColorSchemeTypeFromPalette();
    }
    onClose() {
        this.activeStyleDisposer();
    }
    get menu() {
        return {
            options: filterOutUndefined([
                {
                    text: this.showAdvancedOptions
                        ? i18next.t("models.tableStyling.hideAdvancedOptions")
                        : i18next.t("models.tableStyling.showAdvancedOptions"),
                    onSelect: action(() => {
                        this.showAdvancedOptions = !this.showAdvancedOptions;
                    })
                },
                this.showAdvancedOptions
                    ? {
                        text: i18next.t("models.tableStyling.copyUserStratum"),
                        onSelect: () => {
                            const stratum = JSON.stringify(this.item.strata.get(CommonStrata.user));
                            try {
                                navigator.clipboard.writeText(JSON.stringify(this.item.strata.get(CommonStrata.user)));
                            }
                            catch (e) {
                                TerriaError.from(e).raiseError(this.item.terria, "Failed to copy to clipboard. User stratum has been printed to console");
                                console.log(stratum);
                            }
                        },
                        disable: !this.showAdvancedOptions
                    }
                    : undefined
            ])
        };
    }
    get name() {
        return i18next.t("models.tableStyling.name");
    }
    get icon() {
        return Icon.GLYPHS.layers;
    }
    get footer() {
        return {
            buttonText: i18next.t("models.tableStyling.reset"),
            /** Delete all user strata values for TableColumnTraits and TableStyleTraits for the current activeStyle */
            onClick: action(() => {
                var _a, _b;
                (_a = this.getTableColumnTraits(CommonStrata.user)) === null || _a === void 0 ? void 0 : _a.strata.delete(CommonStrata.user);
                (_b = this.getTableStyleTraits(CommonStrata.user)) === null || _b === void 0 ? void 0 : _b.strata.delete(CommonStrata.user);
                this.setColorSchemeTypeFromPalette();
            })
        };
    }
    /** This will look at the current `colorMap` and `colorPalette` to guess which `colorSchemeType` is active.
     * This is because `TableMixin` doesn't have an explicit `"colorSchemeType"` flag - it will choose the appropriate type based on `TableStyleTraits`
     * `colorTraits.colorPalette` is also set here if we are only using `tableColorMap.defaultColorPaletteName`
     */
    setColorSchemeTypeFromPalette() {
        var _a, _b, _c, _d, _e;
        const colorMap = this.tableStyle.colorMap;
        const colorPalette = this.tableStyle.colorTraits.colorPalette;
        const defaultColorPalette = this.tableStyle.tableColorMap.defaultColorPaletteName;
        const colorPaletteWithDefault = colorPalette !== null && colorPalette !== void 0 ? colorPalette : defaultColorPalette;
        this.colorSchemeType = undefined;
        if (colorMap instanceof ConstantColorMap) {
            this.colorSchemeType = "no-style";
        }
        else if (colorMap instanceof ContinuousColorMap) {
            if (SEQUENTIAL_SCALES.includes(colorPaletteWithDefault) ||
                SEQUENTIAL_CONTINUOUS_SCALES.includes(colorPaletteWithDefault)) {
                this.colorSchemeType = "sequential-continuous";
                if (!colorPalette) {
                    (_a = this.getTableStyleTraits(CommonStrata.user)) === null || _a === void 0 ? void 0 : _a.color.setTrait(CommonStrata.user, "colorPalette", DEFAULT_SEQUENTIAL);
                }
            }
            else if (DIVERGING_SCALES.includes(colorPaletteWithDefault)) {
                this.colorSchemeType = "diverging-continuous";
                if (!colorPalette) {
                    (_b = this.getTableStyleTraits(CommonStrata.user)) === null || _b === void 0 ? void 0 : _b.color.setTrait(CommonStrata.user, "colorPalette", DEFAULT_DIVERGING);
                }
            }
        }
        else if (colorMap instanceof DiscreteColorMap) {
            if (this.tableStyle.colorTraits.binColors &&
                this.tableStyle.colorTraits.binColors.length > 0) {
                this.colorSchemeType = "custom-discrete";
            }
            else if (SEQUENTIAL_SCALES.includes(colorPaletteWithDefault)) {
                this.colorSchemeType = "sequential-discrete";
                if (!colorPalette) {
                    (_c = this.getTableStyleTraits(CommonStrata.user)) === null || _c === void 0 ? void 0 : _c.color.setTrait(CommonStrata.user, "colorPalette", DEFAULT_SEQUENTIAL);
                }
            }
            else if (DIVERGING_SCALES.includes(colorPaletteWithDefault)) {
                this.colorSchemeType = "diverging-discrete";
                if (!colorPalette) {
                    (_d = this.getTableStyleTraits(CommonStrata.user)) === null || _d === void 0 ? void 0 : _d.color.setTrait(CommonStrata.user, "colorPalette", DEFAULT_DIVERGING);
                }
            }
        }
        else if (colorMap instanceof EnumColorMap &&
            QUALITATIVE_SCALES.includes(colorPaletteWithDefault)) {
            if (this.tableStyle.colorTraits.enumColors &&
                this.tableStyle.colorTraits.enumColors.length > 0) {
                this.colorSchemeType = "custom-qualitative";
            }
            else {
                this.colorSchemeType = "qualitative";
                if (!colorPalette) {
                    (_e = this.getTableStyleTraits(CommonStrata.user)) === null || _e === void 0 ? void 0 : _e.color.setTrait(CommonStrata.user, "colorPalette", DEFAULT_QUALITATIVE);
                }
            }
        }
    }
    /** Handle change on colorType - this is called by the "Type" selectable dimension in `this.colorSchemeSelectableDim` */
    setColorSchemeType(stratumId, id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        if (!id)
            return;
        // Set `activeStyle` trait so the value doesn't change
        this.item.setTrait(stratumId, "activeStyle", this.tableStyle.id);
        // Hide any open bin
        this.openBinIndex.clear();
        // Here we use item.activeTableStyle.colorTraits.colorPalette instead of this.colorPalette because we only want this to be defined, if the trait is defined - we don't care about defaultColorPaletteName
        const colorPalette = this.tableStyle.colorTraits.colorPalette;
        // **Discrete color maps**
        // Reset bins
        if (id === "sequential-discrete" || id === "diverging-discrete") {
            this.colorSchemeType = id;
            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "mapType", "bin");
            (_b = this.getTableStyleTraits(stratumId)) === null || _b === void 0 ? void 0 : _b.color.setTrait(stratumId, "binColors", []);
            // Set numberOfBins according to limits of sequential and diverging color scales:
            // - Sequential is [3,9]
            // - Diverging is [3,11]
            // If numberOfBins is 0 - set to sensible default (7)
            if (this.tableStyle.colorTraits.numberOfBins === 0) {
                (_c = this.getTableStyleTraits(stratumId)) === null || _c === void 0 ? void 0 : _c.color.setTrait(stratumId, "numberOfBins", 7);
            }
            else if (id === "sequential-discrete" &&
                this.tableStyle.tableColorMap.binColors.length > 9) {
                (_d = this.getTableStyleTraits(stratumId)) === null || _d === void 0 ? void 0 : _d.color.setTrait(stratumId, "numberOfBins", 9);
            }
            else if (id === "diverging-discrete" &&
                this.tableStyle.tableColorMap.binColors.length > 11) {
                (_e = this.getTableStyleTraits(stratumId)) === null || _e === void 0 ? void 0 : _e.color.setTrait(stratumId, "numberOfBins", 11);
            }
            else if (this.tableStyle.tableColorMap.binColors.length < 3) {
                (_f = this.getTableStyleTraits(stratumId)) === null || _f === void 0 ? void 0 : _f.color.setTrait(stratumId, "numberOfBins", 3);
            }
            // If no user stratum - reset bin maximums
            if (!((_g = this.tableStyle.colorTraits.strata.get(stratumId)) === null || _g === void 0 ? void 0 : _g.binMaximums)) {
                this.resetBinMaximums(stratumId);
            }
        }
        // **Continuous color maps**
        else if (id === "sequential-continuous" || id === "diverging-continuous") {
            this.colorSchemeType = id;
            (_h = this.getTableStyleTraits(stratumId)) === null || _h === void 0 ? void 0 : _h.color.setTrait(stratumId, "mapType", "continuous");
        }
        // **Qualitative (enum) color maps**
        else if (id === "qualitative") {
            this.colorSchemeType = id;
            (_j = this.getTableStyleTraits(stratumId)) === null || _j === void 0 ? void 0 : _j.color.setTrait(stratumId, "mapType", "enum");
            (_k = this.getTableStyleTraits(stratumId)) === null || _k === void 0 ? void 0 : _k.color.setTrait(stratumId, "enumColors", []);
        }
        // **No style (constant) color maps**
        else if (id === "no-style") {
            this.colorSchemeType = id;
            (_l = this.getTableStyleTraits(stratumId)) === null || _l === void 0 ? void 0 : _l.color.setTrait(stratumId, "mapType", "constant");
        }
        // If the current colorPalette is incompatible with the selected type - change colorPalette to default for the selected type
        if (id === "sequential-continuous" &&
            (!colorPalette ||
                ![...SEQUENTIAL_SCALES, ...SEQUENTIAL_CONTINUOUS_SCALES].includes(colorPalette))) {
            (_m = this.getTableStyleTraits(stratumId)) === null || _m === void 0 ? void 0 : _m.color.setTrait(stratumId, "colorPalette", DEFAULT_SEQUENTIAL);
        }
        if (id === "sequential-discrete" &&
            (!colorPalette || !SEQUENTIAL_SCALES.includes(colorPalette))) {
            (_o = this.getTableStyleTraits(stratumId)) === null || _o === void 0 ? void 0 : _o.color.setTrait(stratumId, "colorPalette", DEFAULT_SEQUENTIAL);
        }
        if ((id === "diverging-continuous" || id === "diverging-discrete") &&
            (!colorPalette || !DIVERGING_SCALES.includes(colorPalette))) {
            (_p = this.getTableStyleTraits(stratumId)) === null || _p === void 0 ? void 0 : _p.color.setTrait(stratumId, "colorPalette", DEFAULT_DIVERGING);
        }
        if (id === "qualitative" &&
            (!colorPalette || !QUALITATIVE_SCALES.includes(colorPalette))) {
            (_q = this.getTableStyleTraits(stratumId)) === null || _q === void 0 ? void 0 : _q.color.setTrait(stratumId, "colorPalette", DEFAULT_QUALITATIVE);
        }
    }
    /** Table Style dimensions:
     * - Dataset (Table models in workbench)
     * - Variable (Table style in model)
     * - TableColumn type (advanced only)
     */
    get tableStyleSelectableDim() {
        // Show point style options if current catalog item has any points showing
        const showPointStyles = !!this.item.mapItems.find((d) => isDataSource(d) && d.entities.values.length > 0);
        // Show point size options if current catalog item has points and any scalar columns
        const showPointSize = showPointStyles &&
            (this.tableStyle.pointSizeColumn ||
                this.item.tableColumns.find((t) => t.type === TableColumnType.scalar));
        // Show label style options if current catalog item has points
        const showLabelStyles = showPointStyles;
        // Show trail style options if current catalog item has time-series points
        const showTrailStyles = showPointStyles && this.tableStyle.isTimeVaryingPointsWithId();
        return {
            type: "group",
            id: "data",
            name: i18next.t("models.tableStyling.data.name"),
            selectableDimensions: filterOutUndefined([
                {
                    type: "select",
                    id: "dataset",
                    name: i18next.t("models.tableStyling.data.selectableDimensions.dataset.name"),
                    selectedId: this.item.uniqueId,
                    // Find all workbench items which have TableStylingWorkflow
                    options: this.item.terria.workbench.items
                        .filter((item) => ViewingControls.is(item) &&
                        item.viewingControls.find((control) => control.id === TableStylingWorkflow.type))
                        .map((item) => ({
                        id: item.uniqueId,
                        name: getName(item)
                    })),
                    setDimensionValue: (stratumId, value) => {
                        const item = this.item.terria.workbench.items.find((i) => i.uniqueId === value);
                        if (item && TableMixin.isMixedInto(item)) {
                            // Trigger new TableStylingWorkflow
                            if (item.viewingControls.find((control) => control.id === TableStylingWorkflow.type)) {
                                item.terria.selectableDimensionWorkflow =
                                    new TableStylingWorkflow(item);
                            }
                        }
                    }
                },
                {
                    type: "select",
                    id: "table-style",
                    name: i18next.t("models.tableStyling.data.selectableDimensions.tableStyle.name"),
                    selectedId: this.tableStyle.id,
                    options: this.item.tableStyles.map((style) => ({
                        id: style.id,
                        name: style.title
                    })),
                    allowCustomInput: true,
                    setDimensionValue: (stratumId, value) => {
                        if (!this.item.tableStyles.find((style) => style.id === value)) {
                            this.getTableStyleTraits(stratumId, value);
                        }
                        this.item.setTrait(stratumId, "activeStyle", value);
                        // Note - the activeStyle reaction in TableStylingWorkflow.constructor handles all side effects
                        // The reaction will call this.setColorSchemeTypeFromPalette()
                    }
                },
                {
                    type: "select",
                    id: "table-style-type",
                    name: i18next.t("models.tableStyling.data.selectableDimensions.tableStyleType.name"),
                    selectedId: this.styleType,
                    options: filterOutUndefined([
                        {
                            id: "fill",
                            name: i18next.t("models.tableStyling.data.selectableDimensions.tableStyleType.options.fill.name")
                        },
                        showPointSize
                            ? {
                                id: "point-size",
                                name: i18next.t("models.tableStyling.data.selectableDimensions.tableStyleType.options.pointSize.name")
                            }
                            : undefined,
                        showPointStyles
                            ? {
                                id: "point",
                                name: i18next.t("models.tableStyling.data.selectableDimensions.tableStyleType.options.point.name")
                            }
                            : undefined,
                        {
                            id: "outline",
                            name: i18next.t("models.tableStyling.data.selectableDimensions.tableStyleType.options.outline.name")
                        },
                        showLabelStyles
                            ? {
                                id: "label",
                                name: i18next.t("models.tableStyling.data.selectableDimensions.tableStyleType.options.label.name")
                            }
                            : undefined,
                        showTrailStyles
                            ? {
                                id: "trail",
                                name: i18next.t("models.tableStyling.data.selectableDimensions.tableStyleType.options.trail.name")
                            }
                            : undefined
                    ]),
                    setDimensionValue: (stratumId, value) => {
                        if (value === "fill" ||
                            value === "point-size" ||
                            value === "point" ||
                            value === "outline" ||
                            value === "trail" ||
                            value === "label")
                            this.styleType = value;
                    }
                }
            ])
        };
    }
    /** List of color schemes available for given `colorSchemeType` */
    get colorSchemesForType() {
        const type = this.colorSchemeType;
        if (!isDefined(type))
            return [];
        if (type === "sequential-continuous")
            return [...SEQUENTIAL_SCALES, ...SEQUENTIAL_CONTINUOUS_SCALES];
        if (type === "sequential-discrete")
            return SEQUENTIAL_SCALES;
        if (type === "diverging-discrete" || type === "diverging-continuous")
            return DIVERGING_SCALES;
        if (type === "qualitative")
            return QUALITATIVE_SCALES;
        return [];
    }
    /** Color scheme dimensions:
     * - Type (see `this.colorSchemeType`)
     * - Color scheme (see `this.colorSchemesForType`)
     * - Number of bins (for discrete)
     */
    get colorSchemeSelectableDim() {
        var _a, _b, _c, _d;
        return {
            type: "group",
            id: "fill",
            name: i18next.t("models.tableStyling.fill.name"),
            selectableDimensions: filterOutUndefined([
                // Show "Variable" selector to pick colorColumn if tableStyle ID is different from colorColumn ID
                // OR if we are in advanced mode
                this.tableStyle.id !== ((_a = this.tableStyle.colorColumn) === null || _a === void 0 ? void 0 : _a.name) ||
                    this.showAdvancedOptions
                    ? {
                        type: "select",
                        id: "table-color-column",
                        name: i18next.t("models.tableStyling.fill.selectableDimensions.tableColorColumn.name"),
                        selectedId: (_b = this.tableStyle.colorColumn) === null || _b === void 0 ? void 0 : _b.name,
                        options: this.item.tableColumns.map((col) => ({
                            id: col.name,
                            name: col.title
                        })),
                        setDimensionValue: (stratumId, value) => {
                            var _a, _b, _c;
                            // Make sure `activeStyle` is set, otherwise it may change when we change `colorColumn`
                            this.item.setTrait(stratumId, "activeStyle", this.tableStyle.id);
                            const prevColumnType = (_a = this.tableStyle.colorColumn) === null || _a === void 0 ? void 0 : _a.type;
                            (_b = this.getTableStyleTraits(stratumId)) === null || _b === void 0 ? void 0 : _b.color.setTrait(stratumId, "colorColumn", value);
                            const newColumnType = (_c = this.tableStyle.colorColumn) === null || _c === void 0 ? void 0 : _c.type;
                            // Reset color palette and color scheme type if color column type has changed
                            // For example, if the color column type changes from `scalar` to `enum` - we don't want to still have a `scalar` color palette
                            if (prevColumnType !== newColumnType) {
                                this.tableStyle.colorTraits.setTrait(stratumId, "colorPalette", undefined);
                                this.setColorSchemeTypeFromPalette();
                            }
                        }
                    }
                    : undefined,
                this.showAdvancedOptions
                    ? {
                        type: "select",
                        id: "data-type",
                        name: i18next.t("models.tableStyling.fill.selectableDimensions.dataType.name"),
                        options: Object.keys(TableColumnType)
                            .filter((type) => type.length > 1)
                            .map((colType) => ({ id: colType })),
                        selectedId: isDefined((_c = this.tableStyle.colorColumn) === null || _c === void 0 ? void 0 : _c.type)
                            ? TableColumnType[this.tableStyle.colorColumn.type]
                            : undefined,
                        setDimensionValue: (stratumId, id) => {
                            var _a;
                            (_a = this.getTableColumnTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.setTrait(stratumId, "type", id);
                            this.setColorSchemeTypeFromPalette();
                        }
                    }
                    : undefined,
                this.tableStyle.colorColumn
                    ? {
                        type: "select",
                        id: "type",
                        name: i18next.t("models.tableStyling.fill.selectableDimensions.type.name"),
                        undefinedLabel: i18next.t("models.tableStyling.fill.selectableDimensions.type.undefinedLabel"),
                        options: filterOutUndefined([
                            {
                                id: "no-style",
                                name: i18next.t("models.tableStyling.fill.selectableDimensions.type.options.noStyle.name")
                            },
                            ...(this.tableStyle.colorColumn.type === TableColumnType.scalar
                                ? [
                                    {
                                        id: "sequential-continuous",
                                        name: i18next.t("models.tableStyling.fill.selectableDimensions.type.options.sequentialContinuous.name")
                                    },
                                    {
                                        id: "sequential-discrete",
                                        name: i18next.t("models.tableStyling.fill.selectableDimensions.type.options.sequentialDiscrete.name")
                                    },
                                    {
                                        id: "diverging-continuous",
                                        name: i18next.t("models.tableStyling.fill.selectableDimensions.type.options.divergingContinuous.name")
                                    },
                                    {
                                        id: "diverging-discrete",
                                        name: i18next.t("models.tableStyling.fill.selectableDimensions.type.options.divergingDiscrete.name")
                                    }
                                ]
                                : []),
                            {
                                id: "qualitative",
                                name: i18next.t("models.tableStyling.fill.selectableDimensions.type.options.qualitative.name")
                            },
                            // Add options for "custom" color palettes if we are in "custom-qualitative" or "custom-discrete" mode
                            this.colorSchemeType === "custom-qualitative"
                                ? {
                                    id: "custom-qualitative",
                                    name: i18next.t("models.tableStyling.fill.selectableDimensions.type.options.customQualitative.name")
                                }
                                : undefined,
                            this.colorSchemeType === "custom-discrete"
                                ? {
                                    id: "custom-discrete",
                                    name: i18next.t("models.tableStyling.fill.selectableDimensions.type.options.customDiscrete.name")
                                }
                                : undefined
                        ]),
                        selectedId: this.colorSchemeType,
                        setDimensionValue: (stratumId, id) => {
                            this.setColorSchemeType(stratumId, id);
                        }
                    }
                    : undefined,
                {
                    type: "select",
                    id: "scheme",
                    name: i18next.t("models.tableStyling.fill.selectableDimensions.scheme.name"),
                    selectedId: (_d = this.tableStyle.colorTraits.colorPalette) !== null && _d !== void 0 ? _d : this.tableStyle.tableColorMap.defaultColorPaletteName,
                    options: this.colorSchemesForType.map((style) => ({
                        id: style
                    })),
                    optionRenderer: this.colorSchemeType === "qualitative"
                        ? QualitativeColorSchemeOptionRenderer
                        : QuantitativeColorSchemeOptionRenderer(this.colorSchemeType === "sequential-discrete" ||
                            this.colorSchemeType === "diverging-discrete"
                            ? this.tableStyle.tableColorMap.binColors.length
                            : undefined),
                    setDimensionValue: (stratumId, id) => {
                        var _a, _b, _c;
                        (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "colorPalette", id);
                        (_b = this.getTableStyleTraits(stratumId)) === null || _b === void 0 ? void 0 : _b.color.setTrait(stratumId, "binColors", []);
                        (_c = this.getTableStyleTraits(stratumId)) === null || _c === void 0 ? void 0 : _c.color.setTrait(stratumId, "enumColors", []);
                    }
                },
                // Show "Number of Bins" if in discrete mode
                this.colorSchemeType === "sequential-discrete" ||
                    this.colorSchemeType === "diverging-discrete"
                    ? {
                        type: "numeric",
                        id: "number-of-bins",
                        name: i18next.t("models.tableStyling.fill.selectableDimensions.numberOfBins.name"),
                        allowUndefined: true,
                        min: 
                        // Sequential and diverging color scales must have at least 3 bins
                        this.colorSchemeType === "sequential-discrete" ||
                            this.colorSchemeType === "diverging-discrete"
                            ? 3
                            : // Custom color scales only need at least 1
                                1,
                        max: 
                        // Sequential discrete color scales support up to 9 bins
                        this.colorSchemeType === "sequential-discrete"
                            ? 9
                            : // Diverging discrete color scales support up to 11 bins
                                this.colorSchemeType === "diverging-discrete"
                                    ? 11
                                    : // Custom discrete color scales can be any number of bins
                                        undefined,
                        value: this.tableStyle.colorTraits.numberOfBins,
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            if (!isDefined(value))
                                return;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "numberOfBins", value);
                            this.resetBinMaximums(stratumId);
                        }
                    }
                    : undefined
            ])
        };
    }
    get minimumValueSelectableDim() {
        return {
            type: "numeric",
            id: "min",
            name: i18next.t("models.tableStyling.min.name"),
            max: this.tableStyle.tableColorMap.maximumValue,
            value: this.tableStyle.tableColorMap.minimumValue,
            setDimensionValue: (stratumId, value) => {
                var _a;
                (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "minimumValue", value);
                if (this.colorSchemeType === "sequential-discrete" ||
                    this.colorSchemeType === "diverging-discrete" ||
                    this.colorSchemeType === "custom-discrete") {
                    this.setBinMaximums(stratumId);
                }
            }
        };
    }
    /** Display range dimensions:
     * - Minimum value
     * - Maximum value
     */
    get displayRangeDim() {
        return {
            type: "group",
            id: "display-range",
            name: i18next.t("models.tableStyling.displayRange.name"),
            isOpen: false,
            selectableDimensions: filterOutUndefined([
                this.minimumValueSelectableDim,
                {
                    type: "numeric",
                    id: "max",
                    name: i18next.t("models.tableStyling.displayRange.selectableDimensions.max.name"),
                    min: this.tableStyle.tableColorMap.minimumValue,
                    value: this.tableStyle.tableColorMap.maximumValue,
                    setDimensionValue: (stratumId, value) => {
                        var _a;
                        (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "maximumValue", value);
                    }
                },
                this.item.outlierFilterDimension
            ])
        };
    }
    /** Group to show bins with color, start/stop numbers.
     */
    get binColorDims() {
        return {
            type: "group",
            id: "bins",
            name: i18next.t("models.tableStyling.bins.name"),
            isOpen: false,
            selectableDimensions: [
                ...this.tableStyle.tableColorMap.binMaximums
                    .map((bin, idx) => {
                    var _a;
                    return ({
                        type: "group",
                        id: `bin-${idx}-start`,
                        name: getColorPreview((_a = this.tableStyle.tableColorMap.binColors[idx]) !== null && _a !== void 0 ? _a : "#aaa", i18next.t("models.tableStyling.bins.selectableDimensions.start.name", {
                            value1: idx === 0
                                ? this.minimumValueSelectableDim.value
                                : this.tableStyle.tableColorMap.binMaximums[idx - 1],
                            value2: bin
                        })),
                        isOpen: this.openBinIndex.get("fill") === idx,
                        onToggle: (open) => {
                            if (open && this.openBinIndex.get("fill") !== idx) {
                                runInAction(() => this.openBinIndex.set("fill", idx));
                                return true;
                            }
                        },
                        selectableDimensions: [
                            {
                                type: "color",
                                id: `bin-${idx}-color`,
                                name: i18next.t("models.tableStyling.bins.selectableDimensions.start.selectableDimensions.color.name"),
                                value: this.tableStyle.tableColorMap.binColors[idx],
                                setDimensionValue: (stratumId, value) => {
                                    var _a;
                                    const binColors = [
                                        ...this.tableStyle.tableColorMap.binColors
                                    ];
                                    if (isDefined(value))
                                        binColors[idx] = value;
                                    (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "binColors", binColors);
                                    this.colorSchemeType = "custom-discrete";
                                }
                            },
                            idx === 0
                                ? this.minimumValueSelectableDim
                                : {
                                    type: "numeric",
                                    id: `bin-${idx}-start`,
                                    name: i18next.t("models.tableStyling.bins.selectableDimensions.start.selectableDimensions.start.name"),
                                    value: this.tableStyle.tableColorMap.binMaximums[idx - 1],
                                    setDimensionValue: (stratumId, value) => {
                                        const binMaximums = [
                                            ...this.tableStyle.tableColorMap.binMaximums
                                        ];
                                        if (isDefined(value))
                                            binMaximums[idx - 1] = value;
                                        this.setBinMaximums(stratumId, binMaximums);
                                    }
                                },
                            {
                                type: "numeric",
                                id: `bin-${idx}-stop`,
                                name: i18next.t("models.tableStyling.bins.selectableDimensions.start.selectableDimensions.stop.name"),
                                value: bin,
                                setDimensionValue: (stratumId, value) => {
                                    const binMaximums = [
                                        ...this.tableStyle.tableColorMap.binMaximums
                                    ];
                                    if (isDefined(value))
                                        binMaximums[idx] = value;
                                    this.setBinMaximums(stratumId, binMaximums);
                                }
                            }
                        ]
                    });
                })
                    .reverse() // Reverse array of bins to match Legend (descending order)
            ]
        };
    }
    /** Groups to show enum "bins" with colors and value */
    get enumColorDims() {
        var _a;
        return {
            type: "group",
            id: "colors",
            name: i18next.t("models.tableStyling.colors.name"),
            isOpen: false,
            selectableDimensions: filterOutUndefined([
                ...this.tableStyle.tableColorMap.enumColors.map((enumCol, idx) => {
                    var _a, _b, _c, _d;
                    if (!enumCol.value)
                        return;
                    const dims = {
                        type: "group",
                        id: `enum-${idx}-start`,
                        name: getColorPreview((_a = enumCol.color) !== null && _a !== void 0 ? _a : "#aaa", enumCol.value),
                        isOpen: this.openBinIndex.get("fill") === idx,
                        onToggle: (open) => {
                            if (open && this.openBinIndex.get("fill") !== idx) {
                                runInAction(() => this.openBinIndex.set("fill", idx));
                                return true;
                            }
                        },
                        selectableDimensions: [
                            {
                                type: "color",
                                id: `enum-${idx}-color`,
                                name: i18next.t("models.tableStyling.colors.selectableDimensions.color.name"),
                                value: enumCol.color,
                                setDimensionValue: (stratumId, value) => {
                                    this.colorSchemeType = "custom-qualitative";
                                    this.setEnumColorTrait(stratumId, idx, enumCol.value, value);
                                }
                            },
                            {
                                type: "select",
                                id: `enum-${idx}-value`,
                                name: i18next.t("models.tableStyling.colors.selectableDimensions.value.name"),
                                selectedId: enumCol.value,
                                // Find unique column values which don't already have an enumCol
                                // We prepend the current enumCol.value
                                options: [
                                    { id: enumCol.value },
                                    ...((_d = (_c = (_b = this.tableStyle.colorColumn) === null || _b === void 0 ? void 0 : _b.uniqueValues.values) === null || _c === void 0 ? void 0 : _c.filter((value) => !this.tableStyle.tableColorMap.enumColors.find((enumCol) => enumCol.value === value)).map((id) => ({ id }))) !== null && _d !== void 0 ? _d : [])
                                ],
                                setDimensionValue: (stratumId, value) => {
                                    this.colorSchemeType = "custom-qualitative";
                                    this.setEnumColorTrait(stratumId, idx, value, enumCol.color);
                                }
                            },
                            {
                                type: "button",
                                id: `enum-${idx}-remove`,
                                value: i18next.t("models.tableStyling.colors.selectableDimensions.remove.value"),
                                setDimensionValue: (stratumId) => {
                                    this.colorSchemeType = "custom-qualitative";
                                    // Remove element by clearing `value`
                                    this.setEnumColorTrait(stratumId, idx, undefined, undefined);
                                }
                            }
                        ]
                    };
                    return dims;
                }),
                // Are there more colors to add (are there more unique values in the column than enumCols)
                // Create "Add" to user can add more
                this.tableStyle.colorColumn &&
                    this.tableStyle.tableColorMap.enumColors.filter((col) => col.value)
                        .length < ((_a = this.tableStyle.colorColumn) === null || _a === void 0 ? void 0 : _a.uniqueValues.values.length)
                    ? {
                        type: "button",
                        id: `enum-add`,
                        value: i18next.t("models.tableStyling.colors.selectableDimensions.add.value"),
                        setDimensionValue: (stratumId) => {
                            var _a;
                            this.colorSchemeType = "custom-qualitative";
                            const firstValue = (_a = this.tableStyle.colorColumn) === null || _a === void 0 ? void 0 : _a.uniqueValues.values.find((value) => !this.tableStyle.tableColorMap.enumColors.find((col) => col.value === value));
                            if (!isDefined(firstValue))
                                return;
                            // Can we find any unused colors in the colorPalette
                            const unusedColor = this.tableStyle.tableColorMap
                                .colorScaleCategorical(this.tableStyle.tableColorMap.enumColors.length + 1)
                                .find((col) => !this.tableStyle.tableColorMap.enumColors.find((enumColor) => enumColor.color === col));
                            this.setEnumColorTrait(stratumId, this.tableStyle.tableColorMap.enumColors.length, firstValue, unusedColor !== null && unusedColor !== void 0 ? unusedColor : "#000000");
                            this.openBinIndex.set("fill", this.tableStyle.tableColorMap.enumColors.length - 1);
                        }
                    }
                    : undefined
            ])
        };
    }
    get nullColorDimension() {
        return {
            type: "color",
            id: `null-color`,
            name: i18next.t("models.tableStyling.nullColor.name"),
            value: this.tableStyle.colorTraits.nullColor,
            allowUndefined: true,
            setDimensionValue: (stratumId, value) => {
                var _a;
                (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "nullColor", value);
            }
        };
    }
    get outlierColorDimension() {
        var _a, _b;
        return {
            type: "color",
            id: `outlier-color`,
            name: i18next.t("models.tableStyling.outlierColor.name"),
            allowUndefined: true,
            value: (_a = this.tableStyle.colorTraits.outlierColor) !== null && _a !== void 0 ? _a : (_b = this.tableStyle.tableColorMap.outlierColor) === null || _b === void 0 ? void 0 : _b.toCssHexString(),
            setDimensionValue: (stratumId, value) => {
                var _a;
                (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "outlierColor", value);
            }
        };
    }
    /** Misc table style color dimensions:
     * - Region color
     * - Null color
     * - Outlier color
     */
    get additionalColorDimensions() {
        var _a, _b, _c, _d;
        return {
            type: "group",
            id: "additional-colors",
            name: i18next.t("models.tableStyling.additionalColors.name"),
            // Open group by default is no activeStyle is selected
            isOpen: !this.item.activeStyle || this.colorSchemeType === "no-style",
            selectableDimensions: filterOutUndefined([
                ((_a = this.tableStyle.colorColumn) === null || _a === void 0 ? void 0 : _a.type) === TableColumnType.region
                    ? {
                        type: "color",
                        id: `region-color`,
                        name: i18next.t("models.tableStyling.additionalColors.selectableDimensions.regionColor.name"),
                        value: this.tableStyle.colorTraits.regionColor,
                        allowUndefined: true,
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "regionColor", value);
                        }
                    }
                    : {
                        type: "color",
                        id: `null-color`,
                        name: i18next.t("models.tableStyling.additionalColors.selectableDimensions.nullColor.name"),
                        value: this.tableStyle.colorTraits.nullColor,
                        allowUndefined: true,
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "nullColor", value);
                        }
                    },
                ((_b = this.tableStyle.colorColumn) === null || _b === void 0 ? void 0 : _b.type) === TableColumnType.scalar
                    ? {
                        type: "color",
                        id: `outlier-color`,
                        name: i18next.t("models.tableStyling.additionalColors.selectableDimensions.outlierColor.name"),
                        allowUndefined: true,
                        value: (_c = this.tableStyle.colorTraits.outlierColor) !== null && _c !== void 0 ? _c : (_d = this.tableStyle.tableColorMap.outlierColor) === null || _d === void 0 ? void 0 : _d.toCssHexString(),
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "outlierColor", value);
                        }
                    }
                    : undefined
            ])
        };
    }
    get pointSizeDimensions() {
        return {
            type: "group",
            id: "point-size",
            name: i18next.t("models.tableStyling.pointSize.name"),
            isOpen: true,
            selectableDimensions: [
                {
                    type: "select",
                    id: `point-size-column`,
                    name: i18next.t("models.tableStyling.pointSize.selectableDimensions.pointSizeColumn.name"),
                    selectedId: this.tableStyle.pointSizeTraits.pointSizeColumn,
                    options: this.item.tableColumns
                        .filter((col) => col.type === TableColumnType.scalar)
                        .map((col) => ({
                        id: col.name,
                        name: col.title
                    })),
                    allowUndefined: true,
                    setDimensionValue: (stratumId, value) => {
                        var _a;
                        (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.pointSize.setTrait(stratumId, "pointSizeColumn", value);
                    }
                },
                ...(this.tableStyle.pointSizeColumn
                    ? [
                        {
                            type: "numeric",
                            id: "point-size-null",
                            name: i18next.t("models.tableStyling.pointSize.selectableDimensions.pointSizeNull.name"),
                            min: 0,
                            value: this.tableStyle.pointSizeTraits.nullSize,
                            setDimensionValue: (stratumId, value) => {
                                var _a;
                                (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.pointSize.setTrait(stratumId, "nullSize", value);
                            }
                        },
                        {
                            type: "numeric",
                            id: "point-sizes-factor",
                            name: i18next.t("models.tableStyling.pointSize.selectableDimensions.pointSizesFactor.name"),
                            min: 0,
                            value: this.tableStyle.pointSizeTraits.sizeFactor,
                            setDimensionValue: (stratumId, value) => {
                                var _a;
                                (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.pointSize.setTrait(stratumId, "sizeFactor", value);
                            }
                        },
                        {
                            type: "numeric",
                            id: "point-size-offset",
                            name: i18next.t("models.tableStyling.pointSize.selectableDimensions.pointSizeOffset.name"),
                            min: 0,
                            value: this.tableStyle.pointSizeTraits.sizeOffset,
                            setDimensionValue: (stratumId, value) => {
                                var _a;
                                (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.pointSize.setTrait(stratumId, "sizeOffset", value);
                            }
                        }
                    ]
                    : [])
            ]
        };
    }
    /** Advanced region mapping - pulled from TableMixin.regionColumnDimensions and TableMixin.regionProviderDimensions
     */
    get advancedRegionMappingDimensions() {
        return {
            type: "group",
            id: "region-mapping",
            name: i18next.t("models.tableStyling.regionMapping.name"),
            isOpen: false,
            selectableDimensions: filterOutUndefined([
                this.item.regionColumnDimensions,
                this.item.regionProviderDimensions
            ])
        };
    }
    /** Advanced table dimensions:
     * - Legend (title, ticks, item titles...)
     * - Style options (title, lat/lon columns)
     * - Time options (column, id columns, spread start/finish time, ...)
     * - Workbench options (show style selector, show disable style/time in workbench, ...)
     * - Variable/Column options (title, units)
     */
    get advancedTableDimensions() {
        var _a, _b, _c, _d, _e, _f, _g;
        return [
            {
                type: "group",
                id: "legend",
                name: i18next.t("models.tableStyling.legend.name"),
                isOpen: false,
                selectableDimensions: filterOutUndefined([
                    {
                        type: "text",
                        id: "legend-title",
                        name: i18next.t("models.tableStyling.legend.selectableDimensions.legendTitle.name"),
                        value: this.tableStyle.colorTraits.legend.title,
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.legend.setTrait(stratumId, "title", value);
                        }
                    },
                    this.colorSchemeType === "diverging-continuous" ||
                        this.colorSchemeType === "sequential-continuous"
                        ? {
                            type: "numeric",
                            id: "legend-ticks",
                            name: i18next.t("models.tableStyling.legend.selectableDimensions.legendTicks.name"),
                            min: 2,
                            value: this.tableStyle.colorTraits.legendTicks,
                            setDimensionValue: (stratumId, value) => {
                                var _a;
                                (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "legendTicks", value);
                            }
                        }
                        : undefined,
                    ...this.tableStyle.colorTraits.legend.items.map((legendItem, idx) => ({
                        type: "text",
                        id: `legend-${idx}-title`,
                        name: i18next.t("models.tableStyling.legend.selectableDimensions.title.name", { index: idx + 1 }),
                        value: legendItem.title,
                        setDimensionValue: (stratumId, value) => {
                            legendItem.setTrait(stratumId, "title", value);
                        }
                    }))
                ])
            },
            {
                type: "group",
                id: "style-options",
                name: i18next.t("models.tableStyling.styleOptions.name"),
                isOpen: false,
                selectableDimensions: filterOutUndefined([
                    {
                        type: "text",
                        id: "style-title",
                        name: i18next.t("models.tableStyling.styleOptions.selectableDimensions.styleTitle.name"),
                        value: this.tableStyle.title,
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.setTrait(stratumId, "title", value);
                        }
                    },
                    {
                        type: "select",
                        id: "longitude-column",
                        name: i18next.t("models.tableStyling.styleOptions.selectableDimensions.longitudeColumn.name"),
                        selectedId: (_a = this.tableStyle.longitudeColumn) === null || _a === void 0 ? void 0 : _a.name,
                        allowUndefined: true,
                        options: this.item.tableColumns.map((col) => ({
                            id: col.name,
                            name: col.title
                        })),
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.setTrait(stratumId, "longitudeColumn", value);
                        }
                    },
                    {
                        type: "select",
                        id: "latitude-column",
                        name: i18next.t("models.tableStyling.styleOptions.selectableDimensions.latitudeColumn.name"),
                        selectedId: (_b = this.tableStyle.latitudeColumn) === null || _b === void 0 ? void 0 : _b.name,
                        allowUndefined: true,
                        options: this.item.tableColumns.map((col) => ({
                            id: col.name,
                            name: col.title
                        })),
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.setTrait(stratumId, "latitudeColumn", value);
                        }
                    }
                ])
            },
            {
                type: "group",
                id: "time-options",
                name: i18next.t("models.tableStyling.timeOptions.name"),
                isOpen: false,
                selectableDimensions: filterOutUndefined([
                    {
                        type: "select",
                        id: "table-time-column",
                        name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeColumn.name"),
                        selectedId: (_c = this.tableStyle.timeColumn) === null || _c === void 0 ? void 0 : _c.name,
                        allowUndefined: true,
                        options: this.item.tableColumns.map((col) => ({
                            id: col.name,
                            name: col.title
                        })),
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.time.setTrait(stratumId, "timeColumn", value);
                        }
                    },
                    {
                        type: "select",
                        id: "table-end-time-column",
                        name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableEndTimeColumn.name"),
                        selectedId: (_d = this.tableStyle.endTimeColumn) === null || _d === void 0 ? void 0 : _d.name,
                        allowUndefined: true,
                        options: this.item.tableColumns.map((col) => ({
                            id: col.name,
                            name: col.title
                        })),
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.time.setTrait(stratumId, "endTimeColumn", value);
                        }
                    },
                    {
                        type: "select-multi",
                        id: "table-time-id-columns",
                        name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeIdColumns.name"),
                        selectedIds: (_e = this.tableStyle.idColumns) === null || _e === void 0 ? void 0 : _e.map((c) => c.name),
                        allowUndefined: true,
                        options: this.item.tableColumns.map((col) => ({
                            id: col.name,
                            name: col.title
                        })),
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.time.setTrait(stratumId, "idColumns", value);
                        }
                    },
                    {
                        type: "checkbox",
                        id: "table-time-is-sampled",
                        name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeIsSampled.name"),
                        options: [
                            {
                                id: "true",
                                name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeIsSampled.options.true.name")
                            },
                            {
                                id: "false",
                                name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeIsSampled.options.false.name")
                            }
                        ],
                        selectedId: this.tableStyle.isSampled ? "true" : "false",
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.time.setTrait(stratumId, "isSampled", value === "true");
                        }
                    },
                    {
                        type: "numeric",
                        id: `table-time-display-duration`,
                        name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeDisplayDuration.name"),
                        value: this.tableStyle.timeTraits.displayDuration,
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.time.setTrait(stratumId, "displayDuration", value);
                        }
                    },
                    {
                        type: "checkbox",
                        id: "table-time-spread-start-time",
                        name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeSpreadStartTime.name"),
                        options: [
                            {
                                id: "true",
                                name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeSpreadStartTime.options.true.name")
                            },
                            {
                                id: "false",
                                name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeSpreadStartTime.options.false.name")
                            }
                        ],
                        selectedId: this.tableStyle.timeTraits.spreadStartTime
                            ? "true"
                            : "false",
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.time.setTrait(stratumId, "spreadStartTime", value === "true");
                        }
                    },
                    {
                        type: "checkbox",
                        id: "table-time-spread-finish-time",
                        name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeSpreadFinishTime.name"),
                        options: [
                            {
                                id: "true",
                                name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeSpreadFinishTime.options.true.name")
                            },
                            {
                                id: "false",
                                name: i18next.t("models.tableStyling.timeOptions.selectableDimensions.tableTimeSpreadFinishTime.options.false.name")
                            }
                        ],
                        selectedId: this.tableStyle.timeTraits.spreadFinishTime
                            ? "true"
                            : "false",
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.time.setTrait(stratumId, "spreadFinishTime", value === "true");
                        }
                    }
                ])
            },
            {
                type: "group",
                id: "workbench-options",
                name: i18next.t("models.tableStyling.workbenchOptions.name"),
                isOpen: false,
                selectableDimensions: filterOutUndefined([
                    {
                        type: "checkbox",
                        id: "table-style-enabled",
                        name: i18next.t("models.tableStyling.workbenchOptions.selectableDimensions.tableStyleEnalbed.name"),
                        options: [
                            {
                                id: "true",
                                name: i18next.t("models.tableStyling.workbenchOptions.selectableDimensions.tableStyleEnalbed.options.true.name")
                            },
                            {
                                id: "false",
                                name: i18next.t("models.tableStyling.workbenchOptions.selectableDimensions.tableStyleEnalbed.options.false.name")
                            }
                        ],
                        selectedId: this.item.activeTableStyle.hidden ? "false" : "true",
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.setTrait(stratumId, "hidden", value === "false");
                        }
                    },
                    {
                        type: "checkbox",
                        id: "show-disable-style-option",
                        name: i18next.t("models.tableStyling.workbenchOptions.selectableDimensions.showDisableStyleOption.name"),
                        options: [{ id: "true" }, { id: "false" }],
                        selectedId: this.item.showDisableStyleOption ? "true" : "false",
                        setDimensionValue: (stratumId, value) => {
                            this.item.setTrait(stratumId, "showDisableStyleOption", value === "true");
                        }
                    },
                    {
                        type: "checkbox",
                        id: "show-disable-time-option",
                        name: i18next.t("models.tableStyling.workbenchOptions.selectableDimensions.showDisableTimeOption.name"),
                        options: [{ id: "true" }, { id: "false" }],
                        selectedId: this.item.showDisableTimeOption ? "true" : "false",
                        setDimensionValue: (stratumId, value) => {
                            this.item.setTrait(stratumId, "showDisableTimeOption", value === "true");
                        }
                    },
                    {
                        type: "checkbox",
                        id: "enable-manual-region-mapping",
                        name: i18next.t("models.tableStyling.workbenchOptions.selectableDimensions.enableManualRegionMapping.name"),
                        options: [{ id: "true" }, { id: "false" }],
                        selectedId: this.item.enableManualRegionMapping ? "true" : "false",
                        setDimensionValue: (stratumId, value) => {
                            this.item.setTrait(stratumId, "enableManualRegionMapping", value === "true");
                        }
                    }
                ])
            },
            {
                type: "group",
                id: "variable-and-column",
                name: i18next.t("models.tableStyling.variableAndColumn.name"),
                isOpen: false,
                selectableDimensions: filterOutUndefined([
                    {
                        type: "text",
                        id: "column-title",
                        name: i18next.t("models.tableStyling.variableAndColumn.selectableDimensions.columnTitle.name"),
                        value: (_f = this.tableStyle.colorColumn) === null || _f === void 0 ? void 0 : _f.title,
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableColumnTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.setTrait(stratumId, "title", value);
                        }
                    },
                    {
                        type: "text",
                        id: "column-units",
                        name: i18next.t("models.tableStyling.variableAndColumn.selectableDimensions.columnUnits.name"),
                        value: (_g = this.tableStyle.colorColumn) === null || _g === void 0 ? void 0 : _g.units,
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            (_a = this.getTableColumnTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.setTrait(stratumId, "units", value);
                        }
                    }
                ])
            }
        ];
    }
    getStyleDims(title, key, tableStyleMap, getDims, getPreview) {
        var _a, _b, _c, _d, _e, _f;
        const traits = tableStyleMap.commonTraits;
        if (!isDefined(traits))
            return [];
        return filterOutUndefined([
            {
                type: "group",
                id: key,
                name: title,
                isOpen: true,
                selectableDimensions: filterOutUndefined([
                    {
                        type: "checkbox",
                        id: `${key}-enabled`,
                        options: [{ id: "true" }, { id: "false" }],
                        selectedId: traits.enabled ? "true" : "false",
                        setDimensionValue: (stratumId, value) => {
                            traits.setTrait(stratumId, "enabled", value === "true");
                        }
                    },
                    {
                        type: "select",
                        id: `${key}-column`,
                        name: i18next.t("models.tableStyling.style.selectableDimensions.column.name"),
                        selectedId: (_a = tableStyleMap.column) === null || _a === void 0 ? void 0 : _a.name,
                        allowUndefined: true,
                        options: this.item.tableColumns.map((col) => ({
                            id: col.name,
                            name: col.title
                        })),
                        setDimensionValue: (stratumId, value) => {
                            tableStyleMap.commonTraits.setTrait(stratumId, "column", value);
                        }
                    },
                    tableStyleMap.column
                        ? {
                            type: "select",
                            id: `${key}-style-type`,
                            name: i18next.t("models.tableStyling.style.selectableDimensions.styleType.name"),
                            undefinedLabel: i18next.t("models.tableStyling.style.selectableDimensions.styleType.undefinedLabel"),
                            options: filterOutUndefined([
                                {
                                    id: "constant",
                                    name: i18next.t("models.tableStyling.style.selectableDimensions.styleType.constant.name")
                                },
                                tableStyleMap.column.type === TableColumnType.scalar
                                    ? {
                                        id: "bin",
                                        name: i18next.t("models.tableStyling.style.selectableDimensions.styleType.bin.name")
                                    }
                                    : undefined,
                                {
                                    id: "enum",
                                    name: i18next.t("models.tableStyling.style.selectableDimensions.styleType.enum.name")
                                }
                            ]),
                            selectedId: (_b = traits.mapType) !== null && _b !== void 0 ? _b : tableStyleMap.styleMap.type,
                            setDimensionValue: (stratumId, id) => {
                                if (id === "bin" || id === "enum" || id === "constant")
                                    traits.setTrait(stratumId, "mapType", id);
                            }
                        }
                        : undefined
                ])
            },
            tableStyleMap.column &&
                ((_c = traits.mapType) !== null && _c !== void 0 ? _c : tableStyleMap.styleMap.type) === "enum"
                ? {
                    type: "group",
                    id: `${key}-enum`,
                    name: i18next.t("models.tableStyling.style.selectableDimensions.enum.name"),
                    isOpen: true,
                    selectableDimensions: filterOutUndefined([
                        ...(_d = traits.enum) === null || _d === void 0 ? void 0 : _d.map((enumPoint, idx) => {
                            var _a, _b, _c, _d, _e;
                            const dims = {
                                type: "group",
                                id: `${key}-enum-${idx}`,
                                name: getPreview(tableStyleMap.traitValues.enum[idx], tableStyleMap.traitValues.null, (_a = tableStyleMap.commonTraits.enum[idx].value) !== null && _a !== void 0 ? _a : i18next.t("models.tableStyling.style.selectableDimensions.enum.selectableDimensions.enum.noValue")),
                                isOpen: this.openBinIndex.get(key) === idx,
                                onToggle: (open) => {
                                    if (open && this.openBinIndex.get(key) !== idx) {
                                        runInAction(() => this.openBinIndex.set(key, idx));
                                        return true;
                                    }
                                },
                                selectableDimensions: [
                                    {
                                        type: "select",
                                        id: `${key}-enum-${idx}-value`,
                                        name: i18next.t("models.tableStyling.style.selectableDimensions.enum.selectableDimensions.enum.selectableDimensions.value.name"),
                                        selectedId: (_b = enumPoint.value) !== null && _b !== void 0 ? _b : undefined,
                                        // Find unique column values which don't already have an enumCol
                                        // We prepend the current enumCol.value
                                        options: filterOutUndefined([
                                            enumPoint.value ? { id: enumPoint.value } : undefined,
                                            ...((_e = (_d = (_c = tableStyleMap.column) === null || _c === void 0 ? void 0 : _c.uniqueValues.values) === null || _d === void 0 ? void 0 : _d.filter((value) => !traits.enum.find((enumCol) => enumCol.value === value)).map((id) => ({ id }))) !== null && _e !== void 0 ? _e : [])
                                        ]),
                                        setDimensionValue: (stratumId, value) => {
                                            enumPoint.setTrait(stratumId, "value", value);
                                        }
                                    },
                                    ...getDims(`${key}-enum-${idx}`, tableStyleMap.traits.enum[idx], tableStyleMap.traitValues.null),
                                    {
                                        type: "button",
                                        id: `${key}-enum-${idx}-remove`,
                                        value: i18next.t("models.tableStyling.style.selectableDimensions.enum.selectableDimensions.enum.selectableDimensions.remove.value"),
                                        setDimensionValue: (stratumId) => {
                                            enumPoint.setTrait(stratumId, "value", null);
                                        }
                                    }
                                ]
                            };
                            return dims;
                        }),
                        // Are there more colors to add (are there more unique values in the column than enumCols)
                        // Create "Add" to user can add more
                        ((_e = tableStyleMap.column) === null || _e === void 0 ? void 0 : _e.uniqueValues.values.filter((v) => { var _a; return !((_a = traits.enum) === null || _a === void 0 ? void 0 : _a.find((col) => col.value === v)); }).length) > 0
                            ? {
                                type: "button",
                                id: `${key}-enum-add`,
                                value: i18next.t("models.tableStyling.style.selectableDimensions.enum.selectableDimensions.enum.add.value"),
                                setDimensionValue: (stratumId) => {
                                    var _a;
                                    const firstValue = (_a = tableStyleMap.column) === null || _a === void 0 ? void 0 : _a.uniqueValues.values.find((value) => { var _a; return !((_a = traits.enum) === null || _a === void 0 ? void 0 : _a.find((col) => col.value === value)); });
                                    if (!isDefined(firstValue))
                                        return;
                                    const newModel = traits.addObject(stratumId, "enum");
                                    if (newModel)
                                        // Copy over values from null/default traitValues for new enum value
                                        updateModelFromJson(newModel, stratumId, {
                                            ...tableStyleMap.traitValues.null,
                                            value: firstValue
                                        }).logError("Error while adding `enum` item");
                                    this.openBinIndex.set(key, traits.enum.length - 1);
                                }
                            }
                            : undefined
                    ])
                }
                : undefined,
            tableStyleMap.column &&
                ((_f = traits.mapType) !== null && _f !== void 0 ? _f : tableStyleMap.styleMap.type) === "bin"
                ? {
                    type: "group",
                    id: `${key}-bin`,
                    name: i18next.t("models.tableStyling.style.selectableDimensions.bin.name"),
                    isOpen: true,
                    selectableDimensions: filterOutUndefined([
                        {
                            type: "button",
                            id: `${key}-bin-add`,
                            value: i18next.t("models.tableStyling.style.selectableDimensions.bin.selectableDimensions.add.value"),
                            setDimensionValue: (stratumId) => {
                                const newModel = traits.addObject(stratumId, "bin");
                                if (newModel)
                                    // Copy over values from null/default traitValues for new bin
                                    updateModelFromJson(newModel, stratumId, tableStyleMap.traitValues.null).logError("Error while adding `bin` item");
                                this.openBinIndex.set(key, traits.bin.length - 1);
                            }
                        },
                        ...traits.bin
                            .map((bin, idx) => {
                            var _a, _b, _c, _d;
                            const dims = {
                                type: "group",
                                id: `${key}-bin-${idx}`,
                                name: getPreview(tableStyleMap.traitValues.bin[idx], tableStyleMap.traitValues.null, !isDefined((_a = bin.maxValue) !== null && _a !== void 0 ? _a : undefined)
                                    ? i18next.t("models.tableStyling.style.selectableDimensions.bin.selectableDimensions.bin.noValue")
                                    : idx > 0 &&
                                        isDefined((_b = traits.bin[idx - 1].maxValue) !== null && _b !== void 0 ? _b : undefined)
                                        ? i18next.t("models.tableStyling.style.selectableDimensions.bin.selectableDimensions.bin.range", {
                                            value1: traits.bin[idx - 1].maxValue,
                                            value2: bin.maxValue
                                        })
                                        : `${bin.maxValue}`),
                                isOpen: this.openBinIndex.get(key) === idx,
                                onToggle: (open) => {
                                    if (open && this.openBinIndex.get(key) !== idx) {
                                        runInAction(() => this.openBinIndex.set(key, idx));
                                        return true;
                                    }
                                },
                                selectableDimensions: filterOutUndefined([
                                    idx > 0
                                        ? {
                                            type: "numeric",
                                            id: `${key}-bin-${idx}-start`,
                                            name: i18next.t("models.tableStyling.style.selectableDimensions.bin.selectableDimensions.bin.selectableDimensions.start.name"),
                                            value: (_c = traits.bin[idx - 1].maxValue) !== null && _c !== void 0 ? _c : undefined,
                                            setDimensionValue: (stratumId, value) => {
                                                traits.bin[idx - 1].setTrait(stratumId, "maxValue", value);
                                            }
                                        }
                                        : undefined,
                                    {
                                        type: "numeric",
                                        id: `${key}-bin-${idx}-stop`,
                                        name: i18next.t("models.tableStyling.style.selectableDimensions.bin.selectableDimensions.bin.selectableDimensions.stop.name"),
                                        value: (_d = bin.maxValue) !== null && _d !== void 0 ? _d : undefined,
                                        setDimensionValue: (stratumId, value) => {
                                            bin.setTrait(stratumId, "maxValue", value);
                                        }
                                    },
                                    ...getDims(`${key}-bin-${idx}`, tableStyleMap.traits.bin[idx], tableStyleMap.traitValues.null),
                                    {
                                        type: "button",
                                        id: `${key}-bin-${idx}-remove`,
                                        value: i18next.t("models.tableStyling.style.selectableDimensions.bin.selectableDimensions.bin.selectableDimensions.remove.value"),
                                        setDimensionValue: (stratumId) => {
                                            bin.setTrait(stratumId, "maxValue", null);
                                        }
                                    }
                                ])
                            };
                            return dims;
                        })
                            .reverse() // Reverse to match legend order
                    ])
                }
                : undefined,
            {
                type: "group",
                id: `${key}-null`,
                name: i18next.t("models.tableStyling.style.null.name"),
                isOpen: !tableStyleMap.column ||
                    !traits.mapType ||
                    traits.mapType === "constant",
                selectableDimensions: getDims(`${key}-null`, tableStyleMap.traits.null, tableStyleMap.traitValues.null)
            }
        ]);
    }
    get markerDims() {
        return this.getStyleDims(i18next.t("models.tableStyling.point.name"), "point", this.tableStyle.pointStyleMap, (id, pointTraits, nullValues) => {
            var _a, _b, _c, _d;
            return filterOutUndefined([
                {
                    type: "select",
                    id: `${id}-marker`,
                    name: `<terriatooltip title="${i18next.t("models.tableStyling.point.selectableDimensions.marker.name")}">${i18next.t("models.tableStyling.point.selectableDimensions.marker.tooltip")}</terriatooltip>`,
                    selectedId: ((_a = pointTraits.marker) !== null && _a !== void 0 ? _a : nullValues.marker) || "point",
                    allowUndefined: true,
                    allowCustomInput: true,
                    options: [...allIcons, "point"].map((icon) => ({
                        id: icon
                    })),
                    optionRenderer: MarkerOptionRenderer,
                    setDimensionValue: (stratumId, value) => {
                        pointTraits.setTrait(stratumId, "marker", value || "point");
                    }
                },
                {
                    type: "numeric",
                    id: `${id}-rotation`,
                    name: i18next.t("models.tableStyling.point.selectableDimensions.rotation.name"),
                    value: (_b = pointTraits.rotation) !== null && _b !== void 0 ? _b : nullValues.rotation,
                    setDimensionValue: (stratumId, value) => {
                        pointTraits.setTrait(stratumId, "rotation", value);
                    }
                },
                !this.tableStyle.pointSizeColumn
                    ? {
                        type: "numeric",
                        id: `${id}-height`,
                        name: i18next.t("models.tableStyling.point.selectableDimensions.height.name"),
                        value: (_c = pointTraits.height) !== null && _c !== void 0 ? _c : nullValues.height,
                        setDimensionValue: (stratumId, value) => {
                            pointTraits.setTrait(stratumId, "height", value);
                        }
                    }
                    : undefined,
                !this.tableStyle.pointSizeColumn
                    ? {
                        type: "numeric",
                        id: `${id}-width`,
                        name: i18next.t("models.tableStyling.point.selectableDimensions.width.name"),
                        value: (_d = pointTraits.width) !== null && _d !== void 0 ? _d : nullValues.width,
                        setDimensionValue: (stratumId, value) => {
                            pointTraits.setTrait(stratumId, "width", value);
                        }
                    }
                    : undefined
            ]);
        }, (point, nullValue, label) => {
            var _a, _b, _c;
            return `<div><img height="${24}px" style="margin-bottom: -4px; transform: rotate(${(_a = point.rotation) !== null && _a !== void 0 ? _a : 0}deg)" src="${(_c = getMakiIcon((_b = point.marker) !== null && _b !== void 0 ? _b : nullValue.marker, "#fff", 1, "#000", 24, 24)) !== null && _c !== void 0 ? _c : point.marker}"></img> ${label}</div>`;
        });
    }
    get outlineDims() {
        return this.getStyleDims(i18next.t("models.tableStyling.outline.name"), "outline", this.tableStyle.outlineStyleMap, (id, outlineTraits, nullValues) => {
            var _a, _b;
            return [
                {
                    type: "color",
                    id: `${id}-color`,
                    name: i18next.t("models.tableStyling.outline.selectableDimensions.color.name"),
                    allowUndefined: true,
                    value: (_a = outlineTraits.color) !== null && _a !== void 0 ? _a : nullValues.color,
                    setDimensionValue: (stratumId, value) => {
                        outlineTraits.setTrait(stratumId, "color", value);
                    }
                },
                {
                    type: "numeric",
                    id: `${id}-width`,
                    name: i18next.t("models.tableStyling.outline.selectableDimensions.width.name"),
                    value: (_b = outlineTraits.width) !== null && _b !== void 0 ? _b : nullValues.width,
                    setDimensionValue: (stratumId, value) => {
                        outlineTraits.setTrait(stratumId, "width", value);
                    }
                }
            ];
        }, (outline, nullValue, label) => { var _a, _b; return getColorPreview((_b = (_a = outline.color) !== null && _a !== void 0 ? _a : nullValue.color) !== null && _b !== void 0 ? _b : "#aaa", label); });
    }
    get labelDims() {
        return this.getStyleDims(i18next.t("models.tableStyling.label.name"), "label", this.tableStyle.labelStyleMap, (id, labelTraits, nullValues) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return filterOutUndefined([
                {
                    type: "select",
                    id: `${id}-column`,
                    name: i18next.t("models.tableStyling.label.selectableDimensions.column.name"),
                    selectedId: (_a = labelTraits.labelColumn) !== null && _a !== void 0 ? _a : nullValues.labelColumn,
                    allowUndefined: true,
                    options: this.item.tableColumns.map((col) => ({
                        id: col.name,
                        name: col.title
                    })),
                    setDimensionValue: (stratumId, value) => {
                        labelTraits.setTrait(stratumId, "labelColumn", value);
                    }
                },
                {
                    type: "text",
                    id: `${id}-font`,
                    name: i18next.t("models.tableStyling.label.selectableDimensions.font.name"),
                    value: (_b = labelTraits.font) !== null && _b !== void 0 ? _b : nullValues.font,
                    setDimensionValue: (stratumId, value) => {
                        labelTraits.setTrait(stratumId, "font", value);
                    }
                },
                {
                    type: "select",
                    id: `${id}-style`,
                    name: i18next.t("models.tableStyling.label.selectableDimensions.style.name"),
                    selectedId: (_c = labelTraits.style) !== null && _c !== void 0 ? _c : nullValues.style,
                    options: [
                        {
                            id: "FILL",
                            name: i18next.t("models.tableStyling.label.selectableDimensions.style.options.fill.name")
                        },
                        {
                            id: "OUTLINE",
                            name: i18next.t("models.tableStyling.label.selectableDimensions.style.options.outline.name")
                        },
                        {
                            id: "FILL_AND_OUTLINE",
                            name: i18next.t("models.tableStyling.label.selectableDimensions.style.options.fillAndOutline.name")
                        }
                    ],
                    setDimensionValue: (stratumId, value) => {
                        labelTraits.setTrait(stratumId, "style", value);
                    }
                },
                {
                    type: "numeric",
                    id: `${id}-scale`,
                    name: i18next.t("models.tableStyling.label.selectableDimensions.scale.name"),
                    value: (_d = labelTraits.scale) !== null && _d !== void 0 ? _d : nullValues.scale,
                    setDimensionValue: (stratumId, value) => {
                        labelTraits.setTrait(stratumId, "scale", value);
                    }
                },
                // Show style traits depending on `style`
                // three options "FILL", "FILL_AND_OUTLINE" and "OUTLINE"
                labelTraits.style === "FILL" ||
                    labelTraits.style === "FILL_AND_OUTLINE"
                    ? {
                        type: "color",
                        id: `${id}-fill-color`,
                        name: i18next.t("models.tableStyling.label.selectableDimensions.fillColor.name"),
                        value: (_e = labelTraits.fillColor) !== null && _e !== void 0 ? _e : nullValues.fillColor,
                        setDimensionValue: (stratumId, value) => {
                            labelTraits.setTrait(stratumId, "fillColor", value);
                        }
                    }
                    : undefined,
                labelTraits.style === "OUTLINE" ||
                    labelTraits.style === "FILL_AND_OUTLINE"
                    ? {
                        type: "color",
                        id: `${id}-outline-color`,
                        name: i18next.t("models.tableStyling.label.selectableDimensions.outlineColor.name"),
                        value: (_f = labelTraits.outlineColor) !== null && _f !== void 0 ? _f : nullValues.outlineColor,
                        setDimensionValue: (stratumId, value) => {
                            labelTraits.setTrait(stratumId, "outlineColor", value);
                        }
                    }
                    : undefined,
                labelTraits.style === "OUTLINE" ||
                    labelTraits.style === "FILL_AND_OUTLINE"
                    ? {
                        type: "numeric",
                        id: `${id}-outline-width`,
                        name: i18next.t("models.tableStyling.label.selectableDimensions.outlineWidth.name"),
                        value: (_g = labelTraits.outlineWidth) !== null && _g !== void 0 ? _g : nullValues.outlineWidth,
                        setDimensionValue: (stratumId, value) => {
                            labelTraits.setTrait(stratumId, "outlineWidth", value);
                        }
                    }
                    : undefined,
                {
                    type: "select",
                    id: `${id}-horizontal-origin`,
                    name: i18next.t("models.tableStyling.label.selectableDimensions.horizontalOrigin.name"),
                    selectedId: (_h = labelTraits.horizontalOrigin) !== null && _h !== void 0 ? _h : nullValues.horizontalOrigin,
                    options: [
                        {
                            id: "LEFT",
                            name: i18next.t("models.tableStyling.label.selectableDimensions.horizontalOrigin.options.left.name")
                        },
                        {
                            id: "CENTER",
                            name: i18next.t("models.tableStyling.label.selectableDimensions.horizontalOrigin.options.center.name")
                        },
                        {
                            id: "RIGHT",
                            name: i18next.t("models.tableStyling.label.selectableDimensions.horizontalOrigin.options.right.name")
                        }
                    ],
                    setDimensionValue: (stratumId, value) => {
                        labelTraits.setTrait(stratumId, "horizontalOrigin", value);
                    }
                },
                {
                    type: "select",
                    id: `${id}-vertical-origin`,
                    name: i18next.t("models.tableStyling.label.selectableDimensions.verticalOrigin.name"),
                    selectedId: (_j = labelTraits.verticalOrigin) !== null && _j !== void 0 ? _j : nullValues.verticalOrigin,
                    options: [
                        {
                            id: "TOP",
                            name: i18next.t("models.tableStyling.label.selectableDimensions.verticalOrigin.options.top.name")
                        },
                        {
                            id: "CENTER",
                            name: i18next.t("models.tableStyling.label.selectableDimensions.verticalOrigin.options.center.name")
                        },
                        {
                            id: "BASELINE",
                            name: i18next.t("models.tableStyling.label.selectableDimensions.verticalOrigin.options.baseline.name")
                        },
                        {
                            id: "BOTTOM",
                            name: i18next.t("models.tableStyling.label.selectableDimensions.verticalOrigin.options.bottom.name")
                        }
                    ],
                    setDimensionValue: (stratumId, value) => {
                        labelTraits.setTrait(stratumId, "verticalOrigin", value);
                    }
                },
                {
                    type: "numeric",
                    id: `${id}-pixel-offset-x`,
                    name: i18next.t("models.tableStyling.label.selectableDimensions.offsetX.name"),
                    value: (_k = labelTraits.pixelOffset[0]) !== null && _k !== void 0 ? _k : nullValues.pixelOffset[0],
                    setDimensionValue: (stratumId, value) => {
                        labelTraits.setTrait(stratumId, "pixelOffset", [
                            value !== null && value !== void 0 ? value : 0,
                            labelTraits.pixelOffset[1]
                        ]);
                    }
                },
                {
                    type: "numeric",
                    id: `${id}-pixel-offset-y`,
                    name: i18next.t("models.tableStyling.label.selectableDimensions.offsetY.name"),
                    value: (_l = labelTraits.pixelOffset[1]) !== null && _l !== void 0 ? _l : nullValues.pixelOffset[1],
                    setDimensionValue: (stratumId, value) => {
                        labelTraits.setTrait(stratumId, "pixelOffset", [
                            labelTraits.pixelOffset[0],
                            value !== null && value !== void 0 ? value : 0
                        ]);
                    }
                }
            ]);
        }, (labelTraits, nullValue, label) => label);
    }
    get trailDims() {
        return [
            ...this.getStyleDims("Trail style", "trail", this.tableStyle.trailStyleMap, (id, trailTraits, nullValues) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                return filterOutUndefined([
                    {
                        type: "numeric",
                        id: `${id}-lead-time`,
                        name: i18next.t("models.tableStyling.trail.selectableDimensions.leadTime.name"),
                        value: (_a = trailTraits.leadTime) !== null && _a !== void 0 ? _a : nullValues.leadTime,
                        setDimensionValue: (stratumId, value) => {
                            trailTraits.setTrait(stratumId, "leadTime", value);
                        }
                    },
                    {
                        type: "numeric",
                        id: `${id}-trail-time`,
                        name: i18next.t("models.tableStyling.trail.selectableDimensions.trailTime.name"),
                        value: (_b = trailTraits.trailTime) !== null && _b !== void 0 ? _b : nullValues.trailTime,
                        setDimensionValue: (stratumId, value) => {
                            trailTraits.setTrait(stratumId, "trailTime", value);
                        }
                    },
                    {
                        type: "numeric",
                        id: `${id}-width`,
                        name: i18next.t("models.tableStyling.trail.selectableDimensions.width.name"),
                        value: (_c = trailTraits.width) !== null && _c !== void 0 ? _c : nullValues.width,
                        setDimensionValue: (stratumId, value) => {
                            trailTraits.setTrait(stratumId, "width", value);
                        }
                    },
                    {
                        type: "numeric",
                        id: `${id}-resolution`,
                        name: i18next.t("models.tableStyling.trail.selectableDimensions.resolution.name"),
                        value: (_d = trailTraits.resolution) !== null && _d !== void 0 ? _d : nullValues.resolution,
                        setDimensionValue: (stratumId, value) => {
                            trailTraits.setTrait(stratumId, "resolution", value);
                        }
                    },
                    // Show material traits based on materialType
                    // "polylineGlow" or "solidColor"
                    ...(this.tableStyle.trailStyleMap.traits.materialType ===
                        "polylineGlow"
                        ? [
                            {
                                type: "color",
                                id: `${id}-glow-color`,
                                name: i18next.t("models.tableStyling.trail.selectableDimensions.growColor.name"),
                                value: (_e = trailTraits.polylineGlow.color) !== null && _e !== void 0 ? _e : (_f = nullValues.polylineGlow) === null || _f === void 0 ? void 0 : _f.color,
                                setDimensionValue: (stratumId, value) => {
                                    trailTraits.polylineGlow.setTrait(stratumId, "color", value);
                                }
                            },
                            {
                                type: "numeric",
                                id: `${id}-glow-power`,
                                name: i18next.t("models.tableStyling.trail.selectableDimensions.growPower.name"),
                                value: (_g = trailTraits.polylineGlow.glowPower) !== null && _g !== void 0 ? _g : (_h = nullValues.polylineGlow) === null || _h === void 0 ? void 0 : _h.glowPower,
                                setDimensionValue: (stratumId, value) => {
                                    trailTraits.polylineGlow.setTrait(stratumId, "glowPower", value);
                                }
                            },
                            {
                                type: "numeric",
                                id: `${id}-taper-power`,
                                name: i18next.t("models.tableStyling.trail.selectableDimensions.taperPower.name"),
                                value: (_j = trailTraits.polylineGlow.taperPower) !== null && _j !== void 0 ? _j : (_k = nullValues.polylineGlow) === null || _k === void 0 ? void 0 : _k.taperPower,
                                setDimensionValue: (stratumId, value) => {
                                    trailTraits.polylineGlow.setTrait(stratumId, "taperPower", value);
                                }
                            }
                        ]
                        : [
                            {
                                type: "color",
                                id: `${id}-solid-color`,
                                name: i18next.t("models.tableStyling.trail.selectableDimensions.solidColor.name"),
                                value: (_l = trailTraits.solidColor.color) !== null && _l !== void 0 ? _l : (_m = nullValues.solidColor) === null || _m === void 0 ? void 0 : _m.color,
                                setDimensionValue: (stratumId, value) => {
                                    trailTraits.solidColor.setTrait(stratumId, "color", value);
                                }
                            }
                        ])
                ]);
            }, (trail, nullValue, label) => label),
            {
                type: "group",
                id: "trail-style-options",
                name: i18next.t("models.tableStyling.trail.selectableDimensions.trailStyleOptions.name"),
                isOpen: false,
                selectableDimensions: filterOutUndefined([
                    {
                        type: "select",
                        id: "trail-style-options-material",
                        name: i18next.t("models.tableStyling.trail.selectableDimensions.trailStyleOptions.selectableDimensions.material.name"),
                        selectedId: this.tableStyle.trailStyleMap.traits.materialType,
                        options: [
                            {
                                id: "solidColor",
                                name: i18next.t("models.tableStyling.trail.selectableDimensions.trailStyleOptions.selectableDimensions.material.options.solidColor.name")
                            },
                            {
                                id: "polylineGlow",
                                name: i18next.t("models.tableStyling.trail.selectableDimensions.trailStyleOptions.selectableDimensions.material.options.polylineGlow.name")
                            }
                        ],
                        setDimensionValue: (stratumId, value) => {
                            var _a;
                            if (value === "solidColor" || value === "polylineGlow")
                                (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.trail.setTrait(stratumId, "materialType", value);
                        }
                    }
                ])
            }
        ];
    }
    get fillStyleDimensions() {
        return filterOutUndefined([
            // Only show color scheme selection if activeStyle exists
            this.item.activeStyle ? this.colorSchemeSelectableDim : undefined,
            // If we are in continuous realm:
            // - Display range
            this.colorSchemeType === "sequential-continuous" ||
                this.colorSchemeType === "diverging-continuous"
                ? this.displayRangeDim
                : undefined,
            // If we are in discrete realm:
            // - Bin maximums
            this.colorSchemeType === "sequential-discrete" ||
                this.colorSchemeType === "diverging-discrete" ||
                this.colorSchemeType === "custom-discrete"
                ? this.binColorDims
                : undefined,
            // If we are in qualitative realm
            this.colorSchemeType === "qualitative" ||
                this.colorSchemeType === "custom-qualitative"
                ? this.enumColorDims
                : undefined,
            this.additionalColorDimensions
        ]);
    }
    /** All of the dimensions! */
    get selectableDimensions() {
        var _a;
        return filterOutUndefined([
            this.tableStyleSelectableDim,
            ...(this.styleType === "fill" ? this.fillStyleDimensions : []),
            ...(this.styleType === "point" ? this.markerDims : []),
            ...(this.styleType === "outline" ? this.outlineDims : []),
            ...(this.styleType === "label" ? this.labelDims : []),
            ...(this.styleType === "trail" ? this.trailDims : []),
            this.styleType === "point-size" ? this.pointSizeDimensions : undefined,
            // Show region mapping dimensions if using region column and showing advanced options
            this.showAdvancedOptions &&
                this.styleType === "fill" &&
                ((_a = this.tableStyle.colorColumn) === null || _a === void 0 ? void 0 : _a.type) === TableColumnType.region
                ? this.advancedRegionMappingDimensions
                : undefined,
            // Show advanced table options
            ...(this.showAdvancedOptions ? this.advancedTableDimensions : [])
        ]);
    }
    /**
     * Set `TableColorStyleTraits.binMaximums`
     *
     * If the maximum value of the dataset is greater than the last value in this array, an additional bin is added automatically (See `TableColorStyleTraits.binMaximums`)
     * Because of this, we may need to update `maximumValue` so we don't get more bins added automatically
     */
    setBinMaximums(stratumId, binMaximums) {
        var _a;
        if (!binMaximums)
            binMaximums = [...this.tableStyle.tableColorMap.binMaximums];
        const colorTraits = (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color;
        if (binMaximums[binMaximums.length - 1] !==
            this.tableStyle.tableColorMap.maximumValue) {
            colorTraits === null || colorTraits === void 0 ? void 0 : colorTraits.setTrait(stratumId, "maximumValue", binMaximums[binMaximums.length - 1]);
        }
        colorTraits === null || colorTraits === void 0 ? void 0 : colorTraits.setTrait(stratumId, "binMaximums", binMaximums);
    }
    /** Clear binMaximums (which will automatically generate new ones based on numberOfBins, minimumValue and maximumValue).
     * Then set them have a sensible precision (otherwise there will be way too many digits).
     * This will also clear `minimumValue` and `maximumValue` */
    resetBinMaximums(stratumId) {
        var _a, _b, _c, _d;
        (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "minimumValue", undefined);
        (_b = this.getTableStyleTraits(stratumId)) === null || _b === void 0 ? void 0 : _b.color.setTrait(stratumId, "maximumValue", undefined);
        (_c = this.getTableStyleTraits(stratumId)) === null || _c === void 0 ? void 0 : _c.color.setTrait(stratumId, "binMaximums", undefined);
        const binMaximums = this.tableStyle.tableColorMap.binMaximums.map((bin) => {
            var _a;
            return parseFloat(bin.toFixed((_a = this.tableStyle.numberFormatOptions) === null || _a === void 0 ? void 0 : _a.maximumFractionDigits));
        });
        (_d = this.getTableStyleTraits(stratumId)) === null || _d === void 0 ? void 0 : _d.color.setTrait(stratumId, "binMaximums", binMaximums);
    }
    /** Set enum value and color for specific index in `enumColors` array */
    setEnumColorTrait(stratumId, index, value, color) {
        var _a;
        const enumColors = this.tableStyle.colorTraits.traits.enumColors.toJson(this.tableStyle.tableColorMap.enumColors);
        // Remove element if value and color are undefined
        if (!isDefined(value) && !isDefined(color))
            enumColors.splice(index, 1);
        else
            enumColors[index] = { value, color };
        (_a = this.getTableStyleTraits(stratumId)) === null || _a === void 0 ? void 0 : _a.color.setTrait(stratumId, "enumColors", enumColors);
    }
    /** Convenience getter for item.activeTableStyle */
    get tableStyle() {
        return this.item.activeTableStyle;
    }
    /** Get `TableStyleTraits` for the active table style (so we can call `setTraits`).
     */
    getTableStyleTraits(stratumId, id = this.tableStyle.id) {
        var _a, _b;
        if (id === "Default Style") {
            id = "User Style";
            runInAction(() => this.item.setTrait(stratumId, "activeStyle", "User Style"));
        }
        const style = (_b = (_a = this.item.styles) === null || _a === void 0 ? void 0 : _a.find((style) => style.id === id)) !== null && _b !== void 0 ? _b : this.item.addObject(stratumId, "styles", id);
        style === null || style === void 0 ? void 0 : style.setTrait(stratumId, "hidden", false);
        return style;
    }
    /** Get `TableColumnTraits` for the active table style `colorColumn` (so we can call `setTraits`) */
    getTableColumnTraits(stratumId) {
        var _a, _b, _c;
        if (!((_a = this.tableStyle.colorColumn) === null || _a === void 0 ? void 0 : _a.name))
            return;
        return ((_c = (_b = this.item.columns) === null || _b === void 0 ? void 0 : _b.find((col) => col.name === this.tableStyle.colorColumn.name)) !== null && _c !== void 0 ? _c : this.item.addObject(stratumId, "columns", this.tableStyle.colorColumn.name));
    }
}
Object.defineProperty(TableStylingWorkflow, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "table-styling"
});
export default TableStylingWorkflow;
__decorate([
    observable
], TableStylingWorkflow.prototype, "colorSchemeType", void 0);
__decorate([
    observable
], TableStylingWorkflow.prototype, "styleType", void 0);
__decorate([
    observable
], TableStylingWorkflow.prototype, "openBinIndex", void 0);
__decorate([
    computed
], TableStylingWorkflow.prototype, "menu", null);
__decorate([
    action
], TableStylingWorkflow.prototype, "setColorSchemeTypeFromPalette", null);
__decorate([
    action
], TableStylingWorkflow.prototype, "setColorSchemeType", null);
__decorate([
    observable
], TableStylingWorkflow.prototype, "showAdvancedOptions", void 0);
__decorate([
    computed
], TableStylingWorkflow.prototype, "tableStyleSelectableDim", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "colorSchemesForType", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "colorSchemeSelectableDim", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "minimumValueSelectableDim", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "displayRangeDim", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "binColorDims", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "enumColorDims", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "nullColorDimension", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "outlierColorDimension", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "additionalColorDimensions", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "pointSizeDimensions", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "advancedRegionMappingDimensions", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "advancedTableDimensions", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "markerDims", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "outlineDims", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "labelDims", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "trailDims", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "fillStyleDimensions", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "selectableDimensions", null);
__decorate([
    computed
], TableStylingWorkflow.prototype, "tableStyle", null);
function getColorPreview(col, label) {
    return `<div><div style="margin-bottom: -4px; width:20px; height:20px; display:inline-block; background-color:${col} ;"></div> ${label}</div>`;
}
//# sourceMappingURL=TableStylingWorkflow.js.map