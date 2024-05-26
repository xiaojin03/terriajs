import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import Terria from "terriajs/lib/Models/Terria";
import Styles from "terriajs/lib/ReactViews/Map/Panels/panel.scss";
import Box from "terriajs/lib/Styled/Box";
import Text, { TextSpan } from "terriajs/lib/Styled/Text";
import Icon, { StyledIcon } from "terriajs/lib/Styled/Icon";
import Spacing from "terriajs/lib/Styled/Spacing";
import styled from "styled-components";
import Button from "terriajs/lib/Styled/Button";

import SingleTileImageryCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/SingleTileImageryCatalogItem";
import CzmlCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/CzmlCatalogItem";
import CsvCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/CsvCatalogItem";
import GeoJsonCatalogItem from "terriajs/lib/Models/Catalog/CatalogItems/GeoJsonCatalogItem";
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";
import createStratumInstance from "terriajs/lib/Models/Definition/createStratumInstance";
import TableStyleTraits from "terriajs/lib/Traits/TraitsClasses/Table/StyleTraits";
import TableOutlineStyleTraits, { OutlineSymbolTraits } from "terriajs/lib/Traits/TraitsClasses/Table/OutlineStyleTraits";
import TableColorStyleTraits from "terriajs/lib/Traits/TraitsClasses/Table/ColorStyleTraits";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import CustomDataSource from "terriajs-cesium/Source/DataSources/CustomDataSource";

interface IDisDataInfoProps {
  viewState: ViewState;
  terria: Terria;
}

interface disDataInfo {
  imageId: string;
  satelliteId: string;
  sensorId: string;
  dataTime: string;
  imageRowGsd: number;
  imageColumnGsd: number,
  productLevel: string,
  gridId: string,
  left: number,
  right: number,
  top: number,
  bottom: number,
  geom: string,
  filePath: string,
  thumbPath: string,
  delFlag: null;
}

