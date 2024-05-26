import React from "react";
import { observer } from "mobx-react";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";
import Icon, { StyledIcon } from "terriajs/lib/Styled/Icon";
import Button from "terriajs/lib/Styled/Button";
import styled from "styled-components";

interface ITypeConditionProps {
  viewState: ViewState;
}

export const TypeCondition: React.FC<ITypeConditionProps> = observer(({ viewState }) => {

  // 按钮响应功能
  const onAddDataSetClicked: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    // viewState.setTopElement(DataSetWindowElementName);
    viewState.openDataSet();
  };

  return (
    <div
      css={`
        display: flex;
      `}
    >
      <p style={{ margin: 0, width: 80, height: 25 }}>数据集：</p>
      <div>
        <PrintButton 
          primary
          onClick={onAddDataSetClicked}
          shortMinHeight
        >
          <StyledIcon glyph={Icon.GLYPHS.add} light styledWidth={"20px"} />
        </PrintButton>

        <input type="text" value={viewState.typeInfo} readOnly style={{ height: "2rem" }}/>

      </div> 
    </div>
  );
});

const PrintButton = styled(Button)`
  padding: 0 0;
  width: 20px;  
  height: 20px;
  min-height: 20px;
  border-radius: 20px; 
`;