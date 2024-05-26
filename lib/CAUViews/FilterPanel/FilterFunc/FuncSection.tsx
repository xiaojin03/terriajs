import React, { FC, useState } from "react";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import styled from "styled-components";

import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import Terria from "terriajs/lib/Models/Terria";
import Box from "terriajs/lib/Styled/Box";
import { TextSpan } from "terriajs/lib/Styled/Text";
import Button from "terriajs/lib/Styled/Button";
import Spacing from "terriajs/lib/Styled/Spacing";

import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";
import GeoJsonCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/GeoJsonCatalogItem";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import createStratumInstance from "terriajs/lib/Models/Definition/createStratumInstance";
import StyleTraits from "terriajs/lib/Traits/TraitsClasses/StyleTraits";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import TableStyleTraits from "terriajs/lib/Traits/TraitsClasses/Table/StyleTraits";
import TableOutlineStyleTraits, { OutlineSymbolTraits } from "terriajs/lib/Traits/TraitsClasses/Table/OutlineStyleTraits";
import TableColorStyleTraits from "terriajs/lib/Traits/TraitsClasses/Table/ColorStyleTraits";

// 导入内置测试数据
import { ArrDataTest1 } from "terriajs/lib/CAUViews/InlineData/ArrDataTest1";
import { ArrDataTest2 } from "terriajs/lib/CAUViews/InlineData/ArrDataTest2";

interface IFuncSectionProps {
  viewState: ViewState;
  terria: Terria;
}

export const FuncSection: FC<IFuncSectionProps> = observer(({ viewState, terria }) => {
  const { t } = useTranslation();

  // 后端数据范围路径
  const backendPath = "http://10.106.12.19:8101/yls/area/searchDataset";
  const backend = backendPath;

  // 通过后端返回的数组，给所有数据组合一起，绘制一个多边形
  const addSearchRange = () => {
    terria.overlays.removeAll();

    // 修改为循环读取数据添加到coordinates中，再统一添加到一个实体上。
    let coorArray: number[][][] = [];
    viewState.ArrData.map(data => {
      const currCoor = [
        [data.left, data.top],
        [data.right, data.top],
        [data.right, data.bottom],
        [data.left, data.bottom],
        [data.left, data.top]
      ];
      coorArray.push(currCoor);
    })

    const polygonItem = new GeoJsonCatalogItem(createGuid(), terria);
    polygonItem.setTrait(CommonStrata.user, "geoJsonData", {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: coorArray
      }
    });
    polygonItem.setTrait(
      CommonStrata.user,
      "defaultStyle",
      createStratumInstance(TableStyleTraits, {
        outline: createStratumInstance(TableOutlineStyleTraits, {
          null: createStratumInstance(OutlineSymbolTraits, {
            width: 4,
            color: "#0000FF"
          })
        }),
        color: createStratumInstance(TableColorStyleTraits, {
          nullColor: "rgba(0,0,0,0)"
        })
      })
    );
    terria.overlays.add(polygonItem);
  }

  // 根据检索范围向后端请求数据函数
  const searchRangePost = async (searchRange: any) => {
    try {
      const response = await fetch(backend,{
        method: "Post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(searchRange)
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      // 异步返回的数组赋值要使用runInAction
      runInAction(() => {
        viewState.ArrData = result.data;
      });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const onSearchButtonClick = async() => {
    // 不连接后端时，使用内置测试数据调试功能
    // if (viewState.ArrData.length === ArrDataTest1.length) {
    //   viewState.ArrData = ArrDataTest2;
    // } else {
    //   viewState.ArrData = ArrDataTest1;
    // }

    // 获取检索条件
    // 检索范围，用于点选、矩形、多边形范围检索
    let searchRange;
    // 根据行政区范围检索
    if (viewState.districtArr.length > 0) {
      searchRange = {
        "corrdinates": viewState.districtArr
      }
    }

    // 根据点选位置检索
    if (viewState.pickPosition.longitude !== undefined &&
        viewState.pickPosition.latitude !== undefined
      ) {
      const longitude = viewState.pickPosition.longitude;
      const latitude = viewState.pickPosition.latitude;
      const closeUpRange = 0.002;

      searchRange = {
        "corrdinates":[
          [longitude - closeUpRange, latitude + closeUpRange],
          [longitude + closeUpRange, latitude + closeUpRange],
          [longitude + closeUpRange, latitude - closeUpRange],
          [longitude - closeUpRange, latitude - closeUpRange],
          [longitude - closeUpRange, latitude + closeUpRange],
        ]
      }
    }

    // 根据矩形范围检索
    if (viewState.squarePosition.left !== undefined &&
        viewState.squarePosition.right !== undefined &&
        viewState.squarePosition.top !== undefined &&
        viewState.squarePosition.bottom !== undefined) {

      const left = viewState.squarePosition.left;
      const right = viewState.squarePosition.right;
      const top = viewState.squarePosition.top;
      const bottom = viewState.squarePosition.bottom;

      searchRange = {
        "corrdinates":[
          [left, top],
          [right, top],
          [right, bottom],
          [left, bottom],
          [left, top],
        ]
      }
    }

    // 根据多边形范围检索
    if (viewState.polygonPosition.length > 0) {
      const coordinates = viewState.polygonPosition;

      searchRange = {
        "corrdinates": coordinates
      }
    }

    // 连接后端时，异步请求数据
    await searchRangePost(searchRange);

    // 异步获取数据后，再打开右侧面板显示数据
    if (!viewState.dataBuilderShown) {
      viewState.toggleDataBuilder();
    }

    // 绘制检索的范围到地图上
    addSearchRange();
  }

  return (
    <Box column>
      <TextSpan medium>{t("develop.searchTitle")}</TextSpan>
      <Explanation>{t("develop.searchExplanation")}</Explanation>
      <Box gap>
        <FuncButton
          primary
          fullWidth
          onClick={onSearchButtonClick}
        >
          <TextSpan medium>{t("develop.btnSearchClick")}</TextSpan>
        </FuncButton>
        <FuncButton
          primary
          fullWidth
          onClick={() => {
            
          }}
        >
          <TextSpan medium>{t("develop.btnDownloadData")}</TextSpan>
        </FuncButton>
      </Box>
    </Box>
  );
});

const FuncButton = styled(Button)`
  border-radius: 4px;
`;

const Explanation = styled(TextSpan)`
  opacity: 0.8;
`;