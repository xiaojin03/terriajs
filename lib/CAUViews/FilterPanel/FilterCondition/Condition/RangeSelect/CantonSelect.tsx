import React, { FC, useState, useEffect } from "react";
import { observer } from "mobx-react";
import { runInAction } from "mobx";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import Terria from "terriajs/lib/Models/Terria";
import { Province } from "terriajs/lib/CAUViews/InlineData/Province";
import { City } from "terriajs/lib/CAUViews/InlineData/City";
import { Area } from "terriajs/lib/CAUViews/InlineData/Area";

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

interface ICantonSelectProps {
  viewState: ViewState;
  terria: Terria;
}

export const CantonSelect: React.FC<ICantonSelectProps> = observer(({viewState, terria}) => {

  let cityArr: Array<{ 
    code: string, 
    name: string, 
    province: string, 
    city: string
  }> = [];

  let areaArr: Array<{
    code: string, 
    name: string, 
    province: string, 
    city: string,
    area: string
  }> = [];

  const [proCode, setProCode] = useState("000000");
  const [cityCode, setCityCode] = useState("000000");
  const [areaCode, setAreaCode] = useState("000000");
  const [CityArr, setCityArr] = useState(cityArr);
  const [AreaArr, setAreaArr] = useState(areaArr);

  // 选择省市县时，调用该函数使视图移动到具体区域位置

  // 向后端发送请求,获取行政区数组,绘制行政区域
  const drawCanton = async(targetName: string) => {
    // 先对之前存储的行政区数组和地图选择数组清零
    viewState.searchRangeClear();

    try {
      const response = await fetch("http://10.106.12.19:8101/yls/area/searchRegionCoordinates",{
        method: "Post",
        headers: {
          "Content-Type": "text/plain"
        },
        body: targetName
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      // 异步返回的数组赋值要使用runInAction
      runInAction(() => {
        viewState.districtArr = result.data;
      });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }

    // 清除之前添加的覆盖物
    terria.overlays.removeAll();

    const polygonItem = new GeoJsonCatalogItem(createGuid(), terria);
    polygonItem.setTrait(CommonStrata.user, "geoJsonData", {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: viewState.districtArr
      }
    });

    polygonItem.setTrait(
      CommonStrata.user,
      "defaultStyle",
      createStratumInstance(TableStyleTraits, {
        outline: createStratumInstance(TableOutlineStyleTraits, {
          null: createStratumInstance(OutlineSymbolTraits, {
            width: 4,
            color: terria.baseMapContrastColor
          })
        }),
        color: createStratumInstance(TableColorStyleTraits, {
          nullColor: "rgb(0,255,255)"
        })
      })
    );

    polygonItem.setTrait(CommonStrata.user, "opacity", 0.2);

    terria.addModel(polygonItem);
    terria.overlays.add(polygonItem);
  }

  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProCode(event.target.value);
    setCityCode("000000");
    setAreaCode("000000");
    setCityArr([]);
    setAreaArr([]);
    
    const proItem = Province.find((province) => province.code === event.target.value);

    if (proItem !== undefined) {
      // handleViewChange(event.target.value); // 视图定位
      drawCanton(proItem.name); // 绘制行政区
    }

    City.map((city) => {
      if (city.province === proItem?.province) {
        cityArr.push(city);
      }
    });

    setCityArr(cityArr);
  }

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCityCode(event.target.value);
    setAreaCode("000000");
    setAreaArr([]);
    
    const cityItem = City.find((city) => city.code === event.target.value);
    
    if (cityItem !== undefined) {
      // handleViewChange(event.target.value); // 视图定位
      drawCanton(cityItem.name); // 绘制行政区
    }

    Area.map((area) => {
      if (area.province === cityItem?.province && area.city === cityItem?.city) {
        areaArr.push(area);
      }
    });
    setAreaArr(areaArr);
  }

  const handleAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAreaCode(event.target.value);

    const areaItem = Area.find((area) => area.code === event.target.value);

    if (areaItem !== undefined) {
      // handleViewChange(event.target.value); // 视图定位
      drawCanton(areaItem.name); // 绘制行政区
    }
  }

  useEffect(() => {
    cityArr = [];
    areaArr = [];    
  }, [CityArr, AreaArr])

  return (
    <div
      css={`
        display: flex;
      `}
    >
      <p style={{ margin: 0, width: 80, height: 25 }}>行政区：</p>
      <div>  
        <select 
          style={{ width: 100, height: 25 }} 
          value={proCode}
          onChange={handleProvinceChange}
        >
          <option key={"000000"} value={"000000"}>省直辖市</option>
          {Province.map((province) => (  
            <option key={province.code} value={province.code}>{province.name}</option>
          ))}
        </select>

        <select 
          style={{ width: 100, height: 25 }} 
          value={cityCode}
          onChange={handleCityChange}
        >
          <option key={"000000"} value={"000000"}>地级市州</option>
          {CityArr.map((city) => (  
            <option key={city.code} value={city.code}>{city.name}</option>
          ))}
        </select>

        <select 
          style={{ width: 100, height: 25 }} 
          value={areaCode}
          onChange={handleAreaChange}
        >
          <option key={"000000"} value={"000000"}>区县旗</option>
          {AreaArr.map((area) => (  
            <option key={area.code} value={area.code}>{area.name}</option>
          ))}
        </select> 
      </div> 
    </div>
  );
});