export const DisDataInfo: FC<IDisDataInfoProps> = observer(({ viewState, terria }) => {
  // 记录当前所选数据的ID，用于改变样式
  const [selectedOption, setSelectedOption] = useState('');
  const handleOptionSelect = (dataID: string) => {  
    setSelectedOption(dataID);
  };

  // 记录当前所绘制的多边形，用于更新时删除旧多边形，绘制新多边形
  const [currentEntity, setCurrentEntity] = useState(() => new GeoJsonCatalogItem("current", terria));
  const entityChange = (data: disDataInfo) => {
    const updatedEntity = highLight(data, currentEntity);  
    setCurrentEntity(updatedEntity);
  }

  // 当选择一个数据盒子时，将样式设为高亮，并在地图上绘制多边形范围，显示出来
  const highLight = (data: disDataInfo, preEntity: GeoJsonCatalogItem) : GeoJsonCatalogItem => {
    handleOptionSelect(data.imageId);
    
    // 创建符合zoomTo函数的Rectangle实例
    const currentRectangle = Rectangle.fromDegrees(data.left, data.bottom, data.right, data.top);

    // 根据正方形坐标，移动视图到相应位置。两个参数：位置参数，动画时间
    terria.currentViewer.zoomTo(
      currentRectangle,
      1
    );

    terria.overlays.remove(preEntity);

    // 创建实体对象
    const polygonItem = new GeoJsonCatalogItem(data.imageId, terria);

    // 将实体对象设置为多边形
    polygonItem.setTrait(CommonStrata.user, "geoJsonData", {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [data.left, data.top],
            [data.right, data.top],
            [data.right, data.bottom],
            [data.left, data.bottom],
            [data.left, data.top]
          ]
        ]
      }
    });

    // 设置实体对象的样式
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
          nullColor: "rgb(255,255,0)"
        })
      })
    );

    // 设置实体对象的透明度
    polygonItem.setTrait(CommonStrata.user, "opacity", 0.2);

    // 添加多边形到地球体中
    terria.overlays.add(polygonItem);

    // 将当前创建的对象返回出去
    return polygonItem;
  }

  // 记录当前所展示的图片，用于更新时删除旧图片，展示新图片
  const [currentImage, setCurrentImage] = useState(() => new SingleTileImageryCatalogItem("current", terria));
  const imageChange = (data: disDataInfo) => {
    const updatedImage = showImage(data, currentImage);  
    setCurrentImage(updatedImage);
  }

  // 当选择一个数据盒子时，将样式设为高亮，并在地图上显示图片
  const showImage = (data: disDataInfo, preImage: SingleTileImageryCatalogItem): SingleTileImageryCatalogItem => {
    handleOptionSelect(data.imageId);

    // 创建符合zoomTo函数的Rectangle实例
    const currentRectangle = Rectangle.fromDegrees(data.left, data.bottom, data.right, data.top);

    // 根据正方形坐标，移动视图到相应位置。两个参数：位置参数，动画时间
    terria.currentViewer.zoomTo(
      currentRectangle,
      1
    );

    terria.overlays.remove(preImage);

    // 图片的后端路径
    const imagePath: string = `http://10.106.12.19:8102/disaster/file/image?imagePath=${data.thumbPath}`;
    // const imagePath: string = "http://10.106.12.19:8102/disaster/file/image?imagePath=/app/disasterdata/R-C.png";
    // const imagePath: string = "http://10.106.12.19:8102/disaster/file/image?imagePath=/app/disasterdata/R-B.jpeg";

    // 创建实体对象
    const imageItem = new SingleTileImageryCatalogItem(data.imageId, terria);
    
    // 设置实体对象的路径
    imageItem.setTrait(CommonStrata.user, "url", imagePath);
    imageItem.setTrait(CommonStrata.user, "clipToRectangle", false);

    imageItem.setTrait(
      CommonStrata.user, 
      "rectangle", 
      new Rectangle(
        data.left,
        data.bottom,
        data.right, 
        data.top
      )
    );

    terria.overlays.add(imageItem);
    terria.workbench.add(imageItem);


    // const czmlItem = new CzmlCatalogItem(data.imageId, terria);

    // const billboard = {
    //   image: imagePath,
    //   width: 100,
    //   height: 100
    // }

    // const document = {
    //   id: "document",
    //   name: "GF_Data",
    //   version: "1.0"
    // };

    // const marker = {
    //   name: "GF",
    //   position: data.left,
    //   billboard: billboard
    // }

    // czmlItem.setTrait(CommonStrata.user, "czmlData", [document, marker]);

    // czmlItem.setTrait(
    //   CommonStrata.user, 
    //   "rectangle", 
    //   new Rectangle(
    //     data.left,
    //     data.bottom,
    //     data.right, 
    //     data.top
    //   )
    // );

    // terria.overlays.add(czmlItem);
    // terria.workbench.add(czmlItem);

    return imageItem;
  }




  
  // 新尝试
  
 
  // 当选择一个数据盒子时，将样式设为高亮，并在地图上显示图片
  const showImage2 = (data: disDataInfo) => {
    handleOptionSelect(data.imageId);

    // 创建符合zoomTo函数的Rectangle实例
    const currentRectangle = Rectangle.fromDegrees(data.left, data.bottom, data.right, data.top);

    // 根据正方形坐标，移动视图到相应位置。两个参数：位置参数，动画时间
    terria.currentViewer.zoomTo(
      currentRectangle,
      1
    );

    // 图片的后端路径
    //  const imagePath: string = `http://10.106.12.19:8102/disaster/file/image?imagePath=${data.thumbPath}`;
    const imagePath: string = "http://10.106.12.19:8102/disaster/file/image?imagePath=/app/disasterdata/R-C.png";
    // const imagePath: string = "http://10.106.12.19:8102/disaster/file/image?imagePath=/app/disasterdata/R-B.jpeg";

    // 创建实体对象
    const rectangle = {
      name: "Rectangle",
      id: "rectangle",
      rectangle: {
        coordinates: new Rectangle(
          data.left,
          data.bottom,
          data.right, 
          data.top
        ),
        material: imagePath,
      }
    }

    const rectangleItem = new CsvCatalogItem(data.imageId, terria, undefined);
    rectangleItem.setTrait(CommonStrata.user, "url", imagePath);
    rectangleItem.setTrait(
      CommonStrata.user, 
      "rectangle", 
      new Rectangle(
        data.left,
        data.bottom,
        data.right, 
        data.top
      )
    );
    // const rectangleEntities = new CustomDataSource("polygons");
    
    // rectangleEntities.entities.add(rectangle as any);

    
    terria.overlays.add(rectangleItem);
    terria.workbench.add(rectangleItem);

  }






  // 此为每个数据盒子的下载功能
  const downloadData = (dataPaths:string) => {
    const queryString = `filePaths=${encodeURIComponent(dataPaths)}`;
    const url = `http://10.106.12.19:8102/disaster/file/download?${queryString}`;

    // 直接在浏览器中打开URL开始下载
    window.location.href = url;
  }

  return (
    <div className={Styles.content}>
     {/* 将盒子样式定义为Styles.content,就有右侧的垂直滚动条, 
         在Panels/InnerPanel组件最后一行找到的,调用定义好的scss样式*/}
      
      {viewState.ArrDisData.map((data) => (
        <>
          {/* 将整个数据盒子设置为一个按钮，鼠标移动到上面时变为手指，点击后样式改变 */}
          <Box flex scroll gap={5} style={{ cursor: "pointer"}} key={data.imageId} onClick={() => imageChange(data)}>

            {/* 根据selectedOption变量判断是否为选择的数据，改变样式 */}
            {selectedOption === data.imageId ? 
              // 此样式为被选择时高亮的样式
              <Box displayInlineBlock fullWidth backgroundColor={"rgba(255,255,255,1)"} key={`data.imageId${-1}`}>
                <Text medium textLightDimmed highlightLinks color={"rgba(0,0,0,1)"}>
                  数据ID：{data.imageId} <br />
                  格网ID：{data.gridId} <br />
                  行分辨率：{data.imageRowGsd} <br />
                  列分辨率：{data.imageColumnGsd}
                </Text>

                <Box justifySpaceBetween>
                  <Text medium textLightDimmed highlightLinks color={"rgba(0,0,0,1)"}>
                    日期：{data.dataTime.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")}
                  </Text>

                  <button onClick={() => downloadData(data.filePath)}>
                    <StyledIcon glyph={Icon.GLYPHS.downloadNew} styledWidth={"10px"} />
                  </button>
                </Box>
              </Box>

              :
              // 此样式为默认样式 
              <Box displayInlineBlock fullWidth style={{ borderBottom: '1px solid white' }} key={`data.imageId${-0}`}> 
                <Text medium textLightDimmed highlightLinks>
                  数据ID：{data.imageId} <br />
                  格网ID：{data.gridId} <br />
                  行分辨率：{data.imageRowGsd} <br />
                  列分辨率：{data.imageColumnGsd}
                </Text>

                <Box justifySpaceBetween>
                  <Text medium textLightDimmed highlightLinks>
                    日期：{data.dataTime.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")}
                  </Text>

                  <button onClick={() => downloadData(data.filePath)}>
                    <StyledIcon glyph={Icon.GLYPHS.downloadNew} styledWidth={"10px"} />
                  </button>
                </Box>
              </Box>
            }
            
          </Box>

          <Spacing bottom={2} />  
        </>
      ))}
    </div>
  );
});