import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import Terria from "terriajs/lib/Models/Terria";
import styled from "styled-components";
import Box from "terriajs/lib/Styled/Box";
import { TextSpan } from "terriajs/lib/Styled/Text";
import Button from "terriajs/lib/Styled/Button";
import Icon, { StyledIcon } from "terriajs/lib/Styled/Icon";

import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import GeoJsonCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/GeoJsonCatalogItem";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import createStratumInstance from "terriajs/lib/Models/Definition/createStratumInstance";
import StyleTraits from "terriajs/lib/Traits/TraitsClasses/StyleTraits";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";

interface IPointSelectProps {
  viewState: ViewState;
  terria: Terria;
}

export const PointSelect: React.FC<IPointSelectProps> = observer(({ viewState, terria }) => {
  // 使用useState来保存变量的状态，防止useEffect重新渲染后恢复初始状态
  const [pointAvailable, setPointAvailable] = useState(false);

  // 点查询的开关
  const pointFunc = () => {
    // 关闭信息框
    terria.allowFeatureInfoRequests = false;
    setPointAvailable(!pointAvailable);
    viewState.searchRangeClear();
  }

  // 坐标转换：3D笛卡尔坐标类 -> 经纬度坐标类
  const coorTrans = (cartesianPosition: Cartesian3) => {
    const cartographic = Ellipsoid.WGS84.cartesianToCartographic(cartesianPosition);
    const longitude = CesiumMath.toDegrees(cartographic.longitude);
    const latitude = CesiumMath.toDegrees(cartographic.latitude);
    return { longitude, latitude };
  }

    // 根据参数提供的经纬度坐标，绘制点
  const drawPoint = (longitude: number, latitude: number) => {
    // 清除之前添加的覆盖物
    terria.overlays.removeAll();

    const pointMark = new GeoJsonCatalogItem(createGuid(), terria);
    pointMark.setTrait(CommonStrata.user, "geoJsonData", {
      type: "Feature",
      properties: {
        longitude: longitude,
        latitude: latitude
      },
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude]
      }
    });

    // Need to specify rectangle for ideal zoom to work properly in 3D map.
    const closeUpRange = 0.002;
    pointMark.setTrait(
      CommonStrata.user,
      "rectangle",
      new Rectangle(
        longitude - closeUpRange,
        latitude - closeUpRange,
        longitude + closeUpRange,
        latitude + closeUpRange
      )
    );

    pointMark.setTrait(
      CommonStrata.user,
      "style",
      createStratumInstance(StyleTraits, {
        "marker-size": "25",
        "marker-color": "#08ABD5",
        stroke: "#ffffff",
        "stroke-width": 3
      })
    );

    terria.overlays.add(pointMark);
  }

  // 使用useEffect, 当pickedFeatures变化时，自动执行函数
  useEffect(() => {
    if (pointAvailable) {
      const pickPosition = terria.pickedFeatures?.pickPosition;

      if (pickPosition != undefined) {
        viewState.pickPosition = coorTrans(pickPosition);

        if (viewState.pickPosition.longitude !== undefined &&
          viewState.pickPosition.latitude !== undefined) {
            drawPoint(viewState.pickPosition.longitude, viewState.pickPosition.latitude);
          }
          
        setPointAvailable(!pointAvailable);
        terria.allowFeatureInfoRequests = true;
      }
    }
  }, [terria.pickedFeatures])

  return (
    <Box gap>
      <p style={{ margin: 0, width: 20, height: 20 }}>点:</p> 
      <button onClick={pointFunc}
        style={{ border: '0', padding: '0', height: 20, width: 20}}>
        <StyledIcon glyph={Icon.GLYPHS.point} 
          styledWidth={"20px"} 
          styledHeight={"20px"}
        />
      </button>
      
    </Box>
  );
});