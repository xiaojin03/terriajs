import React, { FC, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Terria from "terriajs/lib/Models/Terria";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import Box from "terriajs/lib/Styled/Box";
import Spacing from "terriajs/lib/Styled/Spacing";
import { FilterCondition } from "terriajs/lib/CAUViews/FilterPanel/FilterCondition/FilterCondition";
import { DisFuncSection } from "terriajs/lib/CAUViews/FilterPanel/FilterFunc/DisFuncSection";

interface IFilterPanelContentProps {
  terria: Terria;
  viewState: ViewState;
  closePanel: () => void;
}

export const FilterPanelContent: FC<IFilterPanelContentProps> = ({
  terria,
  viewState,
  closePanel
}) => {
  const { t } = useTranslation();
  
  const zaiqian = "http://10.106.12.19:8102/disaster/area/searchDatasetPre";
  const zaihou = "http://10.106.12.19:8102/disaster/area/searchDatasetPost";

  const preBtnText = "灾前数据";
  const postBtnText = "灾后数据";

  const [backText, setBackText] = useState(preBtnText);
  const [backPath, setBackPath] = useState(zaiqian);

  const eventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBackText(event.target.value);
    if (event.target.value === preBtnText) {
      setBackPath(zaiqian);
    } else {
      setBackPath(zaihou);
    }
  }


  return (
    <Box paddedRatio={2} column>
      <FilterCondition
        viewState={viewState}
        terria={terria}
      />
      <Spacing bottom={2} /> 

      {/* 国外的设置 */}
      <div
        css={`
          display: flex;
        `}
      >
        <p style={{ margin: 0, width: 120, height: 25 }}>检索数据选择：</p> 
        <select 
          style={{ width: 100, height: 25 }} 
          value={backText}
          onChange={eventChange}
        >
          <option key={0} value={preBtnText}>{"灾前数据"}</option>
          <option key={1} value={postBtnText}>{"灾后数据"}</option>
        </select>
      </div>

      <Spacing bottom={2} /> 
      <DisFuncSection
        viewState={viewState}
        terria={terria}
        btnText={"数据检索"}
        backendPath={backPath}
      />

    </Box>
  )
};