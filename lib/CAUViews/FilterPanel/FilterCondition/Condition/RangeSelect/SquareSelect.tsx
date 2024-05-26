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
import TableStyleTraits from "terriajs/lib/Traits/TraitsClasses/Table/StyleTraits";
import TableOutlineStyleTraits, { OutlineSymbolTraits } from "terriajs/lib/Traits/TraitsClasses/Table/OutlineStyleTraits";
import TableColorStyleTraits from "terriajs/lib/Traits/TraitsClasses/Table/ColorStyleTraits";

interface ISquareSelectProps {
  viewState: ViewState;
  terria: Terria;
}

export const SquareSelect: React.FC<ISquareSelectProps> = observer(({ viewState, terria }) => {
  // 使用useState来保存变量的状态，防止useEffect重新渲染后恢复初始状态
  const [count, setCount] = useState(0);
  const [squareAvailable, setSquareAvailable] = useState(false);

  // 矩形查询的开关
  const squareFunc = () => {
    setSquareAvailable(!squareAvailable);
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

  // 记录第二个点的坐标，并跟第一个点比较，排好大小顺序
  const recordPoint = (longitude: number, latitude: number) => {
    if (viewState.squarePosition.left !== undefined &&
        viewState.squarePosition.top !== undefined
    ) {
      if (longitude > viewState.squarePosition.left) {
        viewState.squarePosition.right = longitude;
      } else {
        viewState.squarePosition.right = viewState.squarePosition.left;
        viewState.squarePosition.left = longitude;
      }

      if (latitude < viewState.squarePosition.top) {
        viewState.squarePosition.bottom = latitude;
      } else {
        viewState.squarePosition.bottom = viewState.squarePosition.top;
        viewState.squarePosition.top = latitude;
      }
    }
  }

  // 绘制矩形
  const drawSquare = () => {
    const left = viewState.squarePosition.left;
    const bottom = viewState.squarePosition.bottom;
    const right = viewState.squarePosition.right;
    const top = viewState.squarePosition.top;
    // console.log(viewState.squarePosition);

    const squareCoor = [
      [left, top],
      [right, top],
      [right, bottom],
      [left, bottom],
      [left, top],
    ]

    const squareItem = new GeoJsonCatalogItem(createGuid(), terria);
    squareItem.setTrait(CommonStrata.user, "geoJsonData", {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [squareCoor]
      }
    });

    squareItem.setTrait(
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

    squareItem.setTrait(CommonStrata.user, "opacity", 0.2);

    terria.overlays.add(squareItem);
  }

  // 使用useEffect, 当pickedFeatures变化时，自动执行函数
  useEffect(() => {
    if (squareAvailable) {
      if (count === 0) {
        // 清除之前绘制的点、面
        terria.overlays.removeAll();

        const pickPosition = terria.pickedFeatures?.pickPosition;
        
        if (pickPosition != undefined) {
          const { longitude, latitude } = coorTrans(pickPosition);
          
          viewState.squarePosition.left = longitude;
          viewState.squarePosition.top = latitude;

          drawPoint(longitude, latitude);
        }
  
        setCount(count + 1);
      } else {
        const pickPosition = terria.pickedFeatures?.pickPosition;
        
        if (pickPosition != undefined) {
          const { longitude, latitude } = coorTrans(pickPosition);
          drawPoint(longitude, latitude);
          recordPoint(longitude, latitude);
          drawSquare();
        }
        setCount(0);
        setSquareAvailable(!squareAvailable);
      }
    }
  }, [terria.pickedFeatures])

  return (
    <Box gap>
      <p style={{ margin: 0, width: 33, height: 20 }}>矩形:</p> 
      <button onClick={squareFunc}
        style={{ border: '0', padding: '0', height: 20, width: 20}}>
        <StyledIcon glyph={Icon.GLYPHS.rect} 
          styledWidth={"20px"} 
          styledHeight={"20px"}
        />
      </button>
    </Box>
  );
});