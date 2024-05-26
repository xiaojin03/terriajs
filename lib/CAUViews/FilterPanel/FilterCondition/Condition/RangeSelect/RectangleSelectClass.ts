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

interface RectangleSelectProps {
  viewState: ViewState;
  terria: Terria;
}

export default class RectangleSelectClass {
  private readonly viewState: ViewState;
  private readonly terria: Terria;
  private userDrawing: UserDrawing;
  public rectangleList: number[][] = [];

  constructor(props: RectangleSelectProps) {
    this.viewState = props.viewState;
    this.terria = props.terria;
    this.userDrawing = new UserDrawing({
      terria: props.terria,
      messageHeader: () => i18next.t("develop.RectangleSelect"),
      drawRectangle: true,
      onPointClicked: this.onPointClicked.bind(this),
      onPointMoved: this.onPointMoved.bind(this),
      onCleanUp: this.onCleanUp.bind(this),
    });
  }

  onCleanUp() {
    // UserDrawing类中endDrawing方法中包含了cleanUp方法，cleanUp方法又包含了onCleanUp()方法
    // 若在此调用endDrawing方法会导致无限递归，所以这里不要调用endDrawing方法和cleanUp方法
  }

  onPointClicked(pointEntities: CustomDataSource) {
    // 定位坐标
    const rec = this.userDrawing.getRectangleForShape();
    
    if (rec != undefined) {
      // 转换数据坐标
      const left = CesiumMath.toDegrees(rec.west);
      const bottom = CesiumMath.toDegrees(rec.south);
      const right = CesiumMath.toDegrees(rec.east);
      const top = CesiumMath.toDegrees(rec.north);
      this.viewState.squarePosition = {left, bottom, right, top};
    }
    
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
}