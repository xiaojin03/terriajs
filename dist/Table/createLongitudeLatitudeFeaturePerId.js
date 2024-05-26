import Cartesian2 from "terriajs-cesium/Source/Core/Cartesian2";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Color from "terriajs-cesium/Source/Core/Color";
import Iso8601 from "terriajs-cesium/Source/Core/Iso8601";
import TimeInterval from "terriajs-cesium/Source/Core/TimeInterval";
import TimeIntervalCollection from "terriajs-cesium/Source/Core/TimeIntervalCollection";
import BillboardGraphics from "terriajs-cesium/Source/DataSources/BillboardGraphics";
import ColorMaterialProperty from "terriajs-cesium/Source/DataSources/ColorMaterialProperty";
import ConstantPositionProperty from "terriajs-cesium/Source/DataSources/ConstantPositionProperty";
import ConstantProperty from "terriajs-cesium/Source/DataSources/ConstantProperty";
import LabelGraphics from "terriajs-cesium/Source/DataSources/LabelGraphics";
import PathGraphics from "terriajs-cesium/Source/DataSources/PathGraphics";
import PointGraphics from "terriajs-cesium/Source/DataSources/PointGraphics";
import PolylineGlowMaterialProperty from "terriajs-cesium/Source/DataSources/PolylineGlowMaterialProperty";
import SampledPositionProperty from "terriajs-cesium/Source/DataSources/SampledPositionProperty";
import SampledProperty from "terriajs-cesium/Source/DataSources/SampledProperty";
import TimeIntervalCollectionPositionProperty from "terriajs-cesium/Source/DataSources/TimeIntervalCollectionPositionProperty";
import TimeIntervalCollectionProperty from "terriajs-cesium/Source/DataSources/TimeIntervalCollectionProperty";
import HeightReference from "terriajs-cesium/Source/Scene/HeightReference";
import TerriaFeature from "../Models/Feature/Feature";
import { getRowValues } from "./createLongitudeLatitudeFeaturePerRow";
import { getFeatureStyle } from "./getFeatureStyle";
import TableColumnType from "./TableColumnType";
/** For a given TimeProperties object, convert all PreSampledProperty to SampledProperty */
function convertPreSampledProperties(timeProperties) {
    if (!timeProperties)
        return {};
    return Object.entries(timeProperties).reduce((current, [key, value]) => {
        if (value instanceof PreSampledProperty) {
            const sampledProperty = value.getProperty();
            if (sampledProperty) {
                current[key] = sampledProperty;
            }
        }
        else if (value instanceof TimeIntervalCollectionProperty) {
            current[key] = value;
        }
        return current;
    }, {});
}
/** This class can be used in-place for Cesium's SampledProperty.
 *
 * It provides better performance as instead of calling `SampledProperty.addSample` for every sample, it will call `SampledProperty.addSamples` once with all samples.
 * This occurs when `PreSampledProperty.toSampledProperty()` is called
 **/
class PreSampledProperty {
    constructor(type) {
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: type
        });
        Object.defineProperty(this, "times", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "values", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "allValuesAreTheSame", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    getProperty() {
        if (this.allValuesAreTheSame) {
            return new ConstantProperty(this.values[0]);
        }
        const property = new SampledProperty(this.type);
        property.addSamples(this.times, this.values);
        return property;
    }
    addSample(time, value) {
        this.times.push(time);
        if (this.allValuesAreTheSame &&
            this.values.length > 1 &&
            value.toString() !== this.values[this.values.length - 2].toString()) {
            this.allValuesAreTheSame = false;
        }
        this.values.push(value);
    }
}
/** This class can be used in-place for Cesium's SampledPositionProperty.
 *
 * It behaves exactly the same as PreSampledProperty
 **/
