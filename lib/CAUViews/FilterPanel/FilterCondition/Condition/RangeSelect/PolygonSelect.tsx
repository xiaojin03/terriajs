import React, { useState, useEffect } from "react";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import Terria from "terriajs/lib/Models/Terria";
import styled from "styled-components";
import Box from "terriajs/lib/Styled/Box";
import { TextSpan } from "terriajs/lib/Styled/Text";
import Button from "terriajs/lib/Styled/Button";
import Icon, { StyledIcon } from "terriajs/lib/Styled/Icon";

import PolygonSelectClass from "./PolygonSelectClass";

interface IPolygonSelectProps {
  viewState: ViewState;
  terria: Terria;
}

export const PolygonSelect: React.FC<IPolygonSelectProps> = ({ viewState, terria }) => {
   const polygonFunc = () => {
    viewState.searchRangeClear();
    const polygonSelect = new PolygonSelectClass({viewState, terria});
    polygonSelect.activate();
    
  }


  return (
    <Box gap>
      <p style={{ margin: 0, width: 47, height: 20 }}>多边形:</p> 
      <button onClick={polygonFunc}
        style={{ border: '0', padding: '0', height: 20, width: 20}}>
        <StyledIcon glyph={Icon.GLYPHS.poly} 
          styledWidth={"20px"} 
          styledHeight={"20px"}
        />
      </button>
    </Box>
  );
}