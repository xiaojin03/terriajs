import primitiveTrait from "../Decorators/primitiveTrait";
import { traitClass } from "../Trait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import { GeoJsonTraits } from "./GeoJsonTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import UrlTraits from "./UrlTraits";

@traitClass({
  description: `Creates a single item in the catalog from one ESRI WFS layer.

  <strong>Note:</strong> <i>Must specify <b>layer ID</b>, e.g. <code>/0</code>, in the URL path.</i>`,
  example: {
    url: "https://services5.arcgis.com/OvOcYIrJnM97ABBA/arcgis/rest/services/Australian_Public_Hospitals_WFL1/FeatureServer/0",
    type: "esri-featureServer",
    name: "Australian Public Hospitals",
    id: "some id"
  }
})
export default class ArcGisFeatureServerCatalogItemTraits extends mixTraits(
  UrlTraits,
  MappableTraits,
  CatalogMemberTraits,
  LegendOwnerTraits,
  GeoJsonTraits
) {
  @primitiveTrait({
    type: "boolean",
    name: "Clamp to Ground",
    description:
      "Whether the features in this service should be clamped to the terrain surface."
  })
  clampToGround: boolean = true;

  @primitiveTrait({
    type: "boolean",
    name: "Use style information from service",
    description:
      "Whether to symbolise the data using the drawingInfo object available in the service endpoint."
  })
  useStyleInformationFromService: boolean = true;

  @primitiveTrait({
    type: "string",
    name: "layerDef",
    description:
      "DEPRECATED, use `where` instead. The 'layerDef' string to pass to the server when requesting geometry."
  })
  layerDef: string = "1=1";

  @primitiveTrait({
    type: "string",
    name: "Where clause",
    description:
      "The 'where' string to pass to the server when requesting geometry."
  })
  where: string = "1=1";

  @primitiveTrait({
    type: "number",
    name: "Maximum features",
    description:
      "The maximum number of features to be retrieved from the feature service."
  })
  maxFeatures: number = 5000;

  @primitiveTrait({
    type: "number",
    name: "Features per request",
    description:
      "The number of features to be retrieved from the feature service in each request. This should be equal to the " +
      "maxRecordCount specified by the server."
  })
  featuresPerRequest: number = 1000;

  @primitiveTrait({
    type: "boolean",
    name: "Supports pagination",
    description:
      "Whether this feature service supports pagination. By default, this will be inferred from the server's response."
  })
  supportsPagination?: boolean;
}
