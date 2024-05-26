import React, { FC, useCallback, useMemo, useState } from "react";
import Terria from "terriajs/lib/Models/Terria";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import Box from "terriajs/lib/Styled/Box";
import Spacing from "terriajs/lib/Styled/Spacing";
import { TypeCondition } from "terriajs/lib/CAUViews/FilterPanel/FilterCondition/Condition/TypeSelect/TypeCondtion";
import { CantonSelect } from "terriajs/lib/CAUViews/FilterPanel/FilterCondition/Condition/RangeSelect/CantonSelect";
import { PointSelect } from "terriajs/lib/CAUViews/FilterPanel/FilterCondition/Condition/RangeSelect/PointSelect";
import { SquareSelect } from "terriajs/lib/CAUViews/FilterPanel/FilterCondition/Condition/RangeSelect/SquareSelect";
import { RectangleSelect } from "terriajs/lib/CAUViews/FilterPanel/FilterCondition/Condition/RangeSelect/RectangleSelect";
import { PolygonSelect } from "terriajs/lib/CAUViews/FilterPanel/FilterCondition/Condition/RangeSelect/PolygonSelect";
import { DateSelect } from "terriajs/lib/CAUViews/FilterPanel/FilterCondition/Condition/DateSelect/DateSelect";

interface IFilterConditionProps {
  terria: Terria;
  viewState: ViewState;
}

export const FilterCondition: FC<IFilterConditionProps> = ({
  terria,
  viewState,
}) => {

  return (
    <>
      {/* <TypeCondition
         viewState={viewState}
      />
      <Spacing bottom={2} /> */}

      <Box gap>
        <p style={{ margin: 0, width: 80, height: 25 }}>地图选择：</p>

        <PointSelect
          viewState={viewState}
          terria={terria}
        />
        <Spacing right={2} />

        <RectangleSelect
          viewState={viewState}
          terria={terria}
        />
        <Spacing right={2} />

        <PolygonSelect
          viewState={viewState}
          terria={terria}
        />
      </Box>
      <Spacing bottom={2} />

      <DateSelect
         viewState={viewState}
      />
      <Spacing bottom={2} />
    </>
  )
}