class PreSampledPositionProperty {
    constructor() {
        Object.defineProperty(this, "times", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "values", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "allValuesAreTheSame", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    getProperty() {
        if (this.allValuesAreTheSame) {
            return new ConstantPositionProperty(this.values[0]);
        }
        const property = new SampledPositionProperty();
        property.addSamples(this.times, this.values);
        return property;
    }
    addSample(time, value) {
        this.times.push(time);
        if (this.allValuesAreTheSame &&
            this.values.length > 1 &&
            !value.equals(this.values[this.values.length - 2])) {
            this.allValuesAreTheSame = false;
        }
        this.values.push(value);
    }
}
/**
 * Create lat/lon features, one for each id group in the table
 */
export default function createLongitudeLatitudeFeaturePerId(style) {
    const features = [];
    for (let i = 0; i < style.rowGroups.length; i++) {
        const [featureId, rowIds] = style.rowGroups[i];
        features.push(createFeature(featureId, rowIds, style));
    }
    return features;
}
function createProperty(type, interpolate) {
    return interpolate
        ? new PreSampledProperty(type)
        : new TimeIntervalCollectionProperty();
}
function createFeature(featureId, rowIds, style) {
    const isSampled = !!style.isSampled;
    const tableHasScalarColumn = !!style.tableModel.tableColumns.find((col) => col.type === TableColumnType.scalar);
    const interpolate = isSampled && tableHasScalarColumn;
    const positionProperty = isSampled
        ? new PreSampledPositionProperty()
        : new TimeIntervalCollectionPositionProperty();
    // The following "TimeProperties<T>" objects are used to transform feature styling properties into time-enabled properties (eg SampledProperty or TimeIntervalCollectionProperty)
    // Required<T> is used as we need to make sure that all styling properties have a time-enabled property defined
    // See `getFeatureStyle` for "raw" feature styling properties
    const pointGraphicsTimeProperties = style.pointStyleMap.traits.enabled
        ? {
            color: createProperty(Color, interpolate),
            outlineColor: createProperty(Color, interpolate),
            pixelSize: createProperty(Number, interpolate),
            outlineWidth: createProperty(Number, interpolate),
            scaleByDistance: new TimeIntervalCollectionProperty(),
            disableDepthTestDistance: new TimeIntervalCollectionProperty()
        }
        : undefined;
    const billboardGraphicsTimeProperties = style.pointStyleMap.traits.enabled
        ? {
            image: new TimeIntervalCollectionProperty(),
            height: createProperty(Number, interpolate),
            width: createProperty(Number, interpolate),
            color: createProperty(Color, interpolate),
            rotation: createProperty(Number, interpolate),
            pixelOffset: createProperty(Cartesian2, interpolate),
            scaleByDistance: new TimeIntervalCollectionProperty(),
            disableDepthTestDistance: new TimeIntervalCollectionProperty()
        }
        : undefined;
    const pathGraphicsTimeProperties = style.trailStyleMap.traits.enabled
        ? {
            leadTime: createProperty(Number, interpolate),
            trailTime: createProperty(Number, interpolate),
            width: createProperty(Number, interpolate),
            resolution: createProperty(Number, interpolate)
        }
        : undefined;
    const pathGraphicsSolidColorTimeProperties = style.trailStyleMap.traits.enabled &&
        style.trailStyleMap.traits.materialType === "solidColor"
        ? {
            color: createProperty(Color, interpolate)
        }
        : undefined;
    const pathGraphicsPolylineGlowTimeProperties = style.trailStyleMap.traits.enabled &&
        style.trailStyleMap.traits.materialType === "polylineGlow"
        ? {
            color: createProperty(Color, interpolate),
            glowPower: createProperty(Number, interpolate),
            taperPower: createProperty(Number, interpolate)
        }
        : undefined;
    const labelGraphicsTimeProperties = style.labelStyleMap.traits.enabled
        ? {
            font: new TimeIntervalCollectionProperty(),
            text: new TimeIntervalCollectionProperty(),
            style: new TimeIntervalCollectionProperty(),
            scale: createProperty(Number, interpolate),
            fillColor: createProperty(Color, interpolate),
            outlineColor: createProperty(Color, interpolate),
            outlineWidth: createProperty(Number, interpolate),
            pixelOffset: createProperty(Cartesian2, interpolate),
            verticalOrigin: new TimeIntervalCollectionProperty(),
            horizontalOrigin: new TimeIntervalCollectionProperty(),
            scaleByDistance: new TimeIntervalCollectionProperty(),
            disableDepthTestDistance: new TimeIntervalCollectionProperty()
        }
        : undefined;
    const properties = new TimeIntervalCollectionProperty();
    const description = new TimeIntervalCollectionProperty();
    const longitudes = style.longitudeColumn.valuesAsNumbers.values;
    const latitudes = style.latitudeColumn.valuesAsNumbers.values;
    const timeIntervals = style.timeIntervals;
    const availability = new TimeIntervalCollection();
    const tableColumns = style.tableModel.tableColumns;
    /** use `PointGraphics` or `BillboardGraphics`. This wil be false if any pointTraits.marker !== "point", as then we use images as billboards */
    let usePointGraphicsForId = true;
    for (let i = 0; i < rowIds.length; i++) {
        const rowId = rowIds[i];
        const longitude = longitudes[rowId];
        const latitude = latitudes[rowId];
        const interval = timeIntervals[rowId];
        if (longitude === null || latitude === null || !interval) {
            continue;
        }
        addSampleOrInterval(positionProperty, Cartesian3.fromDegrees(longitude, latitude, 0.0), interval);
        const { pointGraphicsOptions, usePointGraphics, pathGraphicsOptions, pathGraphicsPolylineGlowOptions, pathGraphicsSolidColorOptions, labelGraphicsOptions, billboardGraphicsOptions } = getFeatureStyle(style, rowId);
        if (!usePointGraphics) {
            usePointGraphicsForId = false;
        }
        if (pointGraphicsTimeProperties && pointGraphicsOptions)
            // Copy all style object values across to time-enabled properties
            Object.entries(pointGraphicsOptions).forEach(([key, value]) => {
                if (key in pointGraphicsTimeProperties)
                    addSampleOrInterval(pointGraphicsTimeProperties[key], value, interval);
            });
        if (billboardGraphicsTimeProperties && billboardGraphicsOptions)
            Object.entries(billboardGraphicsOptions).forEach(([key, value]) => {
                if (key in billboardGraphicsTimeProperties)
                    addSampleOrInterval(billboardGraphicsTimeProperties[key], value, interval);
            });
        if (labelGraphicsTimeProperties && labelGraphicsOptions)
            Object.entries(labelGraphicsOptions).forEach(([key, value]) => {
                if (key in labelGraphicsTimeProperties)
                    addSampleOrInterval(labelGraphicsTimeProperties[key], value, interval);
            });
        if (pathGraphicsTimeProperties && pathGraphicsOptions)
            Object.entries(pathGraphicsOptions).forEach(([key, value]) => {
                if (key in pathGraphicsTimeProperties)
                    addSampleOrInterval(pathGraphicsTimeProperties[key], value, interval);
            });
        if (pathGraphicsSolidColorTimeProperties && pathGraphicsSolidColorOptions)
            Object.entries(pathGraphicsSolidColorOptions).forEach(([key, value]) => {
                if (key in pathGraphicsSolidColorTimeProperties)
                    addSampleOrInterval(pathGraphicsSolidColorTimeProperties[key], value, interval);
            });
        if (pathGraphicsPolylineGlowTimeProperties &&
            pathGraphicsPolylineGlowOptions)
            Object.entries(pathGraphicsPolylineGlowOptions).forEach(([key, value]) => {
                if (key in pathGraphicsPolylineGlowTimeProperties)
                    addSampleOrInterval(pathGraphicsPolylineGlowTimeProperties[key], value, interval);
            });
        // Feature properties/description
        addSampleOrInterval(properties, {
            ...getRowValues(rowId, tableColumns)
        }, interval);
        addSampleOrInterval(description, getRowDescription(rowId, tableColumns), interval);
        availability.addInterval(interval);
    }
    const show = calculateShow(availability);
    const feature = new TerriaFeature({
        position: 
        // positionProperty is either SampledPositionProperty or PreSampledPositionProperty
        // If it's PreSampledPositionProperty - we need to transform it to SampledPositionProperty by calling `getProperty()`
        positionProperty instanceof PreSampledPositionProperty
            ? positionProperty.getProperty()
            : positionProperty,
        point: usePointGraphicsForId
            ? new PointGraphics({
                ...convertPreSampledProperties(pointGraphicsTimeProperties),
                show,
                heightReference: HeightReference.CLAMP_TO_GROUND
            })
            : undefined,
        billboard: !usePointGraphicsForId
            ? new BillboardGraphics({
                ...convertPreSampledProperties(billboardGraphicsTimeProperties),
                heightReference: HeightReference.CLAMP_TO_GROUND,
                show
            })
            : undefined,
        path: pathGraphicsTimeProperties
            ? new PathGraphics({
                show,
                ...convertPreSampledProperties(pathGraphicsTimeProperties),
                // Material has to be handled separately from pathGraphicsTimeProperties
                material: pathGraphicsPolylineGlowTimeProperties
                    ? new PolylineGlowMaterialProperty(convertPreSampledProperties(pathGraphicsPolylineGlowTimeProperties))
                    : pathGraphicsSolidColorTimeProperties
                        ? new ColorMaterialProperty(convertPreSampledProperties(pathGraphicsSolidColorTimeProperties).color)
                        : undefined
            })
            : undefined,
        label: labelGraphicsTimeProperties
            ? new LabelGraphics({
                show,
                ...convertPreSampledProperties(labelGraphicsTimeProperties)
            })
            : undefined,
        availability
    });
    // Add properties to feature.data so we have access to TimeIntervalCollectionProperty outside of the PropertyBag.
    feature.data = {
        timeIntervalCollection: properties,
        rowIds,
        type: "terriaFeatureData"
    };
    feature.description = description;
    return feature;
}
function addSampleOrInterval(property, data, interval) {
    if (property instanceof PreSampledProperty ||
        property instanceof PreSampledPositionProperty) {
        property.addSample(interval.start, data);
    }
    else {
        const thisInterval = interval.clone();
        thisInterval.data = data;
        property === null || property === void 0 ? void 0 : property.intervals.addInterval(thisInterval);
    }
}
function calculateShow(availability) {
    const show = new TimeIntervalCollectionProperty();
    if (availability.start) {
        const start = availability.start;
        const stop = availability.stop;
        show.intervals.addInterval(new TimeInterval({
            start: Iso8601.MINIMUM_VALUE,
            stop: Iso8601.MAXIMUM_VALUE,
            data: false
        }));
        show.intervals.addInterval(new TimeInterval({ start, stop, data: true }));
    }
    else {
        show.intervals.addInterval(new TimeInterval({
            start: Iso8601.MINIMUM_VALUE,
            stop: Iso8601.MAXIMUM_VALUE,
            data: true
        }));
    }
    return show;
}
function getRowDescription(index, tableColumns) {
    const rows = tableColumns
        .map((column) => {
        const title = column.title;
        const value = column.valueFunctionForType(index);
        return `<tr><td>${title}</td><td>${value}</td></tr>`;
    })
        .join("\n");
    return `<table class="cesium-infoBox-defaultTable">${rows}</table>`;
}
//# sourceMappingURL=createLongitudeLatitudeFeaturePerId.js.map