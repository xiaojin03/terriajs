"use strict";
import i18next from "i18next";
import React from "react";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import EllipsoidGeodesic from "terriajs-cesium/Source/Core/EllipsoidGeodesic";
import EllipsoidTangentPlane from "terriajs-cesium/Source/Core/EllipsoidTangentPlane";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import PolygonGeometryLibrary from "terriajs-cesium/Source/Core/PolygonGeometryLibrary";
import PolygonHierarchy from "terriajs-cesium/Source/Core/PolygonHierarchy";
import VertexFormat from "terriajs-cesium/Source/Core/VertexFormat";
import CustomDataSource from "terriajs-cesium/Source/DataSources/CustomDataSource";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import Terria from "terriajs/lib/Models/Terria";
import UserDrawing from "terriajs/lib/Models/UserDrawing";

import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";
import GeoJsonCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/GeoJsonCatalogItem";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import createStratumInstance from "terriajs/lib/Models/Definition/createStratumInstance";
import StyleTraits from "terriajs/lib/Traits/TraitsClasses/StyleTraits";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import TableStyleTraits from "terriajs/lib/Traits/TraitsClasses/Table/StyleTraits";
import TableOutlineStyleTraits, { OutlineSymbolTraits } from "terriajs/lib/Traits/TraitsClasses/Table/OutlineStyleTraits";
import TableColorStyleTraits from "terriajs/lib/Traits/TraitsClasses/Table/ColorStyleTraits";

interface PolygonSelectProps {
  viewState: ViewState;
  terria: Terria;
}

export default class PolygonSelectClass {
  private readonly viewState: ViewState;
  private readonly terria: Terria;
  private userDrawing: UserDrawing;
  public polygonList: number[][] = [];

  constructor(props: PolygonSelectProps) {
    this.viewState = props.viewState;
    this.terria = props.terria;
    this.userDrawing = new UserDrawing({
      terria: props.terria,
      messageHeader: () => i18next.t("develop.polygonSelect"),
      allowPolygon: true,
      onPointClicked: this.onPointClicked.bind(this),
      onPointMoved: this.onPointMoved.bind(this),
      onCleanUp: this.onCleanUp.bind(this),
    });
  }

  updateList(pointEntities: CustomDataSource) {
    // this.userDrawing.getPointsForShape();
    if (pointEntities.entities.values.length < 1) {
      return;
    }

    this.polygonList = [];
    for (let i = 0; i < pointEntities.entities.values.length; i++) {
      const point = pointEntities.entities.values[i];
      const pointPos = point.position!.getValue(this.terria.timelineClock.currentTime);

      if (pointPos !== undefined) {
        const cartographic = Ellipsoid.WGS84.cartesianToCartographic(pointPos);
        const longitude = CesiumMath.toDegrees(cartographic.longitude);
        const latitude = CesiumMath.toDegrees(cartographic.latitude);
        this.polygonList.push([longitude, latitude]);
      }
    }

    // 如果多边形闭合了，就停止绘图
    if (this.userDrawing.closeLoop) {
      // (暂时)将数组打印出来
      // console.log(this.polygonList);
      this.drawPolygon();
      this.deactivate();
    }
  }

  onCleanUp() {
    // UserDrawing类中endDrawing方法中包含了cleanUp方法，cleanUp方法又包含了onCleanUp()方法
    // 若在此调用endDrawing方法会导致无限递归，所以这里不要调用endDrawing方法和cleanUp方法
  }

  onPointClicked(pointEntities: CustomDataSource) {
    this.updateList(pointEntities);
  }

  onPointMoved(pointEntities: CustomDataSource) {
    // This is no different to clicking a point.
    this.onPointClicked(pointEntities);
  }

  deactivate() {
    this.userDrawing.endDrawing();
  }

  activate() {
    this.userDrawing.enterDrawMode();
  }

  drawPolygon() {
    if (this.polygonList.length < 2) {
      return;
    }

    let polygonCoor = [];
    for (let i = 0; i < this.polygonList.length; i++) {
      const longitude = this.polygonList[i][0];
      const latitude = this.polygonList[i][1];
      polygonCoor.push([longitude, latitude]);
    }
    polygonCoor.push(polygonCoor[0]);

    this.viewState.polygonPosition = polygonCoor;

    const polygonItem = new GeoJsonCatalogItem(createGuid(), this.terria);
    polygonItem.setTrait(CommonStrata.user, "geoJsonData", {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [polygonCoor]
      }
    });

    polygonItem.setTrait(
      CommonStrata.user,
      "defaultStyle",
      createStratumInstance(TableStyleTraits, {
        outline: createStratumInstance(TableOutlineStyleTraits, {
          null: createStratumInstance(OutlineSymbolTraits, {
            width: 4,
            color: "#000000"
          })
        }),
        color: createStratumInstance(TableColorStyleTraits, {
          nullColor: "rgb(0,255,255)"
        })
      })
    );

    polygonItem.setTrait(CommonStrata.user, "opacity", 0.2);

    this.terria.overlays.add(polygonItem);
  }

}