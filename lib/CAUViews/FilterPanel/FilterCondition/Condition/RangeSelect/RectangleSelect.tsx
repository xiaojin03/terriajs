import React, { useState, useEffect } from "react";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import Terria from "terriajs/lib/Models/Terria";
import styled from "styled-components";
import Box from "terriajs/lib/Styled/Box";
import { TextSpan } from "terriajs/lib/Styled/Text";
import Button from "terriajs/lib/Styled/Button";
import Icon, { StyledIcon } from "terriajs/lib/Styled/Icon";

import RectangleSelectClass from "./RectangleSelectClass";

interface IRectangleSelectProps {
  viewState: ViewState;
  terria: Terria;
}

export const RectangleSelect: React.FC<IRectangleSelectProps> = ({ viewState, terria }) => {
   const rectangleFunc = () => {
    viewState.searchRangeClear();
    const RectangleSelect = new RectangleSelectClass({viewState, terria});
    RectangleSelect.activate();
    
  }


  return (
    <Box gap>
      <p style={{ margin: 0, width: 37, height: 20 }}>矩形:</p> 
      <button onClick={rectangleFunc}
        style={{ border: '0', padding: '0', height: 20, width: 20}}>
        <StyledIcon glyph={Icon.GLYPHS.rect} 
          styledWidth={"20px"} 
          styledHeight={"20px"}
        />
      </button>
    </Box>
  );
}