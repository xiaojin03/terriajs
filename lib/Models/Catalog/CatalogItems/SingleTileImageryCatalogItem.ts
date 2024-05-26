import { computed, makeObservable, observable, runInAction } from "mobx";
import SingleTileImageryProvider from "terriajs-cesium/Source/Scene/SingleTileImageryProvider";
import isDefined from "../../../Core/isDefined";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin, { MapItem } from "../../../ModelMixins/MappableMixin";
import SingleTileImageryCatalogItemTraits from "../../../Traits/TraitsClasses/SingleTileImageryCatalogItemTraits";
import { ModelConstructorParameters } from "../../Definition/Model";
import CreateModel from "../../Definition/CreateModel";

export default class SingleTileImageryCatalogItem extends MappableMixin(
  CatalogMemberMixin(CreateModel(SingleTileImageryCatalogItemTraits))
) {
  static readonly type = "single-tile-imagery";

  constructor(...args: ModelConstructorParameters) {
    super(...args);
    makeObservable(this);
  }

  get type() {
    return SingleTileImageryCatalogItem.type;
  }

  protected forceLoadMapItems(): Promise<void> {
    return Promise.resolve();
  }

  @computed get mapItems(): MapItem[] {
    const imageryProvider = this.imageryProvider;
    if (!isDefined(imageryProvider)) {
      return [];
    }
    return [
      {
        show: this.show,
        alpha: this.opacity,
        imageryProvider,
        clippingRectangle: this.clipToRectangle
          ? this.cesiumRectangle
          : undefined
      }
    ];
  }

  @computed get imageryProvider() {
    if (!isDefined(this.url)) {
      return;
    }

    return new SingleTileImageryProvider({
      url: this.url,
      credit: this.attribution
    });
  }
}
