import React from "react";
import { observer } from "mobx-react";
import ViewState from "terriajs/lib/ReactViewModels/ViewState";

interface IDateSelectProps {
  viewState: ViewState;
}

export const DateSelect: React.FC<IDateSelectProps> = observer(({viewState}) => {
  return (
    <div
      css={`
        display: flex;
      `}
    >
      <p style={{ margin: 0, width: 80, height: 25 }}>时间范围：</p>
      <input
        style={{ width: 120, height: 25 }}
        type="date"
        id="left-date"
        name="left-date"
        value={viewState.leftDate}
        onChange={(e) => viewState.handleLeftDateChange(e.target.value)}
      />
      <p style={{ margin: 0, height: 25 }}>~</p>
      <input
        style={{ width: 120, height: 25 }}
        type="date"
        id="right-date"
        name="right-date"
        value={viewState.rightDate}
        onChange={(e) => viewState.handleRightDateChange(e.target.value)}
      />
    </div>
  );
});
